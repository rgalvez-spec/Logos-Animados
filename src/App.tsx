import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Download,
  RotateCcw,
  Sliders,
  Cpu,
  Layers,
  Zap,
  Play,
  Share2,
} from 'lucide-react';
import { MotionCanvas } from './components/MotionCanvas';
import { TimelineControls } from './components/TimelineControls';
import { AiDirectorBar } from './components/AiDirectorBar';
import { PresetBar } from './components/PresetBar';
import { CustomizerPanel } from './components/CustomizerPanel';
import { ExportModal } from './components/ExportModal';
import { LogoSelector } from './components/LogoSelector';
import { LogoControlsBar } from './components/LogoControlsBar';
import { MOTION_PRESETS } from './utils/presets';
import { SAMPLE_LOGOS } from './utils/sampleLogos';
import {
  MotionChoreography,
  MotionPresetType,
  StageBackground,
  LogoDisplaySettings,
} from './types/motion';
import { kineticAudio } from './utils/audioSynth';

export default function App() {
  // Active Logo Source
  const [currentLogoSrc, setCurrentLogoSrc] = useState<string>(() => {
    return `data:image/svg+xml;utf8,${encodeURIComponent(SAMPLE_LOGOS[0].svg)}`;
  });
  const [currentBrandName, setCurrentBrandName] = useState<string>('Cyber Core AI');

  // Active Choreography & Preset
  const [currentPresetKey, setCurrentPresetKey] = useState<MotionPresetType>('cyber_glitch');
  const [choreography, setChoreography] = useState<MotionChoreography>(
    MOTION_PRESETS.cyber_glitch
  );

  // Playback & Timeline State
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [replayTrigger, setReplayTrigger] = useState<number>(0);
  const [timelineProgress, setTimelineProgress] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [stageBackground, setStageBackground] = useState<StageBackground>('dark_studio');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [gyroEnabled, setGyroEnabled] = useState<boolean>(true);

  // Logo Size & Shadow Color Settings (User requested)
  const [logoSettings, setLogoSettings] = useState<LogoDisplaySettings>({
    size: 280,
    shadowColor: '#6366f1',
    shadowBlur: 26,
    shadowOpacity: 0.65,
    shadowOffsetY: 16,
    shadowOffsetX: 0,
    preserveOriginal: true,
  });

  // UI State
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [showCustomizer, setShowCustomizer] = useState<boolean>(false);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Canvas Reference for export and rendering
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Trigger animation replay
  const handleReplay = useCallback(() => {
    setReplayTrigger((prev) => prev + 1);
    setIsPlaying(true);
  }, []);

  // Handle Preset Selection
  const handleSelectPreset = (presetKey: MotionPresetType) => {
    setCurrentPresetKey(presetKey);
    const basePreset = MOTION_PRESETS[presetKey];
    setChoreography({
      ...basePreset,
      brandAnalysis: choreography.brandAnalysis,
    });
    handleReplay();
  };

  // Handle AI Motion Generation
  const handleGenerateWithAi = async (userPrompt: string, vibe: string) => {
    try {
      setIsAiLoading(true);

      const response = await fetch('/api/animate-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: currentLogoSrc.startsWith('data:') ? currentLogoSrc : '',
          userPrompt,
          brandVibe: vibe,
          stylePreset: currentPresetKey,
        }),
      });

      const data = await response.json();

      if (data && data.choreography) {
        setChoreography({
          ...data.choreography,
          brandAnalysis: data.brandAnalysis || data.choreography.brandAnalysis,
        });
        if (data.choreography.entrance?.type && MOTION_PRESETS[data.choreography.entrance.type as MotionPresetType]) {
          setCurrentPresetKey(data.choreography.entrance.type as MotionPresetType);
        }
        handleReplay();
      }
    } catch (err) {
      console.error('Failed to generate AI motion:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Handle Logo Selection
  const handleSelectLogo = (src: string, brandName?: string, recommendedVibe?: string) => {
    setCurrentLogoSrc(src);
    if (brandName) setCurrentBrandName(brandName);

    // If logo has a recommended vibe preset, switch to it
    if (recommendedVibe && (recommendedVibe in MOTION_PRESETS)) {
      handleSelectPreset(recommendedVibe as MotionPresetType);
    } else {
      handleReplay();
    }
  };

  // Toggle Sound
  const handleToggleSound = () => {
    kineticAudio.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
  };

  // Synchronize audio state
  useEffect(() => {
    kineticAudio.enabled = soundEnabled;
  }, [soundEnabled]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800/80 px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-600/30 ring-1 ring-white/20">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight">LogoMotion AI</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                V2.5 Instant Engine
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 hidden sm:block">
              Generador de movimiento cinemático para logotipos con Inteligencia Artificial
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowCustomizer(!showCustomizer)}
            className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95 border ${
              showCustomizer
                ? 'bg-neutral-800 text-white border-neutral-700 shadow-sm'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border-neutral-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">Laboratorio de Física</span>
          </button>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all active:scale-95 ring-1 ring-white/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Video / GIF</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-6">
        {/* Stage & Canvas Hero Section */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Main Visual Stage (Canvas) */}
          <div className="lg:col-span-8 flex flex-col gap-3">
            <div className="relative w-full rounded-3xl bg-neutral-900/60 border border-neutral-800 p-2 sm:p-3 shadow-2xl flex items-center justify-center overflow-hidden min-h-[380px] sm:min-h-[460px]">
              {/* Badge Overlay */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-none">
                <span className="px-3 py-1 rounded-full bg-neutral-950/80 backdrop-blur-md text-[11px] font-medium text-neutral-300 border border-neutral-800 flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {choreography.title}
                </span>
              </div>

              {/* Quick Replay Floating Button */}
              <button
                onClick={handleReplay}
                title="Reiniciar animación"
                className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-neutral-950/80 hover:bg-neutral-800 text-neutral-300 hover:text-white backdrop-blur-md border border-neutral-800 transition-all active:scale-95 shadow-md"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* The 60FPS Canvas */}
              <MotionCanvas
                logoSrc={currentLogoSrc}
                choreography={choreography}
                background={stageBackground}
                isPlaying={isPlaying}
                replayTrigger={replayTrigger}
                canvasRef={canvasRef}
                onTimeUpdate={(_t, progress) => setTimelineProgress(progress)}
                interactiveGyro={gyroEnabled}
                logoSettings={logoSettings}
              />
            </div>

            {/* Timeline Bar directly beneath the canvas */}
            <TimelineControls
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
              onReplay={handleReplay}
              progress={timelineProgress}
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
              gyroEnabled={gyroEnabled}
              onToggleGyro={() => setGyroEnabled(!gyroEnabled)}
              background={stageBackground}
              onChangeBackground={(bg) => setStageBackground(bg)}
              speed={playbackSpeed}
              onChangeSpeed={(s) => setPlaybackSpeed(s)}
            />
          </div>

          {/* AI Director & Quick Insights Column */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* AI Director Bar */}
            <AiDirectorBar
              choreography={choreography}
              onGenerateWithAi={handleGenerateWithAi}
              isLoading={isAiLoading}
            />

            {/* Quick Specs Card */}
            <div className="w-full bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4 flex flex-col gap-3 text-xs">
              <div className="flex items-center gap-2 text-neutral-300 font-semibold uppercase tracking-wider text-[11px]">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>Parámetros de Coreografía Actual</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80">
                  <span className="text-neutral-500 block">Entrada Cinemática</span>
                  <span className="font-semibold text-neutral-200 capitalize truncate block">
                    {choreography.entrance.type.replace('_', ' ')}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80">
                  <span className="text-neutral-500 block">Duración de Impacto</span>
                  <span className="font-semibold text-neutral-200 block">
                    {choreography.entrance.duration.toFixed(2)}s
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80">
                  <span className="text-neutral-500 block">Bucle Idle</span>
                  <span className="font-semibold text-neutral-200 capitalize truncate block">
                    {choreography.idleLoop.type.replace('_', ' ')}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80">
                  <span className="text-neutral-500 block">Partículas</span>
                  <span className="font-semibold text-neutral-200 block">
                    {choreography.particles.enabled ? `${choreography.particles.count} ${choreography.particles.type}` : 'Inactivas'}
                  </span>
                </div>
              </div>

              {/* Sound Feedback Pill */}
              <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-800/30 flex items-center justify-between text-indigo-300 text-[11px]">
                <span>Sintetizador de Audio:</span>
                <span className="font-mono uppercase font-semibold">
                  {choreography.soundFx?.synthStyle.replace('_', ' ') || 'Whoosh Impact'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Logo Size, Shadow Color & Integrity Controls (User requested) */}
        <LogoControlsBar
          settings={logoSettings}
          onChangeSettings={setLogoSettings}
        />

        {/* 1-Click Preset Bar */}
        <PresetBar
          currentPreset={currentPresetKey}
          onSelectPreset={handleSelectPreset}
        />

        {/* Logo Selector Component */}
        <LogoSelector
          currentLogoSrc={currentLogoSrc}
          onSelectLogoSrc={handleSelectLogo}
        />

        {/* Fine-Tuning Customizer Panel (Collapsible) */}
        {showCustomizer && (
          <div className="animate-in fade-in duration-200">
            <CustomizerPanel
              choreography={choreography}
              onChangeChoreography={(updated) => setChoreography(updated)}
              onResetToDefault={() => handleSelectPreset(currentPresetKey)}
              logoSettings={logoSettings}
              onChangeLogoSettings={setLogoSettings}
            />
          </div>
        )}
      </main>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        canvasRef={canvasRef}
        choreography={choreography}
        onReplay={handleReplay}
        logoSettings={logoSettings}
      />
    </div>
  );
}
