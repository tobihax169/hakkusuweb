import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import path from 'path';
import { catchAsync, APIError } from '../middleware/errorHandler.js';

const ALLOWED = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
};

const MAX_BYTES = parseInt(process.env.UPLOAD_IMAGE_MAX_BYTES || String(5 * 1024 * 1024), 10);

function getS3Client() {
  const region = process.env.S3_REGION || 'auto';
  const endpoint = process.env.S3_ENDPOINT || undefined;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  if (!accessKeyId || !secretAccessKey || !process.env.S3_BUCKET) {
    return null;
  }
  return new S3Client({
    region,
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: Boolean(endpoint)
  });
}

/**
 * POST /api/uploads/product-image-presign
 * Seller-only. Returns a short-lived PUT URL + public URL for the object.
 */
export const presignProductImage = catchAsync(async (req, res) => {
  const client = getS3Client();
  if (!client) {
    throw new APIError(
      'Chưa cấu hình object storage (S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET, S3_PUBLIC_BASE_URL)',
      503
    );
  }

  const contentType = (req.body?.contentType || '').trim().toLowerCase();
  const ext = ALLOWED[contentType];
  if (!ext) {
    throw new APIError('Chỉ chấp nhận image/jpeg, image/png, image/webp', 400);
  }

  const bucket = process.env.S3_BUCKET;
  const publicBase = (process.env.S3_PUBLIC_BASE_URL || '').replace(/\/$/, '');
  if (!publicBase) {
    throw new APIError('Thiếu biến môi trường S3_PUBLIC_BASE_URL', 503);
  }

  const safeName = (req.body?.fileName || 'image')
    .toString()
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .slice(0, 80);
  const base = path.basename(safeName) || 'image';
  const key = `products/${req.user._id}/${Date.now()}-${randomUUID()}-${base}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 120 });
  const publicUrl = `${publicBase}/${key}`;

  res.status(200).json({
    success: true,
    data: {
      uploadUrl,
      publicUrl,
      key,
      maxBytes: MAX_BYTES,
      contentType
    }
  });
});
