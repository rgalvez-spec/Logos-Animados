import { GIFEncoder, quantize, applyPalette } from 'gifenc';

/**
 * High-speed client-side animated GIF encoder using gifenc
 */
export async function recordCanvasToGif(
  canvas: HTMLCanvasElement,
  totalDurationMs: number = 2400,
  fps: number = 24,
  onProgress?: (progressPercent: number) => void
): Promise<Blob> {
  const gif = GIFEncoder();
  const totalFrames = Math.max(10, Math.round((totalDurationMs / 1000) * fps));
  const delay = Math.round(1000 / fps);

  // Offscreen canvas to scale/grab RGBA
  const exportWidth = Math.min(canvas.width, 480);
  const exportHeight = Math.round((exportWidth / canvas.width) * canvas.height);

  const offscreen = document.createElement('canvas');
  offscreen.width = exportWidth;
  offscreen.height = exportHeight;
  const ctx = offscreen.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Cannot get 2d context for GIF export');

  const frameIntervalMs = 1000 / fps;

  for (let i = 0; i < totalFrames; i++) {
    // Wait for frame interval
    await new Promise((r) => setTimeout(r, frameIntervalMs * 0.9));

    ctx.clearRect(0, 0, exportWidth, exportHeight);
    ctx.drawImage(canvas, 0, 0, exportWidth, exportHeight);

    const { data } = ctx.getImageData(0, 0, exportWidth, exportHeight);
    // Quantize to 256 color palette
    const palette = quantize(data, 256);
    const index = applyPalette(data, palette);

    gif.writeFrame(index, exportWidth, exportHeight, {
      palette,
      delay,
      repeat: 0, // loop forever
    });

    if (onProgress) {
      onProgress(Math.round(((i + 1) / totalFrames) * 100));
    }
  }

  gif.finish();
  const buffer = gif.bytes();
  return new Blob([buffer as any], { type: 'image/gif' });
}
