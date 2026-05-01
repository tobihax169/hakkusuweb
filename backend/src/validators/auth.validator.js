import Joi from 'joi';

/**
 * Schema đăng ký
 */
export const registerSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(30)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .required()
    .messages({
      'string.min': 'Username phải có ít nhất 3 ký tự',
      'string.max': 'Username không được quá 30 ký tự',
      'string.pattern.base': 'Username chỉ được chứa chữ cái, số và dấu gạch dưới',
      'any.required': 'Username là bắt buộc'
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email không hợp lệ',
      'any.required': 'Email là bắt buộc'
    }),
  
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
      'any.required': 'Mật khẩu là bắt buộc'
    }),
  
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Mật khẩu xác nhận không khớp',
      'any.required': 'Xác nhận mật khẩu là bắt buộc'
    })
});

/**
 * Schema đăng nhập
 */
export const loginSchema = Joi.object({
  identifier: Joi.string()
    .required()
    .messages({
      'any.required': 'Email hoặc username là bắt buộc'
    }),
  
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Mật khẩu là bắt buộc'
    })
});

/**
 * Schema cập nhật profile
 */
export const updateProfileSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(30)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .optional()
    .messages({
      'string.min': 'Username phải có ít nhất 3 ký tự',
      'string.max': 'Username không được quá 30 ký tự',
      'string.pattern.base': 'Username chỉ được chứa chữ cái, số và dấu gạch dưới'
    }),
  
  language: Joi.string()
    .valid('vi', 'en')
    .optional(),
  
  theme: Joi.string()
    .valid('dark', 'light', 'auto')
    .optional()
});

/**
 * Schema đổi mật khẩu
 */
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'any.required': 'Mật khẩu hiện tại là bắt buộc'
    }),
  
  newPassword: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Mật khẩu mới phải có ít nhất 6 ký tự',
      'any.required': 'Mật khẩu mới là bắt buộc'
    }),
  
  confirmNewPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Mật khẩu xác nhận không khớp',
      'any.required': 'Xác nhận mật khẩu mới là bắt buộc'
    })
});

/**
 * Schema quên mật khẩu
 */
export const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email không hợp lệ',
      'any.required': 'Email là bắt buộc'
    })
});

/**
 * Schema reset mật khẩu
 */
export const resetPasswordSchema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      'any.required': 'Token là bắt buộc'
    }),
  
  newPassword: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Mật khẩu mới phải có ít nhất 6 ký tự',
      'any.required': 'Mật khẩu mới là bắt buộc'
    })
});

/**
 * Middleware validate
 */
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors
      });
    }

    // Thay thế req.body bằng dữ liệu đã validate và làm sạch
    req.body = value;
    next();
  };
};
