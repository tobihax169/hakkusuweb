import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as DiscordStrategy } from 'passport-discord';
import User from '../models/User.js';
import { logger } from '../utils/logger.js';

// Cấu hình JWT Strategy
const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key-for-development-only';

if (!process.env.JWT_SECRET) {
  logger.warn('JWT_SECRET not set in environment, using fallback. Please set JWT_SECRET in production!');
}

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await User.findById(payload.id).select('-password');
      
      if (user) {
        return done(null, user);
      }
      
      return done(null, false);
    } catch (error) {
      logger.error('JWT Strategy Error:', error);
      return done(error, false);
    }
  })
);

// Cấu hình Discord OAuth2 Strategy (chỉ nếu có đủ thông tin)
if (process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET) {
  const discordOptions = {
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL || 'http://localhost:5000/api/auth/discord/callback',
    scope: ['identify', 'email']
  };

  passport.use(
    new DiscordStrategy(
      discordOptions,
      async (accessToken, refreshToken, profile, done) => {
      try {
        // Tìm user theo discordId
        let user = await User.findOne({ discordId: profile.id });

        if (user) {
          // Cập nhật thông tin nếu cần
          user.discordUsername = profile.username;
          user.discordAvatar = profile.avatar 
            ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
            : null;
          await user.save();
          
          return done(null, user);
        }

        // Tạo user mới nếu chưa tồn tại
        user = new User({
          discordId: profile.id,
          discordUsername: profile.username,
          discordAvatar: profile.avatar 
            ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
            : null,
          email: profile.email,
          username: profile.username,
          // Đánh dấu user đăng ký qua Discord chưa có mật khẩu
          password: null,
          isDiscordUser: true
        });

        await user.save();
        return done(null, user);
      } catch (error) {
        logger.error('Discord Strategy Error:', error);
        return done(error, false);
      }
    }
    )
  );
} else {
  logger.info('Discord OAuth not configured - skipping Discord strategy');
}

// Serialize và Deserialize user cho session (nếu cần)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
