import Joi from 'joi';

/**
 * Schema tạo đơn hàng
 */
export const createOrderSchema = Joi.object({
  packageId: Joi.string()
    .required()
    .messages({
      'any.required': 'Vui lòng chọn gói dịch vụ'
    }),
  
  requirements: Joi.array()
    .items(
      Joi.object({
        feature: Joi.string().required(),
        description: Joi.string().allow('').default(''),
        priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium')
      })
    )
    .default([]),
  
  description: Joi.string()
    .max(2000)
    .allow('')
    .default(''),
  
  discordServerId: Joi.string()
    .allow(null, '')
    .default(null),
  
  discordServerName: Joi.string()
    .max(100)
    .allow(null, '')
    .default(null),
  
  discordInviteLink: Joi.string()
    .uri()
    .allow(null, '')
    .default(null),
  
  paymentMethod: Joi.string()
    .valid('qr_code', 'bank_transfer', 'wallet', 'card')
    .default('qr_code')
});

/**
 * Schema cập nhật đơn hàng (admin)
 */
export const updateOrderSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'processing', 'completed', 'cancelled', 'refunded')
    .optional(),
  
  paymentStatus: Joi.string()
    .valid('pending', 'paid', 'failed', 'refunded')
    .optional(),
  
  assignedTo: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      'string.pattern.base': 'ID người xử lý không hợp lệ'
    }),
  
  estimatedCompletionDate: Joi.date()
    .iso()
    .min('now')
    .optional()
    .messages({
      'date.min': 'Ngày hoàn thành dự kiến phải trong tương lai'
    }),
  
  internalNotes: Joi.string()
    .max(2000)
    .allow('')
    .optional(),
  
  discountAmount: Joi.number()
    .min(0)
    .optional()
});

/**
 * Schema đánh giá đơn hàng
 */
export const reviewOrderSchema = Joi.object({
  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required()
    .messages({
      'number.base': 'Đánh giá phải là số',
      'number.min': 'Đánh giá tối thiểu là 1 sao',
      'number.max': 'Đánh giá tối đa là 5 sao',
      'any.required': 'Vui lòng chọn số sao đánh giá'
    }),
  
  review: Joi.string()
    .max(1000)
    .allow('')
    .default('')
});

/**
 * Schema query danh sách đơn hàng
 */
export const listOrdersQuerySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10),
  
  status: Joi.string()
    .valid('pending', 'processing', 'completed', 'cancelled', 'refunded')
    .optional(),
  
  paymentStatus: Joi.string()
    .valid('pending', 'paid', 'failed', 'refunded')
    .optional(),
  
  sortBy: Joi.string()
    .valid('createdAt', 'updatedAt', 'totalPrice', 'status')
    .default('createdAt'),
  
  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .default('desc'),
  
  search: Joi.string()
    .max(100)
    .allow('')
    .optional()
});

/**
 * Schema query thống kê đơn hàng
 */
export const orderStatsQuerySchema = Joi.object({
  startDate: Joi.date()
    .iso()
    .optional(),
  
  endDate: Joi.date()
    .iso()
    .min(Joi.ref('startDate'))
    .optional()
    .messages({
      'date.min': 'Ngày kết thúc phải sau ngày bắt đầu'
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

    req.body = value;
    next();
  };
};
