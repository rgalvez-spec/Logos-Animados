/**
 * Fast client-side Video Exporter using HTML5 Canvas & MediaRecorder
 * Exports real-time 60fps WebM or MP4 video in seconds!
 */
export async function recordCanvasToVideo(
  canvas: HTMLCanvasElement,
  durationMs: number = 3000,
  onProgress?: (progressPercent: number) => void
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      // Find supported mime type
      const mimeTypes = [
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm',
        'video/mp4',
      ];
      const selectedMime = mimeTypes.find(type => MediaRecorder.isTypeSupported(type)) || 'video/webm';

      const stream = canvas.captureStream(60);
      const recorder = new MediaRecorder(stream, {
        mimeType: selectedMime,
        videoBitsPerSecond: 8000000, // 8 Mbps high quality
      });

      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: selectedMime });
        resolve(blob);
      };

      recorder.onerror = (err) => {
        reject(err);
      };

      recorder.start(100);

      const startTime = performance.now();
      const interval = setInterval(() => {
        const elapsed = performance.now() - startTime;
        const pct = Math.min(100, Math.round((elapsed / durationMs) * 100));
        if (onProgress) onProgress(pct);

        if (elapsed >= durationMs) {
          clearInterval(interval);
          if (recorder.state !== 'inactive') {
            recorder.stop();
          }
        }
      }, 100);
    } catch (err) {
      reject(err);
    }
  });
}
