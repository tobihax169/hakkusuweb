import api from '@/services/api.js';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Presign + PUT each file to object storage. Max 5 images.
 * @param {File[]} files
 * @returns {Promise<string[]>} public URLs
 */
export async function uploadProductImages(files, max = 5) {
  const list = Array.from(files || []).slice(0, max);
  const urls = [];

  for (const file of list) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error('Chỉ chấp nhận JPG, PNG, WebP');
    }
    const res = await api.post('/uploads/product-image-presign', {
      contentType: file.type,
      fileName: file.name
    });
    if (!res?.success || !res.data?.uploadUrl || !res.data?.publicUrl) {
      throw new Error(res?.message || 'Không lấy được link upload');
    }
    const { uploadUrl, publicUrl } = res.data;
    const put = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type }
    });
    if (!put.ok) {
      throw new Error(`Upload thất bại (${put.status})`);
    }
    urls.push(publicUrl);
  }

  return urls;
}
