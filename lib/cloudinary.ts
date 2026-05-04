import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export { cloudinary }

/** Tipos de archivo permitidos para subida de imágenes */
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
const MAX_FILE_SIZE_MB = 10

export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
}

/**
 * Sube una imagen a Cloudinary en la carpeta indicada.
 * Valida tipo MIME y tamaño antes de subir.
 */
export const uploadImage = async (
  file: Buffer,
  mimeType: string,
  folder: 'products' | 'quotes' | 'blog' | 'categories' | 'banners'
): Promise<CloudinaryUploadResult> => {
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    throw new Error(`Tipo de archivo no permitido: ${mimeType}`)
  }

  const fileSizeMB = file.byteLength / (1024 * 1024)
  if (fileSizeMB > MAX_FILE_SIZE_MB) {
    throw new Error(`El archivo supera el límite de ${MAX_FILE_SIZE_MB}MB`)
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `maderarte/${folder}`,
        resource_type: 'image',
        transformation: [
          { quality: 'auto:good', fetch_format: 'webp' },
        ],
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error('Error desconocido al subir imagen'))
          return
        }
        resolve({
          public_id: result.public_id,
          secure_url: result.secure_url,
          width: result.width,
          height: result.height,
          format: result.format,
        })
      }
    )
    uploadStream.end(file)
  })
}

/**
 * Elimina una imagen de Cloudinary por su public_id.
 */
export const deleteImage = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId)
}
