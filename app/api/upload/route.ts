import { NextResponse } from 'next/server'
import { uploadImage } from '@/lib/cloudinary'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No se envió ningún archivo' }, { status: 400 })
    }

    const mimeType = file.type
    const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return NextResponse.json(
        { error: 'Tipo de archivo no permitido. Usa JPEG, PNG, WEBP o AVIF.' },
        { status: 400 }
      )
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'El archivo supera el límite de 10MB' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // folder products por defecto
    const result = await uploadImage(buffer, mimeType, 'products')

    return NextResponse.json({ url: result.secure_url, publicId: result.public_id })
  } catch (error: unknown) {
    console.error('Error en upload route:', error)
    return NextResponse.json(
      { error: (error as Error).message || 'Error al subir la imagen' },
      { status: 500 }
    )
  }
}
