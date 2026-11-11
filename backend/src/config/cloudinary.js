import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true
});

function ensureConfigured() {
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    const error = new Error('Cloudinary is not configured');
    error.status = 503;
    throw error;
  }
}

export function uploadRegistrationDocument(file, reference, documentType) {
  ensureConfigured();
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({
      folder: `natraj-mobile/dealer-registration/${reference}`,
      public_id: `${documentType}-${Date.now()}`,
      resource_type: 'auto',
      type: 'authenticated',
      use_filename: false,
      overwrite: false
    }, (error, result) => error ? reject(error) : resolve(result));
    stream.end(file.buffer);
  });
}

export async function deleteCloudinaryAsset(publicId, resourceType = 'image') {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType, type: 'authenticated', invalidate: true });
}

export function signedDocumentUrl(publicId, resourceType = 'image') {
  ensureConfigured();
  return cloudinary.url(publicId, { resource_type: resourceType, type: 'authenticated', sign_url: true, secure: true, expires_at: Math.floor(Date.now() / 1000) + 300 });
}
