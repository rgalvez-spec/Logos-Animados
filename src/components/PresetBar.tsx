import React from 'react';
import { MotionPresetType } from '../types/motion';
import {
  Zap,
  Crown,
  Smile,
  Droplets,
  Orbit,
  Sparkles,
  Flame,
  Radio,
  Layers,
  Activity,
} from 'lucide-react';

interface PresetBarProps {
  currentPreset: MotionPresetType;
  onSelectPreset: (presetKey: MotionPresetType) => void;
}

const PRESET_ITEMS: {
  key: MotionPresetType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}[] = [
  { key: 'cyber_glitch', label: 'Cyber Glitch', icon: Zap, color: 'text-cyan-400' },
  { key: 'luxury_shimmer', label: 'Lujo Dorado', icon: Crown, color: 'text-yellow-400' },
  { key: 'elastic_pop', label: 'Pop Elástico', icon: Smile, color: 'text-pink-400' },
  { key: 'liquid_splash', label: 'Líquido Splash', icon: Droplets, color: 'text-emerald-400' },
  { key: '3d_vortex', label: 'Vórtice 3D', icon: Orbit, color: 'text-purple-400' },
  { key: 'cosmic_zoom', label: 'Zoom Cósmico', icon: Sparkles, color: 'text-blue-400' },
  { key: 'neon_trace', label: 'Trazo Neón', icon: Radio, color: 'text-sky-400' },
  { key: 'fire_burst', label: 'Fuego Fénix', icon: Flame, color: 'text-orange-400' },
  { key: 'shockwave_pulse', label: 'Onda Sísmica', icon: Activity, color: 'text-rose-400' },
  { key: 'origami_unfold', label: 'Origami 3D', icon: Layers, color: 'text-indigo-400' },
];

export const PresetBar: React.FC<PresetBarProps> = ({
  currentPreset,
  onSelectPreset,
}) => {
  return (
    <div className="w-full bg-neutral-900/80 border border-neutral-800 rounded-2xl p-3 sm:p-4 shadow-xl">
      <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
        <span>Estilos de Animación Preestablecidos (1-Click)</span>
        <span className="text-[11px] text-neutral-400">10 estilos cinemáticos</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {PRESET_ITEMS.map((item) => {
          const Icon = item.icon;
          const isSelected = currentPreset === item.key;

          return (
            <button
              key={item.key}
              onClick={() => onSelectPreset(item.key)}
              className={`p-2.5 rounded-xl text-left flex items-center gap-2.5 transition-all active:scale-95 ${
                isSelected
                  ? 'bg-neutral-800 text-white ring-2 ring-indigo-500 shadow-md shadow-indigo-500/20'
                  : 'bg-neutral-950/60 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60 border border-neutral-800/80'
              }`}
            >
              <div
                className={`p-1.5 rounded-lg ${
                  isSelected ? 'bg-indigo-600/30' : 'bg-neutral-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div className="overflow-hidden">
                <span className="block text-xs font-medium truncate">{item.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
