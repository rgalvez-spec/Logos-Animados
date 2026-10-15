import React from 'react';
import { LogoDisplaySettings } from '../types/motion';
import { Maximize2, Palette, ShieldCheck, Sparkles, SlidersHorizontal } from 'lucide-react';

interface LogoControlsBarProps {
  settings: LogoDisplaySettings;
  onChangeSettings: (updated: LogoDisplaySettings) => void;
}

const SHADOW_SWATCHES = [
  { label: 'Negro Profundo', color: '#000000', border: 'border-neutral-700' },
  { label: 'Azul Neón', color: '#3b82f6', border: 'border-blue-500/40' },
  { label: 'Violeta Eléctrico', color: '#8b5cf6', border: 'border-purple-500/40' },
  { label: 'Rosa Magenta', color: '#ec4899', border: 'border-pink-500/40' },
  { label: 'Oro Cálido', color: '#eab308', border: 'border-amber-500/40' },
  { label: 'Esmeralda', color: '#10b981', border: 'border-emerald-500/40' },
  { label: 'Cyan Cyber', color: '#06b6d4', border: 'border-cyan-500/40' },
  { label: 'Blanco Resplandor', color: '#ffffff', border: 'border-white/50' },
];

const SIZE_PRESETS = [
  { label: 'S', size: 180 },
  { label: 'M (Estándar)', size: 280 },
  { label: 'L', size: 360 },
  { label: 'XL', size: 440 },
];

export const LogoControlsBar: React.FC<LogoControlsBarProps> = ({
  settings,
  onChangeSettings,
}) => {
  const update = (key: keyof LogoDisplaySettings, value: any) => {
    onChangeSettings({
      ...settings,
      [key]: value,
    });
  };

  return (
    <div className="w-full bg-neutral-900/95 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col gap-4">
      {/* Title & Integrity Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              Tamaño del Logo & Color de Sombras
            </h3>
            <p className="text-xs text-neutral-400">
              Personaliza el tamaño en pantalla y el estilo cromático de la sombra proyectada
            </p>
          </div>
        </div>

        {/* Protection Toggle */}
        <label className="flex items-center gap-2 cursor-pointer bg-neutral-950 px-3 py-1.5 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-all select-none">
          <input
            type="checkbox"
            checked={settings.preserveOriginal}
            onChange={(e) => update('preserveOriginal', e.target.checked)}
            className="w-4 h-4 accent-emerald-500 cursor-pointer rounded"
          />
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-medium text-neutral-200">
            Preservar logo intacto (Sin alterar colores ni píxeles)
          </span>
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-xs">
        {/* SECTION 1: LOGO SIZE (Col 1-5) */}
        <div className="lg:col-span-5 flex flex-col gap-3 p-3.5 bg-neutral-950/70 border border-neutral-800/80 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-neutral-200 flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
              Tamaño del Logotipo
            </span>
            <span className="font-mono text-indigo-300 font-medium bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
              {settings.size} px
            </span>
          </div>

          {/* Slider */}
          <input
            type="range"
            min="120"
            max="480"
            step="10"
            value={settings.size}
            onChange={(e) => update('size', parseInt(e.target.value, 10))}
            className="w-full accent-indigo-500 cursor-pointer"
          />

          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-[11px] text-neutral-400 mr-1">Rápido:</span>
            {SIZE_PRESETS.map((p) => (
              <button
                key={p.size}
                type="button"
                onClick={() => update('size', p.size)}
                className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-medium transition-all ${
                  settings.size === p.size
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* SECTION 2: SHADOW COLOR & OPACITY (Col 6-12) */}
        <div className="lg:col-span-7 flex flex-col gap-3 p-3.5 bg-neutral-950/70 border border-neutral-800/80 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-neutral-200 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-purple-400" />
              Color & Estilo de la Sombra
            </span>

            {/* Custom Color Input Picker */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-neutral-400 uppercase">
                {settings.shadowColor}
              </span>
              <input
                type="color"
                value={settings.shadowColor || '#6366f1'}
                onChange={(e) => update('shadowColor', e.target.value)}
                title="Elegir color personalizado de sombra"
                className="w-7 h-7 rounded-lg border border-neutral-700 bg-transparent cursor-pointer"
              />
            </div>
          </div>

          {/* Swatches Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {SHADOW_SWATCHES.map((sw) => {
              const isSelected = settings.shadowColor.toLowerCase() === sw.color.toLowerCase();
              return (
                <button
                  key={sw.color}
                  type="button"
                  onClick={() => update('shadowColor', sw.color)}
                  title={sw.label}
                  className={`py-1.5 px-2 rounded-xl flex flex-col items-center gap-1.5 transition-all text-center border ${
                    isSelected
                      ? 'bg-neutral-800 border-indigo-500 ring-2 ring-indigo-500/30'
                      : 'bg-neutral-900/90 border-neutral-800 hover:bg-neutral-800/80'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full shadow-sm ${sw.border}`}
                    style={{ backgroundColor: sw.color }}
                  />
                  <span className="text-[9px] text-neutral-400 truncate w-full block">
                    {sw.label.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Fine Controls for Shadow Blur & Opacity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-neutral-800/80 text-[11px]">
            <div>
              <div className="flex justify-between text-neutral-400 mb-1">
                <span>Difuminado (Blur)</span>
                <span className="font-mono text-neutral-300">{settings.shadowBlur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="2"
                value={settings.shadowBlur}
                onChange={(e) => update('shadowBlur', parseInt(e.target.value, 10))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-neutral-400 mb-1">
                <span>Opacidad</span>
                <span className="font-mono text-neutral-300">
                  {Math.round(settings.shadowOpacity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={settings.shadowOpacity}
                onChange={(e) => update('shadowOpacity', parseFloat(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-neutral-400 mb-1">
                <span>Elevación / Distancia Y</span>
                <span className="font-mono text-neutral-300">{settings.shadowOffsetY}px</span>
              </div>
              <input
                type="range"
                min="-10"
                max="45"
                step="1"
                value={settings.shadowOffsetY}
                onChange={(e) => update('shadowOffsetY', parseInt(e.target.value, 10))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
