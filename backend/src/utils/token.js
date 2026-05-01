import jwt from 'jsonwebtoken';
import crypto from 'crypto';

/**
 * Tạo JWT token
 * @param {Object} payload - Dữ liệu để mã hóa trong token
 * @param {String} expiresIn - Thời gian hết hạn (default: '7d')
 * @returns {String} JWT token
 */
export const generateToken = (payload, expiresIn = '7d') => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

/**
 * Verify JWT token
 * @param {String} token - Token cần verify
 * @returns {Object} Decoded payload
 */
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Tạo refresh token
 * @param {String} userId - ID của user
 * @returns {String} Refresh token
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId, type: 'refresh' },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

/**
 * Tạo random token cho email verification, reset password
 * @param {Number} bytes - Số bytes (default: 32)
 * @returns {String} Hex string
 */
export const generateRandomToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString('hex');
};

/**
 * Tạo token reset password với expiration
 * @returns {Object} { token, expires }
 */
export const generatePasswordResetToken = () => {
  const token = generateRandomToken();
  const expires = Date.now() + 60 * 60 * 1000; // 1 giờ
  
  return {
    token: crypto.createHash('sha256').update(token).digest('hex'),
    expires,
    originalToken: token // Token để gửi qua email (chưa hash)
  };
};

/**
 * Tạo token verify email
 * @returns {Object} { token, expires }
 */
export const generateEmailVerificationToken = () => {
  const token = generateRandomToken();
  const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 giờ
  
  return {
    token: crypto.createHash('sha256').update(token).digest('hex'),
    expires,
    originalToken: token
  };
};

/**
 * Tính thời gian còn lại của token (giây)
 * @param {String} token - JWT token
 * @returns {Number} Seconds remaining
 */
export const getTokenTimeRemaining = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) return 0;
    
    const now = Math.floor(Date.now() / 1000);
    return Math.max(0, decoded.exp - now);
  } catch (error) {
    return 0;
  }
};

/**
 * Tạo response data cho authentication
 * @param {Object} user - User document
 * @returns {Object} { user, token, refreshToken }
 */
export const createAuthResponse = (user) => {
  const token = generateToken({
    id: user._id,
    email: user.email,
    role: user.role
  });

  const refreshToken = generateRefreshToken(user._id);

  return {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      discordId: user.discordId,
      discordUsername: user.discordUsername,
      discordAvatar: user.discordAvatar,
      gem: user.gem,
      coin: user.coin,
      role: user.role,
      language: user.language,
      theme: user.theme,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt
    },
    token,
    refreshToken,
    expiresIn: 7 * 24 * 60 * 60 // 7 ngày tính bằng giây
  };
};
