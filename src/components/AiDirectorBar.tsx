import React, { useState } from 'react';
import { Sparkles, Wand2, Loader2, Zap, Palette, Tag } from 'lucide-react';
import { MotionChoreography } from '../types/motion';

interface AiDirectorBarProps {
  choreography: MotionChoreography;
  onGenerateWithAi: (userPrompt: string, vibe: string) => Promise<void>;
  isLoading: boolean;
}

const QUICK_PROMPTS = [
  { label: '⚡ Neón Glitch Disruptivo', prompt: 'Efecto cyberpunk eléctrico con glitch digital y aberración cromática', vibe: 'cyberpunk' },
  { label: '💎 Lujo & Shimmer Dorado', prompt: 'Elegancia refinada con barrido de luz aurea y rotación sutil en 3D', vibe: 'luxury' },
  { label: '🚀 Zoom Cósmico Supernova', prompt: 'Aparición desde el hiperespacio con explosión de polvo estelar y onda expansiva', vibe: 'cinematic' },
  { label: '💧 Fluidez Líquida & Tinta', prompt: 'Ondulación orgánica líquida como tinta expandiéndose en agua', vibe: 'liquid' },
  { label: '🪀 Pop Elástico de Gelatina', prompt: 'Rebote divertido y juguetón con deformación elástica de resorte', vibe: 'playful' },
  { label: '🔥 Fuego & Ascuas de Fénix', prompt: 'Nacimiento de llamarada ardiente con chispas de lava y turbulencia', vibe: 'fire_burst' },
];

export const AiDirectorBar: React.FC<AiDirectorBarProps> = ({
  choreography,
  onGenerateWithAi,
  isLoading,
}) => {
  const [prompt, setPrompt] = useState('');
  const [selectedVibe, setSelectedVibe] = useState('auto');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerateWithAi(prompt, selectedVibe);
  };

  const handleQuickPromptClick = (qp: { prompt: string; vibe: string }) => {
    setPrompt(qp.prompt);
    setSelectedVibe(qp.vibe);
    onGenerateWithAi(qp.prompt, qp.vibe);
  };

  const analysis = choreography.brandAnalysis;

  return (
    <div className="w-full bg-neutral-900/95 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col gap-4">
      {/* Header and Brand Intelligence */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/25">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              Director de Movimiento AI
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono uppercase tracking-wider">
                Gemini 3.8 Flash
              </span>
            </h2>
            <p className="text-xs text-neutral-400">
              {choreography.title} — {choreography.description}
            </p>
          </div>
        </div>

        {/* AI Brand Palette & Mood badge */}
        {analysis && (
          <div className="flex items-center gap-2 text-xs bg-neutral-950/80 px-3 py-1.5 rounded-xl border border-neutral-800">
            <div className="flex items-center gap-1.5" title="Paleta detectada por IA">
              <Palette className="w-3.5 h-3.5 text-neutral-400" />
              <div className="flex -space-x-1">
                {analysis.primaryColor && (
                  <span
                    className="w-3.5 h-3.5 rounded-full ring-1 ring-neutral-700"
                    style={{ backgroundColor: analysis.primaryColor }}
                  />
                )}
                {analysis.secondaryColor && (
                  <span
                    className="w-3.5 h-3.5 rounded-full ring-1 ring-neutral-700"
                    style={{ backgroundColor: analysis.secondaryColor }}
                  />
                )}
                {analysis.accentGlowColor && (
                  <span
                    className="w-3.5 h-3.5 rounded-full ring-1 ring-neutral-700"
                    style={{ backgroundColor: analysis.accentGlowColor }}
                  />
                )}
              </div>
            </div>
            {analysis.mood && (
              <span className="text-neutral-400 border-l border-neutral-800 pl-2 font-medium">
                {analysis.mood}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Natural Language Prompt Input */}
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe cómo quieres que cobre vida el logo... (ej: 'Explosión de oro y luz láser')"
            disabled={isLoading}
            className="w-full bg-neutral-950/90 text-neutral-100 placeholder-neutral-500 text-sm rounded-xl px-4 py-3 pl-10 border border-neutral-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
          <Sparkles className="w-4 h-4 text-indigo-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analizando...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 fill-white" />
              <span>Generar con IA</span>
            </>
          )}
        </button>
      </form>

      {/* Quick Prompts Chips */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-neutral-400 font-medium flex items-center gap-1">
          <Tag className="w-3.5 h-3.5" />
          Inspiración rápida:
        </span>
        {QUICK_PROMPTS.map((qp, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleQuickPromptClick(qp)}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all active:scale-95 border border-neutral-700/60"
          >
            {qp.label}
          </button>
        ))}
      </div>
    </div>
  );
};
