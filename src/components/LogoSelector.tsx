import React, { useRef, useState } from 'react';
import { Upload, Sparkles, Type, Scissors, Check, Image as ImageIcon } from 'lucide-react';
import { SAMPLE_LOGOS } from '../utils/sampleLogos';
import { SampleLogo } from '../types/motion';

interface LogoSelectorProps {
  currentLogoSrc: string;
  onSelectLogoSrc: (src: string, brandName?: string, recommendedVibe?: string) => void;
}

export const LogoSelector: React.FC<LogoSelectorProps> = ({
  currentLogoSrc,
  onSelectLogoSrc,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'samples' | 'upload' | 'text'>('samples');

  // Text logo generator states
  const [textBrand, setTextBrand] = useState('NEXUS');
  const [textSubtitle, setTextSubtitle] = useState('STUDIOS');
  const [textColor, setTextColor] = useState('#6366f1');
  const [textStyle, setTextStyle] = useState<'modern' | 'cyber' | 'luxury'>('modern');

  // Auto remove white background from uploaded raster image
  const removeWhiteBackground = (imgDataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(imgDataUrl);

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Tolerance for white background
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          // If close to white
          if (r > 235 && g > 235 && b > 235) {
            data[i + 3] = 0; // alpha to 0
          } else if (r > 210 && g > 210 && b > 210) {
            // Feather edge
            data[i + 3] = Math.round((255 - ((r + g + b) / 3)) * 4);
          }
        }

        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.src = imgDataUrl;
    });
  };

  const [rawOriginalSrc, setRawOriginalSrc] = useState<string | null>(null);
  const [isBackgroundCleaned, setIsBackgroundCleaned] = useState(false);

  // Handle file upload without modifying original pixels
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const originalResult = event.target?.result as string;
      setRawOriginalSrc(originalResult);
      setIsBackgroundCleaned(false);
      // Select original logo untouched
      onSelectLogoSrc(originalResult, file.name.replace(/\.[^/.]+$/, ''), 'auto');
    };
    reader.readAsDataURL(file);
  };

  // Optional manual white background cleaner (only when user specifically requests it)
  const handleManualCleanBackground = async () => {
    if (!rawOriginalSrc) return;
    const cleaned = await removeWhiteBackground(rawOriginalSrc);
    setIsBackgroundCleaned(true);
    onSelectLogoSrc(cleaned, 'Logo Sin Fondo', 'auto');
  };

  const handleRestoreOriginal = () => {
    if (!rawOriginalSrc) return;
    setIsBackgroundCleaned(false);
    onSelectLogoSrc(rawOriginalSrc, 'Logo Original', 'auto');
  };

  // Generate SVG from Text
  const handleGenerateTextLogo = () => {
    const font =
      textStyle === 'cyber'
        ? 'font-family: monospace; font-weight: 900; letter-spacing: 4px;'
        : textStyle === 'luxury'
        ? "font-family: 'Times New Roman', serif; font-weight: 400; letter-spacing: 6px;"
        : "font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; letter-spacing: 2px;";

    const svg = `<svg viewBox="0 0 320 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="text-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="60%" stop-color="${textColor}" />
          <stop offset="100%" stop-color="#3b82f6" />
        </linearGradient>
      </defs>
      <!-- Geometric Accent Wing -->
      <polygon points="160,20 200,32 160,44 120,32" fill="${textColor}" opacity="0.85" />
      <circle cx="160" cy="32" r="4" fill="#ffffff" />
      <!-- Brand Text -->
      <text x="160" y="95" text-anchor="middle" fill="url(#text-grad)" font-size="38" style="${font}">
        ${textBrand.toUpperCase()}
      </text>
      <!-- Subtitle -->
      <text x="160" y="128" text-anchor="middle" fill="#94a3b8" font-size="12" style="font-family: sans-serif; letter-spacing: 5px; font-weight: 600;">
        ${textSubtitle.toUpperCase()}
      </text>
    </svg>`;

    const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    onSelectLogoSrc(dataUrl, textBrand, textStyle === 'cyber' ? 'cyberpunk' : textStyle === 'luxury' ? 'luxury' : 'cinematic');
  };

  return (
    <div className="w-full bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col gap-4">
      {/* Header Tabs */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">Selección de Logotipo</h3>
        </div>

        <div className="flex p-1 bg-neutral-950 rounded-xl border border-neutral-800 gap-1 text-xs">
          <button
            onClick={() => setActiveTab('samples')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'samples'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Galería de Muestra
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'upload'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Subir Archivo
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'text'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Generador Tipográfico
          </button>
        </div>
      </div>

      {/* TAB 1: SAMPLES GALLERY */}
      {activeTab === 'samples' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {SAMPLE_LOGOS.map((sample: SampleLogo) => {
            const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(sample.svg)}`;
            const isSelected = currentLogoSrc.includes(encodeURIComponent(sample.name)) || currentLogoSrc === dataUrl;

            return (
              <button
                key={sample.id}
                onClick={() => onSelectLogoSrc(dataUrl, sample.name, sample.recommendedVibe)}
                className={`p-3 rounded-2xl flex flex-col items-center gap-2.5 transition-all text-center group active:scale-95 ${
                  isSelected
                    ? 'bg-neutral-800 border-2 border-indigo-500 shadow-lg shadow-indigo-500/20'
                    : 'bg-neutral-950/70 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900'
                }`}
              >
                <div className="w-16 h-16 rounded-xl bg-neutral-900/90 p-2 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                  <div
                    className="w-full h-full"
                    dangerouslySetInnerHTML={{ __html: sample.svg }}
                  />
                </div>
                <div className="w-full">
                  <span className="block text-xs font-semibold text-white truncate">{sample.name}</span>
                  <span className="block text-[10px] text-neutral-400 truncate">{sample.category}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* TAB 2: UPLOAD */}
      {activeTab === 'upload' && (
        <div className="flex flex-col gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={handleFileUpload}
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-neutral-800 hover:border-indigo-500 rounded-2xl p-7 flex flex-col items-center justify-center gap-3 cursor-pointer bg-neutral-950/40 hover:bg-neutral-950/80 transition-all text-center group"
          >
            <div className="p-3.5 rounded-2xl bg-neutral-900 group-hover:bg-indigo-600/20 text-neutral-400 group-hover:text-indigo-400 transition-colors">
              <Upload className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Haz clic o arrastra tu logotipo aquí</p>
              <p className="text-xs text-neutral-400 mt-1">
                Soporta PNG transparente, SVG vectorial, JPG o WebP (hasta 25MB)
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20">
              <Check className="w-3.5 h-3.5" />
              <span className="font-medium">Logo 100% intacto — Tus colores, formas y píxeles no se alteran</span>
            </div>
          </div>

          {rawOriginalSrc && (
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-neutral-950 border border-neutral-800 rounded-xl text-xs">
              <div className="flex items-center gap-3">
                <img src={currentLogoSrc} alt="Preview" className="w-10 h-10 object-contain rounded-lg bg-neutral-900 p-1 border border-neutral-800" />
                <div>
                  <span className="font-semibold text-white block">Archivo subido activo</span>
                  <span className="text-neutral-400 text-[11px]">
                    {isBackgroundCleaned ? 'Modo: Fondo blanco eliminado' : 'Modo: Logo original 100% puro e intacto'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isBackgroundCleaned ? (
                  <button
                    onClick={handleRestoreOriginal}
                    className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-all text-xs font-medium"
                  >
                    Restaurar original intacto
                  </button>
                ) : (
                  <button
                    onClick={handleManualCleanBackground}
                    className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all text-xs font-medium flex items-center gap-1.5"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>Eliminar fondo blanco (Opcional)</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TEXT BRAND MAKER */}
      {activeTab === 'text' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div>
            <label className="text-xs text-neutral-400 font-medium block mb-1">Nombre de la Marca</label>
            <input
              type="text"
              value={textBrand}
              onChange={(e) => setTextBrand(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs text-neutral-400 font-medium block mb-1">Lema o Subtítulo</label>
            <input
              type="text"
              value={textSubtitle}
              onChange={(e) => setTextSubtitle(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs text-neutral-400 font-medium block mb-1">Estilo Tipográfico</label>
            <select
              value={textStyle}
              onChange={(e) => setTextStyle(e.target.value as any)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="modern">Modern Bold Sans</option>
              <option value="cyber">Cyberpunk Mono</option>
              <option value="luxury">Luxury Serif</option>
            </select>
          </div>

          <button
            onClick={handleGenerateTextLogo}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-all shadow-md shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Crear y Animar</span>
          </button>
        </div>
      )}
    </div>
  );
};
