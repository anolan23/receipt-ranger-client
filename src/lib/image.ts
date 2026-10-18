const MAX_SIDE = 2400;
const MAX_BYTES = 4_000_000; // the receipts bucket and parse-receipt reject images over 5MB
const PASSTHROUGH_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function toBlob(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', quality)
  );
}

/**
 * Re-encodes a photo as a JPEG that fits the upload limit. This also converts formats the
 * backend can't read (e.g. HEIC from an iPhone) when the browser can decode them.
 */
export async function prepareImage(file: File): Promise<Blob> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    if (PASSTHROUGH_TYPES.includes(file.type) && file.size <= MAX_BYTES) {
      return file;
    }
    throw new Error(
      "This browser can't read that image. Try a JPEG or PNG photo."
    );
  }

  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext('2d');
  if (!context) throw new Error("This browser can't process images.");
  context.fillStyle = '#fff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  for (const quality of [0.85, 0.7, 0.5]) {
    const blob = await toBlob(canvas, quality);
    if (blob && blob.size <= MAX_BYTES) return blob;
  }
  throw new Error('That image is too large to upload.');
}
