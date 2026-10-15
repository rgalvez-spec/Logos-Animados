import { SynthSoundStyle } from '../types/motion';

class KineticAudioSynthesizer {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  public volume: number = 0.5;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public playSound(style: SynthSoundStyle, frequency: number = 440) {
    if (!this.enabled || style === 'none') return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(this.volume, now);
      masterGain.connect(ctx.destination);

      switch (style) {
        case 'whoosh_impact': {
          // Swoosh filtered noise followed by deep sub boom
          this.synthesizeWhooshImpact(ctx, masterGain, frequency);
          break;
        }
        case 'cyber_click': {
          // High pitch digital blip & sub pulse
          this.synthesizeCyberClick(ctx, masterGain, frequency);
          break;
        }
        case 'deep_sub_boom': {
          // Cinema 808-style low rumble
          this.synthesizeSubBoom(ctx, masterGain, frequency);
          break;
        }
        case 'crystal_chime': {
          // Elegant bell harmonics for luxury
          this.synthesizeChime(ctx, masterGain, frequency);
          break;
        }
        case 'electric_zap': {
          // Sci-fi laser buzz
          this.synthesizeElectricZap(ctx, masterGain, frequency);
          break;
        }
        case 'luxury_swell': {
          // Warm harmonic swell
          this.synthesizeLuxurySwell(ctx, masterGain, frequency);
          break;
        }
        default:
          this.synthesizeWhooshImpact(ctx, masterGain, frequency);
      }
    } catch (e) {
      console.warn('Audio playback not permitted yet:', e);
    }
  }

  private synthesizeWhooshImpact(ctx: AudioContext, destination: GainNode, baseFreq: number) {
    const now = ctx.currentTime;
    
    // Low whoosh osc
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq * 0.4, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, now + 0.3);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.6);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.7, now + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    osc.connect(gain);
    gain.connect(destination);
    osc.start(now);
    osc.stop(now + 0.75);

    // Impact sub kick
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(150, now + 0.28);
    subOsc.frequency.exponentialRampToValueAtTime(40, now + 0.65);

    subGain.gain.setValueAtTime(0.001, now);
    subGain.gain.setValueAtTime(0.9, now + 0.28);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

    subOsc.connect(subGain);
    subGain.connect(destination);
    subOsc.start(now + 0.28);
    subOsc.stop(now + 0.8);
  }

  private synthesizeCyberClick(ctx: AudioContext, destination: GainNode, baseFreq: number) {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(baseFreq * 2, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, now + 0.12);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

    osc.connect(gain);
    gain.connect(destination);
    osc.start(now);
    osc.stop(now + 0.15);

    // Resonance echo
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(baseFreq * 1.5, now + 0.08);
    gain2.gain.setValueAtTime(0.3, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc2.connect(gain2);
    gain2.connect(destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.38);
  }

  private synthesizeSubBoom(ctx: AudioContext, destination: GainNode, _baseFreq: number) {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.9);

    gain.gain.setValueAtTime(0.9, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);

    osc.connect(gain);
    gain.connect(destination);
    osc.start(now);
    osc.stop(now + 1.05);
  }

  private synthesizeChime(ctx: AudioContext, destination: GainNode, baseFreq: number) {
    const now = ctx.currentTime;
    const freqs = [baseFreq, baseFreq * 1.25, baseFreq * 1.5, baseFreq * 2];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);

      gain.gain.setValueAtTime(0.001, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.35 / (idx + 1), now + idx * 0.04 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2 + idx * 0.1);

      osc.connect(gain);
      gain.connect(destination);
      osc.start(now + idx * 0.04);
      osc.stop(now + 1.4);
    });
  }

  private synthesizeElectricZap(ctx: AudioContext, destination: GainNode, baseFreq: number) {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(baseFreq * 3, now);
    osc.frequency.linearRampToValueAtTime(120, now + 0.25);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(destination);
    osc.start(now);
    osc.stop(now + 0.32);
  }

  private synthesizeLuxurySwell(ctx: AudioContext, destination: GainNode, baseFreq: number) {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq * 0.75, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq, now + 0.8);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.6, now + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    osc.connect(gain);
    gain.connect(destination);
    osc.start(now);
    osc.stop(now + 1.45);
  }
}

export const kineticAudio = new KineticAudioSynthesizer();
