import ServicePackage from '../models/ServicePackage.js';
import { catchAsync, APIError } from '../middleware/errorHandler.js';
import Log from '../models/Log.js';
import { DEFAULT_PACKAGES } from '../../../shared/constants.js';

/**
 * Lấy danh sách gói dịch vụ (public)
 * GET /api/services
 */
export const getServices = catchAsync(async (req, res) => {
  const lang = req.query.lang || req.user?.language || 'vi';
  
  const services = await ServicePackage.getActivePackages(lang);

  res.json({
    success: true,
    data: services
  });
});

/**
 * Lấy chi tiết gói dịch vụ
 * GET /api/services/:packageId
 */
export const getServiceById = catchAsync(async (req, res) => {
  const { packageId } = req.params;
  const lang = req.query.lang || req.user?.language || 'vi';

  const service = await ServicePackage.getByPackageId(packageId, lang);

  if (!service) {
    throw new APIError('Gói dịch vụ không tồn tại', 404);
  }

  res.json({
    success: true,
    data: service
  });
});

/**
 * Tạo gói dịch vụ mới (Admin)
 * POST /api/admin/services
 */
export const createService = catchAsync(async (req, res) => {
  const serviceData = req.body;

  // Kiểm tra packageId đã tồn tại
  const existing = await ServicePackage.findOne({ packageId: serviceData.packageId });
  if (existing) {
    throw new APIError('Mã gói dịch vụ đã tồn tại', 409);
  }

  const service = new ServicePackage({
    ...serviceData,
    createdBy: req.user._id
  });

  await service.save();

  // Log
  await Log.createLog({
    type: 'admin',
    level: 'info',
    message: `Tạo gói dịch vụ mới: ${serviceData.packageId}`,
    userId: req.user._id,
    targetId: service._id.toString(),
    targetType: 'service'
  });

  res.status(201).json({
    success: true,
    message: 'Tạo gói dịch vụ thành công',
    data: service
  });
});

/**
 * Cập nhật gói dịch vụ (Admin)
 * PUT /api/admin/services/:packageId
 */
export const updateService = catchAsync(async (req, res) => {
  const { packageId } = req.params;
  const updates = req.body;

  const service = await ServicePackage.findOne({ packageId });
  if (!service) {
    throw new APIError('Gói dịch vụ không tồn tại', 404);
  }

  // Cập nhật các trường cho phép
  const allowedFields = [
    'name', 'nameEn', 'description', 'descriptionEn',
    'price', 'currency', 'icon', 'iconUrl', 'features',
    'sortOrder', 'popular', 'isActive', 'limits', 'metadata'
  ];

  allowedFields.forEach(field => {
    if (updates[field] !== undefined) {
      service[field] = updates[field];
    }
  });

  service.updatedBy = req.user._id;
  await service.save();

  // Log
  await Log.createLog({
    type: 'admin',
    level: 'info',
    message: `Cập nhật gói dịch vụ: ${packageId}`,
    userId: req.user._id,
    targetId: service._id.toString(),
    targetType: 'service',
    details: updates
  });

  res.json({
    success: true,
    message: 'Cập nhật gói dịch vụ thành công',
    data: service
  });
});

/**
 * Xóa gói dịch vụ (Admin) - Chỉ xóa nếu chưa có đơn hàng
 * DELETE /api/admin/services/:packageId
 */
export const deleteService = catchAsync(async (req, res) => {
  const { packageId } = req.params;

  const service = await ServicePackage.findOne({ packageId });
  if (!service) {
    throw new APIError('Gói dịch vụ không tồn tại', 404);
  }

  // Kiểm tra có đơn hàng nào sử dụng gói này không
  const Order = (await import('../models/Order.js')).default;
  const orderCount = await Order.countDocuments({ packageId });

  if (orderCount > 0) {
    // Không xóa, chỉ vô hiệu hóa
    service.isActive = false;
    await service.save();

    await Log.createLog({
      type: 'admin',
      level: 'warn',
      message: `Vô hiệu hóa gói dịch vụ (có ${orderCount} đơn hàng): ${packageId}`,
      userId: req.user._id,
      targetId: service._id.toString(),
      targetType: 'service'
    });

    return res.json({
      success: true,
      message: `Gói dịch vụ đã bị vô hiệu hóa (có ${orderCount} đơn hàng liên quan)`
    });
  }

  await service.deleteOne();

  // Log
  await Log.createLog({
    type: 'admin',
    level: 'info',
    message: `Xóa gói dịch vụ: ${packageId}`,
    userId: req.user._id,
    targetId: packageId,
    targetType: 'service'
  });

  res.json({
    success: true,
    message: 'Xóa gói dịch vụ thành công'
  });
});

/**
 * Seed dữ liệu gói dịch vụ mặc định
 * POST /api/admin/services/seed
 */
export const seedServices = catchAsync(async (req, res) => {
  const results = {
    created: 0,
    updated: 0,
    errors: []
  };

  for (const pkg of DEFAULT_PACKAGES) {
    try {
      const existing = await ServicePackage.findOne({ packageId: pkg.id });
      
      const serviceData = {
        packageId: pkg.id,
        name: pkg.name,
        nameEn: pkg.nameEn,
        description: pkg.description,
        descriptionEn: pkg.descriptionEn,
        price: pkg.price,
        currency: pkg.currency,
        icon: pkg.icon,
        features: pkg.features.map((f, i) => ({
          text: f,
          textEn: pkg.featuresEn[i] || f,
          included: true
        })),
        popular: pkg.popular,
        isActive: pkg.isActive,
        createdBy: req.user._id
      };

      if (existing) {
        await ServicePackage.updateOne({ packageId: pkg.id }, serviceData);
        results.updated++;
      } else {
        await ServicePackage.create(serviceData);
        results.created++;
      }
    } catch (error) {
      results.errors.push({ packageId: pkg.id, error: error.message });
    }
  }

  res.json({
    success: true,
    message: 'Seed dữ liệu hoàn tất',
    data: results
  });
});
