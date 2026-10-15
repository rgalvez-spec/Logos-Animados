import React from 'react';
import { MotionChoreography, ParticleType, IdleLoopType, LogoDisplaySettings } from '../types/motion';
import { Sliders, Sparkles, RefreshCw, Sun, Gauge, Eye, Maximize2, Palette } from 'lucide-react';

interface CustomizerPanelProps {
  choreography: MotionChoreography;
  onChangeChoreography: (updated: MotionChoreography) => void;
  onResetToDefault: () => void;
  logoSettings?: LogoDisplaySettings;
  onChangeLogoSettings?: (updated: LogoDisplaySettings) => void;
}

export const CustomizerPanel: React.FC<CustomizerPanelProps> = ({
  choreography,
  onChangeChoreography,
  onResetToDefault,
  logoSettings,
  onChangeLogoSettings,
}) => {
  const updateEntrance = (key: string, value: any) => {
    onChangeChoreography({
      ...choreography,
      entrance: {
        ...choreography.entrance,
        [key]: value,
      },
    });
  };

  const updateIdle = (key: string, value: any) => {
    onChangeChoreography({
      ...choreography,
      idleLoop: {
        ...choreography.idleLoop,
        [key]: value,
      },
    });
  };

  const updateParticles = (key: string, value: any) => {
    onChangeChoreography({
      ...choreography,
      particles: {
        ...choreography.particles,
        [key]: value,
      },
    });
  };

  const updateLighting = (key: string, value: any) => {
    onChangeChoreography({
      ...choreography,
      lighting: {
        ...choreography.lighting,
        [key]: value,
      },
    });
  };

  return (
    <div className="w-full bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col gap-5 text-neutral-200">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">Laboratorio de Física Cinética</h3>
        </div>
        <button
          onClick={onResetToDefault}
          className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Restablecer</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
        {/* Column 1: Entrance Physics */}
        <div className="flex flex-col gap-3.5">
          <div className="flex items-center gap-1.5 font-medium text-indigo-400 uppercase tracking-wider text-[11px]">
            <Gauge className="w-3.5 h-3.5" />
            <span>Física de Entrada</span>
          </div>

          <div>
            <div className="flex justify-between text-neutral-400 mb-1">
              <span>Duración de Entrada</span>
              <span className="font-mono text-neutral-300">{choreography.entrance.duration.toFixed(2)}s</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3.5"
              step="0.1"
              value={choreography.entrance.duration}
              onChange={(e) => updateEntrance('duration', parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-neutral-400 mb-1">
              <span>Tensión de Resorte (Bounce)</span>
              <span className="font-mono text-neutral-300">{choreography.entrance.springStiffness}</span>
            </div>
            <input
              type="range"
              min="100"
              max="450"
              step="10"
              value={choreography.entrance.springStiffness}
              onChange={(e) => updateEntrance('springStiffness', parseInt(e.target.value, 10))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-neutral-400 mb-1">
              <span>Amortiguación (Damping)</span>
              <span className="font-mono text-neutral-300">{choreography.entrance.springDamping}</span>
            </div>
            <input
              type="range"
              min="8"
              max="35"
              step="1"
              value={choreography.entrance.springDamping}
              onChange={(e) => updateEntrance('springDamping', parseInt(e.target.value, 10))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-neutral-400 mb-1">
              <span>Escala Inicial</span>
              <span className="font-mono text-neutral-300">{choreography.entrance.initialScale.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="2.5"
              step="0.05"
              value={choreography.entrance.initialScale}
              onChange={(e) => updateEntrance('initialScale', parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Column 2: Idle Movement Loop */}
        <div className="flex flex-col gap-3.5">
          <div className="flex items-center gap-1.5 font-medium text-purple-400 uppercase tracking-wider text-[11px]">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Bucle Idle Continuo</span>
          </div>

          <div>
            <span className="text-neutral-400 block mb-1">Estilo de Movimiento Idle</span>
            <select
              value={choreography.idleLoop.type}
              onChange={(e) => updateIdle('type', e.target.value as IdleLoopType)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-neutral-200 focus:outline-none focus:border-purple-500"
            >
              <option value="levitate_float">Flotación Gravitatoria</option>
              <option value="breathing_pulse">Respiración / Pulso Órganico</option>
              <option value="3d_gyro_spin">Giro Giroscópico 3D</option>
              <option value="holographic_flicker">Holograma & Flicker Digital</option>
              <option value="liquid_wave">Ondulación Líquida</option>
              <option value="subtle_drift">Deriva Sutil Minimalista</option>
              <option value="none">Sin bucle (Estático post-intro)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between text-neutral-400 mb-1">
              <span>Amplitud de Movimiento</span>
              <span className="font-mono text-neutral-300">{choreography.idleLoop.amplitude}px</span>
            </div>
            <input
              type="range"
              min="2"
              max="25"
              step="1"
              value={choreography.idleLoop.amplitude}
              onChange={(e) => updateIdle('amplitude', parseInt(e.target.value, 10))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-neutral-400 mb-1">
              <span>Velocidad de Bucle</span>
              <span className="font-mono text-neutral-300">{choreography.idleLoop.speed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.4"
              max="2.5"
              step="0.1"
              value={choreography.idleLoop.speed}
              onChange={(e) => updateIdle('speed', parseFloat(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-neutral-400 mb-1">
              <span>Profundidad de Perspectiva</span>
              <span className="font-mono text-neutral-300">{choreography.idleLoop.perspectiveDepth}px</span>
            </div>
            <input
              type="range"
              min="300"
              max="1200"
              step="50"
              value={choreography.idleLoop.perspectiveDepth}
              onChange={(e) => updateIdle('perspectiveDepth', parseInt(e.target.value, 10))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Column 3: Particles & Light Flares */}
        <div className="flex flex-col gap-3.5">
          <div className="flex items-center gap-1.5 font-medium text-pink-400 uppercase tracking-wider text-[11px]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Partículas & Destellos</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-neutral-300 font-medium">Activar Partículas</span>
            <input
              type="checkbox"
              checked={choreography.particles.enabled}
              onChange={(e) => updateParticles('enabled', e.target.checked)}
              className="w-4 h-4 accent-pink-500 cursor-pointer rounded"
            />
          </div>

          {choreography.particles.enabled && (
            <>
              <div>
                <span className="text-neutral-400 block mb-1">Tipo de Partícula</span>
                <select
                  value={choreography.particles.type}
                  onChange={(e) => updateParticles('type', e.target.value as ParticleType)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-neutral-200 focus:outline-none focus:border-pink-500"
                >
                  <option value="sparks">Chispas de Alta Velocidad</option>
                  <option value="starlight">Polvo Estelar Brillante</option>
                  <option value="cyber_shards">Shards / Fragmentos Cyber</option>
                  <option value="golden_dust">Polvo de Oro & Diamante</option>
                  <option value="liquid_drops">Gotas Líquidas</option>
                  <option value="geometric_nodes">Nodos Geométricos</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>Densidad de Partículas</span>
                  <span className="font-mono text-neutral-300">{choreography.particles.count}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="120"
                  step="5"
                  value={choreography.particles.count}
                  onChange={(e) => updateParticles('count', parseInt(e.target.value, 10))}
                  className="w-full accent-pink-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-neutral-400">Color de Partículas:</span>
                <input
                  type="color"
                  value={choreography.particles.color || '#6366f1'}
                  onChange={(e) => updateParticles('color', e.target.value)}
                  className="w-7 h-7 rounded border border-neutral-700 bg-transparent cursor-pointer"
                />
              </div>
            </>
          )}

          <div>
            <div className="flex justify-between text-neutral-400 mb-1">
              <span>Barrido de Luz (Shine)</span>
              <span className="font-mono text-neutral-300">
                {choreography.lighting.spotlightIntensity.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1.5"
              step="0.1"
              value={choreography.lighting.spotlightIntensity}
              onChange={(e) => updateLighting('spotlightIntensity', parseFloat(e.target.value))}
              className="w-full accent-pink-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-neutral-400 mb-1">
              <span>Aberración Cromática</span>
              <span className="font-mono text-neutral-300">
                {choreography.lighting.chromaticAberration.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={choreography.lighting.chromaticAberration}
              onChange={(e) => updateLighting('chromaticAberration', parseFloat(e.target.value))}
              className="w-full accent-pink-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Column 4 (if logoSettings provided): Logo Size & Shadow Color */}
        {logoSettings && onChangeLogoSettings && (
          <div className="flex flex-col gap-3.5 md:col-span-2 lg:col-span-3 pt-4 border-t border-neutral-800">
            <div className="flex items-center gap-1.5 font-medium text-emerald-400 uppercase tracking-wider text-[11px]">
              <Palette className="w-3.5 h-3.5" />
              <span>Tamaño del Logotipo & Sombra Proyectada</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>Tamaño del Logo</span>
                  <span className="font-mono text-neutral-300">{logoSettings.size}px</span>
                </div>
                <input
                  type="range"
                  min="120"
                  max="480"
                  step="10"
                  value={logoSettings.size}
                  onChange={(e) => onChangeLogoSettings({ ...logoSettings, size: parseInt(e.target.value, 10) })}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>Color de la Sombra</span>
                  <span className="font-mono text-neutral-300 uppercase">{logoSettings.shadowColor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={logoSettings.shadowColor || '#6366f1'}
                    onChange={(e) => onChangeLogoSettings({ ...logoSettings, shadowColor: e.target.value })}
                    className="w-8 h-8 rounded border border-neutral-700 bg-transparent cursor-pointer"
                  />
                  <span className="text-neutral-400 text-[11px]">Personalizado</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>Difuminado de Sombra</span>
                  <span className="font-mono text-neutral-300">{logoSettings.shadowBlur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  step="2"
                  value={logoSettings.shadowBlur}
                  onChange={(e) => onChangeLogoSettings({ ...logoSettings, shadowBlur: parseInt(e.target.value, 10) })}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
