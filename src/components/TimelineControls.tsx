import React from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Compass } from 'lucide-react';
import { StageBackground } from '../types/motion';

interface TimelineControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReplay: () => void;
  progress: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  gyroEnabled: boolean;
  onToggleGyro: () => void;
  background: StageBackground;
  onChangeBackground: (bg: StageBackground) => void;
  speed: number;
  onChangeSpeed: (speed: number) => void;
}

export const TimelineControls: React.FC<TimelineControlsProps> = ({
  isPlaying,
  onTogglePlay,
  onReplay,
  progress,
  soundEnabled,
  onToggleSound,
  gyroEnabled,
  onToggleGyro,
  background,
  onChangeBackground,
  speed,
  onChangeSpeed,
}) => {
  const backgrounds: { id: StageBackground; label: string; icon: string }[] = [
    { id: 'dark_studio', label: 'Estudio Dark', icon: '⬛' },
    { id: 'cyber_grid', label: 'Grid Cyber', icon: '🌐' },
    { id: 'golden_radial', label: 'Lujo Aureo', icon: '👑' },
    { id: 'deep_space', label: 'Cosmos', icon: '✨' },
    { id: 'transparent', label: 'Transparente (PNG)', icon: '🏁' },
    { id: 'light_minimal', label: 'Blanco Minimal', icon: '⬜' },
  ];

  return (
    <div className="w-full bg-neutral-900/90 backdrop-blur-md border border-neutral-800 rounded-2xl p-3 sm:p-4 shadow-xl flex flex-col gap-3">
      {/* Timeline Scrub Bar */}
      <div className="w-full flex items-center gap-3">
        <button
          onClick={onReplay}
          title="Reiniciar animación"
          className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={onTogglePlay}
          title={isPlaying ? 'Pausar' : 'Reproducir'}
          className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all shadow-lg shadow-indigo-600/30 active:scale-95 flex items-center justify-center"
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
        </button>

        {/* Progress Bar */}
        <div className="flex-1 relative flex items-center group">
          <div className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden relative cursor-pointer">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-75"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <span className="ml-3 text-xs font-mono text-neutral-400 w-12 text-right">
            {Math.round(progress * 100)}%
          </span>
        </div>

        {/* Gyro 3D Toggle */}
        <button
          onClick={onToggleGyro}
          title={gyroEnabled ? 'Desactivar inclinación 3D del cursor' : 'Activar inclinación 3D del cursor'}
          className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
            gyroEnabled
              ? 'bg-indigo-950 text-indigo-400 border border-indigo-700/50'
              : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
          }`}
        >
          <Compass className={`w-4 h-4 ${gyroEnabled ? 'animate-spin-slow' : ''}`} />
          <span className="hidden md:inline">Giro 3D</span>
        </button>

        {/* Sound Toggle */}
        <button
          onClick={onToggleSound}
          title={soundEnabled ? 'Silenciar audio cinético' : 'Activar audio cinético'}
          className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
            soundEnabled
              ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/50'
              : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden md:inline">{soundEnabled ? 'Audio ON' : 'Audio OFF'}</span>
        </button>
      </div>

      {/* Secondary Controls: Speed & Background Stage */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-800/80 text-xs">
        {/* Speed Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-neutral-400 mr-1 font-medium">Velocidad:</span>
          {[0.5, 1, 1.5, 2].map((s) => (
            <button
              key={s}
              onClick={() => onChangeSpeed(s)}
              className={`px-2.5 py-1 rounded-md font-mono transition-all ${
                speed === s
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'bg-neutral-800/80 text-neutral-400 hover:bg-neutral-700'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Background Selector */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-0.5">
          <span className="text-neutral-400 mr-1 font-medium hidden sm:inline">Escenario:</span>
          {backgrounds.map((bg) => (
            <button
              key={bg.id}
              onClick={() => onChangeBackground(bg.id)}
              className={`px-2 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 transition-all ${
                background === bg.id
                  ? 'bg-neutral-700 text-white shadow-sm ring-1 ring-neutral-500'
                  : 'bg-neutral-800/60 text-neutral-400 hover:bg-neutral-700/70 hover:text-neutral-200'
              }`}
            >
              <span>{bg.icon}</span>
              <span className="hidden lg:inline">{bg.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
