import User from '../models/User.js';
import { createAuthResponse, generatePasswordResetToken } from '../utils/token.js';
import { catchAsync, APIError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import Log from '../models/Log.js';

/**
 * Đăng ký tài khoản mới
 * POST /api/auth/register
 */
export const register = catchAsync(async (req, res) => {
  const { username, email, password } = req.body;

  // Kiểm tra email đã tồn tại
  const existingEmail = await User.findOne({ email: email.toLowerCase() });
  if (existingEmail) {
    throw new APIError('Email đã được sử dụng', 409);
  }

  // Kiểm tra username đã tồn tại
  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    throw new APIError('Username đã tồn tại', 409);
  }

  // Tạo user mới
  const user = new User({
    username,
    email: email.toLowerCase(),
    password,
    isDiscordUser: false
  });

  await user.save();

  // Log
  await Log.createLog({
    type: 'auth',
    level: 'info',
    message: `User đăng ký thành công: ${email}`,
    userId: user._id,
    userEmail: user.email,
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });

  // Tạo token và trả về
  const authResponse = createAuthResponse(user);

  res.status(201).json({
    success: true,
    message: 'Đăng ký thành công',
    ...authResponse
  });
});

/**
 * Đăng nhập bằng email/username và password
 * POST /api/auth/login
 */
export const login = catchAsync(async (req, res) => {
  const { identifier, password } = req.body;

  // Tìm user theo email hoặc username
  const user = await User.findByCredentials(identifier);

  if (!user) {
    throw new APIError('Email/Username hoặc mật khẩu không đúng', 401);
  }

  // Kiểm tra password
  if (!user.password) {
    throw new APIError('Tài khoản này không hỗ trợ đăng nhập bằng mật khẩu', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new APIError('Email/Username hoặc mật khẩu không đúng', 401);
  }

  // Kiểm tra tài khoản bị khóa/cấm
  if (!user.isActive) {
    throw new APIError('Tài khoản đã bị vô hiệu hóa', 403);
  }

  if (user.isBanned) {
    throw new APIError(`Tài khoản đã bị cấm: ${user.banReason || 'Không có lý do'}`, 403);
  }

  // Cập nhật thống kê đăng nhập
  await user.updateLoginStats();

  // Log
  await Log.createLog({
    type: 'auth',
    level: 'info',
    message: `User đăng nhập thành công: ${user.email}`,
    userId: user._id,
    userEmail: user.email,
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });

  // Tạo token và trả về
  const authResponse = createAuthResponse(user);

  res.json({
    success: true,
    message: 'Đăng nhập thành công',
    ...authResponse
  });
});

/**
 * Lấy thông tin user hiện tại
 * GET /api/auth/me
 */
export const getMe = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  res.json({
    success: true,
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
      lastLogin: user.lastLogin,
      loginCount: user.loginCount,
      createdAt: user.createdAt
    }
  });
});

/**
 * Cập nhật profile
 * PUT /api/auth/profile
 */
export const updateProfile = catchAsync(async (req, res) => {
  const updates = {};
  const allowedFields = ['username', 'language', 'theme'];

  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  // Nếu đổi username, kiểm tra trùng
  if (updates.username && updates.username !== req.user.username) {
    const existing = await User.findOne({ username: updates.username });
    if (existing) {
      throw new APIError('Username đã tồn tại', 409);
    }
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updates,
    { new: true, runValidators: true }
  ).select('-password');

  // Log
  await Log.createLog({
    type: 'user',
    level: 'info',
    message: `User cập nhật profile`,
    userId: user._id,
    details: updates
  });

  res.json({
    success: true,
    message: 'Cập nhật profile thành công',
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      language: user.language,
      theme: user.theme
    }
  });
});

/**
 * Đổi mật khẩu
 * PUT /api/auth/change-password
 */
export const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  // Verify current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new APIError('Mật khẩu hiện tại không đúng', 400);
  }

  // Update password
  user.password = newPassword;
  await user.save();

  // Log
  await Log.createLog({
    type: 'auth',
    level: 'info',
    message: `User đổi mật khẩu`,
    userId: user._id
  });

  res.json({
    success: true,
    message: 'Đổi mật khẩu thành công'
  });
});

/**
 * Xử lý callback Discord OAuth2
 * GET /api/auth/discord/callback
 */
export const discordCallback = catchAsync(async (req, res) => {
  // User đã được xác thực qua Passport
  const user = req.user;

  if (!user) {
    throw new APIError('Xác thực Discord thất bại', 401);
  }

  // Cập nhật thống kê
  await user.updateLoginStats();

  // Log
  await Log.createLog({
    type: 'auth',
    level: 'info',
    message: `User đăng nhập bằng Discord: ${user.discordUsername}`,
    userId: user._id
  });

  // Tạo token
  const authResponse = createAuthResponse(user);

  // Redirect về frontend với token
  const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${authResponse.token}&refreshToken=${authResponse.refreshToken}`;
  
  res.redirect(redirectUrl);
});

/**
 * Link tài khoản Discord với tài khoản hiện tại
 * POST /api/auth/link-discord
 */
export const linkDiscord = catchAsync(async (req, res) => {
  // Cần implement sau khi có Discord OAuth flow riêng
  // Hoặc sử dụng passport.authenticate trong route
  res.json({
    success: true,
    message: 'Chức năng đang phát triển'
  });
});

/**
 * Refresh token
 * POST /api/auth/refresh
 */
export const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new APIError('Refresh token là bắt buộc', 400);
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    
    if (decoded.type !== 'refresh') {
      throw new APIError('Token không hợp lệ', 401);
    }

    const user = await User.findById(decoded.id);
    
    if (!user || !user.isActive || user.isBanned) {
      throw new APIError('Token không hợp lệ', 401);
    }

    const authResponse = createAuthResponse(user);

    res.json({
      success: true,
      ...authResponse
    });
  } catch (error) {
    throw new APIError('Refresh token không hợp lệ hoặc đã hết hạn', 401);
  }
});

/**
 * Quên mật khẩu - Gửi email reset
 * POST /api/auth/forgot-password
 */
export const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });

  // Không tiết lộ email có tồn tại hay không (security)
  if (!user) {
    return res.json({
      success: true,
      message: 'Nếu email tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu'
    });
  }

  // Không cho phép reset password cho Discord-only users
  if (user.isDiscordUser && !user.password) {
    return res.json({
      success: true,
      message: 'Nếu email tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu'
    });
  }

  // Tạo reset token
  const { token, expires, originalToken } = generatePasswordResetToken();
  
  user.resetPasswordToken = token;
  user.resetPasswordExpires = expires;
  await user.save();

  // TODO: Gửi email với originalToken
  // Trong production, gửi email thực
  // Trong development, trả về token để test
  logger.info(`Password reset token cho ${email}: ${originalToken}`);

  res.json({
    success: true,
    message: 'Nếu email tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu',
    ...(process.env.NODE_ENV !== 'production' && { resetToken: originalToken })
  });
});

/**
 * Đặt lại mật khẩu
 * POST /api/auth/reset-password
 */
export const resetPassword = catchAsync(async (req, res) => {
  const { token, newPassword } = req.body;

  // Hash token để so sánh
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    throw new APIError('Token không hợp lệ hoặc đã hết hạn', 400);
  }

  // Đặt lại mật khẩu
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  // Log
  await Log.createLog({
    type: 'auth',
    level: 'info',
    message: `User đặt lại mật khẩu thành công`,
    userId: user._id
  });

  res.json({
    success: true,
    message: 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.'
  });
});

/**
 * Đăng xuất (revoke token - optional)
 * POST /api/auth/logout
 */
export const logout = catchAsync(async (req, res) => {
  // Log
  await Log.createLog({
    type: 'auth',
    level: 'info',
    message: `User đăng xuất`,
    userId: req.user._id
  });

  res.json({
    success: true,
    message: 'Đăng xuất thành công'
  });
});
