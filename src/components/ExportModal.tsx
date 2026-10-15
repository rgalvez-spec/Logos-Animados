import React, { useState } from 'react';
import { X, Video, Image as ImageIcon, Code2, Download, Copy, Check, Loader2, Sparkles } from 'lucide-react';
import { MotionChoreography, LogoDisplaySettings } from '../types/motion';
import { recordCanvasToVideo } from '../utils/videoExporter';
import { recordCanvasToGif } from '../utils/gifExporter';
import {
  generateCssCode,
  generateFramerMotionCode,
  generateTailwindSnippet,
} from '../utils/codeGenerators';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  choreography: MotionChoreography;
  onReplay: () => void;
  logoSettings?: LogoDisplaySettings;
}

type TabType = 'video' | 'gif' | 'code' | 'frame';

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  canvasRef,
  choreography,
  onReplay,
  logoSettings,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('video');
  const [codeType, setCodeType] = useState<'css' | 'framer' | 'tailwind'>('css');
  const [copied, setCopied] = useState(false);

  // Export progress states
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  // Video settings
  const [videoDuration, setVideoDuration] = useState(3.0);
  const [gifFps, setGifFps] = useState(20);

  if (!isOpen) return null;

  // Handle Video Export
  const handleExportVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      setIsExporting(true);
      setProgress(0);
      setExportSuccess(null);
      onReplay();

      // Short wait to ensure replay starts at frame 0
      await new Promise((r) => setTimeout(r, 100));

      const blob = await recordCanvasToVideo(canvas, videoDuration * 1000, (p) => {
        setProgress(p);
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `logo-motion-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setExportSuccess('¡Video descargado exitosamente!');
    } catch (err: any) {
      console.error('Error exporting video:', err);
      alert('Hubo un error al exportar el video: ' + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  // Handle GIF Export
  const handleExportGif = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      setIsExporting(true);
      setProgress(0);
      setExportSuccess(null);
      onReplay();

      await new Promise((r) => setTimeout(r, 100));

      const blob = await recordCanvasToGif(canvas, videoDuration * 1000, gifFps, (p) => {
        setProgress(p);
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `logo-motion-${Date.now()}.gif`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setExportSuccess('¡GIF animado descargado exitosamente!');
    } catch (err: any) {
      console.error('Error exporting gif:', err);
      alert('Hubo un error al generar el GIF: ' + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  // Handle Single Frame Snapshot
  const handleCaptureFrame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `logo-frame-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Copy Code
  const getSelectedCode = () => {
    switch (codeType) {
      case 'css':
        return generateCssCode(choreography, logoSettings);
      case 'framer':
        return generateFramerMotionCode(choreography, logoSettings);
      case 'tailwind':
        return generateTailwindSnippet(choreography, logoSettings);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getSelectedCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Centro de Exportación Rápida</h2>
              <p className="text-xs text-neutral-400">Descarga tu logo animado en video, GIF o código web listo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/50 p-2 gap-2">
          <button
            onClick={() => setActiveTab('video')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all ${
              activeTab === 'video'
                ? 'bg-neutral-800 text-white shadow-sm ring-1 ring-neutral-700'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Video className="w-4 h-4 text-indigo-400" />
            <span>Video WebM / MP4</span>
          </button>

          <button
            onClick={() => setActiveTab('gif')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all ${
              activeTab === 'gif'
                ? 'bg-neutral-800 text-white shadow-sm ring-1 ring-neutral-700'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>GIF Animado</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all ${
              activeTab === 'code'
                ? 'bg-neutral-800 text-white shadow-sm ring-1 ring-neutral-700'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span>Código Web</span>
          </button>

          <button
            onClick={() => setActiveTab('frame')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all ${
              activeTab === 'frame'
                ? 'bg-neutral-800 text-white shadow-sm ring-1 ring-neutral-700'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-pink-400" />
            <span>Captura PNG</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* TAB 1: VIDEO */}
          {activeTab === 'video' && (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs text-neutral-400 font-medium flex justify-between">
                  <span>Duración del Video</span>
                  <span className="font-mono text-white">{videoDuration.toFixed(1)} segundos</span>
                </label>
                <input
                  type="range"
                  min="1.5"
                  max="6.0"
                  step="0.5"
                  value={videoDuration}
                  onChange={(e) => setVideoDuration(parseFloat(e.target.value))}
                  disabled={isExporting}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 flex items-center justify-between text-xs text-neutral-300">
                <div>
                  <span className="font-semibold block text-white">Resolución: 800 x 560 px a 60 FPS</span>
                  <span className="text-neutral-400">Captura acelerada por hardware directa del Canvas</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[11px]">
                  Alta Definición
                </span>
              </div>

              {isExporting && (
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs text-neutral-400">
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                      Grabando animación en tiempo real...
                    </span>
                    <span className="font-mono text-white">{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {exportSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>{exportSuccess}</span>
                </div>
              )}

              <button
                onClick={handleExportVideo}
                disabled={isExporting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/30 active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span>{isExporting ? 'Grabando Video...' : 'Descargar Video Ahora'}</span>
              </button>
            </div>
          )}

          {/* TAB 2: GIF */}
          {activeTab === 'gif' && (
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-neutral-400 font-medium flex justify-between">
                    <span>Duración</span>
                    <span className="font-mono text-white">{videoDuration.toFixed(1)}s</span>
                  </label>
                  <input
                    type="range"
                    min="1.5"
                    max="4.0"
                    step="0.5"
                    value={videoDuration}
                    onChange={(e) => setVideoDuration(parseFloat(e.target.value))}
                    disabled={isExporting}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs text-neutral-400 font-medium flex justify-between">
                    <span>Cuadros por Seg (FPS)</span>
                    <span className="font-mono text-white">{gifFps} fps</span>
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="30"
                    step="2"
                    value={gifFps}
                    onChange={(e) => setGifFps(parseInt(e.target.value, 10))}
                    disabled={isExporting}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>
              </div>

              {isExporting && (
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs text-neutral-400">
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                      Cuantizando paleta de colores y creando GIF...
                    </span>
                    <span className="font-mono text-white">{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {exportSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>{exportSuccess}</span>
                </div>
              )}

              <button
                onClick={handleExportGif}
                disabled={isExporting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium text-sm transition-all shadow-lg shadow-purple-600/30 active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{isExporting ? 'Procesando GIF...' : 'Generar y Descargar GIF'}</span>
              </button>
            </div>
          )}

          {/* TAB 3: CODE */}
          {activeTab === 'code' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {(['css', 'framer', 'tailwind'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setCodeType(fmt)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        codeType === fmt
                          ? 'bg-neutral-800 text-white border border-neutral-700'
                          : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      {fmt === 'css' && 'CSS Keyframes'}
                      {fmt === 'framer' && 'Framer Motion (React)'}
                      {fmt === 'tailwind' && 'Tailwind CSS'}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95 shadow-md shadow-indigo-600/20"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? '¡Copiado!' : 'Copiar Código'}</span>
                </button>
              </div>

              <div className="relative">
                <pre className="w-full max-h-72 overflow-y-auto bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-xs font-mono text-neutral-300 select-all scrollbar-thin">
                  <code>{getSelectedCode()}</code>
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: FRAME SNAPSHOT */}
          {activeTab === 'frame' && (
            <div className="flex flex-col gap-4 items-center text-center">
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 max-w-md">
                <ImageIcon className="w-10 h-10 text-pink-400 mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-white">Capturar Frame Clave</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Guarda la pose actual del logo en alta resolución (PNG) con canal alfa transparente o fondo actual.
                </p>
              </div>

              <button
                onClick={handleCaptureFrame}
                className="w-full max-w-sm py-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-medium text-sm transition-all shadow-lg shadow-pink-600/25 active:scale-98 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Frame Actual (PNG)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
