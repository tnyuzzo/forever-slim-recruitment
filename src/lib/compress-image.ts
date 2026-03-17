/**
 * Client-side image compression via Canvas API.
 * - Resizes to max 1920px (longest side)
 * - Outputs JPEG at 0.85 quality (~200KB-800KB)
 * - Handles HEIC/HEIF on browsers that support it (Safari)
 * - Returns a new File object ready for upload
 */
export async function compressImage(
  file: File,
  maxDimension = 1920,
  quality = 0.85
): Promise<File> {
  // If already small enough and is JPEG/PNG/WebP, skip compression
  if (file.size <= 1 * 1024 * 1024 && !file.type.includes('heic') && !file.type.includes('heif')) {
    return file
  }

  const bitmap = await createImageBitmap(file)
  const { width, height } = bitmap

  // Calculate new dimensions preserving aspect ratio
  let newWidth = width
  let newHeight = height
  if (width > maxDimension || height > maxDimension) {
    if (width > height) {
      newWidth = maxDimension
      newHeight = Math.round((height / width) * maxDimension)
    } else {
      newHeight = maxDimension
      newWidth = Math.round((width / height) * maxDimension)
    }
  }

  const canvas = document.createElement('canvas')
  canvas.width = newWidth
  canvas.height = newHeight
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(bitmap, 0, 0, newWidth, newHeight)
  bitmap.close()

  const blob = await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b!), 'image/jpeg', quality)
  )

  const name = file.name.replace(/\.(heic|heif|png|webp)$/i, '.jpg')
  return new File([blob], name, { type: 'image/jpeg' })
}
