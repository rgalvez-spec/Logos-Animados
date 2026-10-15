export type MotionPresetType =
  | 'cyber_glitch'
  | 'luxury_shimmer'
  | 'elastic_pop'
  | 'liquid_splash'
  | '3d_vortex'
  | 'cosmic_zoom'
  | 'neon_trace'
  | 'origami_unfold'
  | 'shockwave_pulse'
  | 'fire_burst';

export type IdleLoopType =
  | 'levitate_float'
  | 'breathing_pulse'
  | '3d_gyro_spin'
  | 'holographic_flicker'
  | 'liquid_wave'
  | 'subtle_drift'
  | 'none';

export type ParticleType =
  | 'sparks'
  | 'starlight'
  | 'cyber_shards'
  | 'liquid_drops'
  | 'golden_dust'
  | 'smoke_wisps'
  | 'geometric_nodes';

export type SynthSoundStyle =
  | 'whoosh_impact'
  | 'cyber_click'
  | 'deep_sub_boom'
  | 'crystal_chime'
  | 'electric_zap'
  | 'luxury_swell'
  | 'none';

export interface BrandAnalysis {
  detectedName?: string;
  shapeArchetype?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentGlowColor?: string;
  mood?: string;
  recommendedVibe?: string;
}

export interface MotionChoreography {
  title: string;
  description: string;
  brandAnalysis?: BrandAnalysis;
  entrance: {
    type: MotionPresetType;
    duration: number; // in seconds (e.g. 1.2)
    delay: number;
    easing: string;
    springStiffness: number;
    springDamping: number;
    initialScale: number;
    finalScale: number;
    initialRotateZ: number;
    initialRotateX: number;
    initialRotateY: number;
    initialBlur: number;
    glowIntensity: number;
  };
  idleLoop: {
    type: IdleLoopType;
    speed: number;
    amplitude: number;
    rotationRange: number;
    perspectiveDepth: number;
  };
  particles: {
    enabled: boolean;
    type: ParticleType;
    count: number;
    speed: number;
    spreadAngle: number;
    color: string;
    burstOnImpact: boolean;
  };
  lighting: {
    shineAngle: number;
    shineSpeed: number;
    spotlightIntensity: number;
    chromaticAberration: number;
  };
  soundFx: {
    synthStyle: SynthSoundStyle;
    pitchFrequency: number;
    duration: number;
  };
}

export interface SampleLogo {
  id: string;
  name: string;
  category: string;
  svg: string;
  recommendedVibe: string;
  accentColor: string;
}

export interface LogoDisplaySettings {
  size: number; // Base pixel size: 100 to 520, default 280
  shadowColor: string; // Hex or rgba color for shadow
  shadowBlur: number; // Blur radius: 0 to 80
  shadowOpacity: number; // Opacity: 0 to 1
  shadowOffsetY: number; // Vertical offset
  shadowOffsetX: number; // Horizontal offset
  preserveOriginal: boolean; // Keep logo pixels 100% untouched
}

export type StageBackground =
  | 'dark_studio'
  | 'cyber_grid'
  | 'golden_radial'
  | 'deep_space'
  | 'transparent'
  | 'light_minimal'
  | 'neon_sunset';
