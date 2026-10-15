import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MotionChoreography, StageBackground, ParticleType, LogoDisplaySettings } from '../types/motion';
import { kineticAudio } from '../utils/audioSynth';

interface MotionCanvasProps {
  logoSrc: string; // Data URL, SVG data URL, or image URL
  choreography: MotionChoreography;
  background: StageBackground;
  isPlaying: boolean;
  replayTrigger: number;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onTimeUpdate?: (currentTime: number, progress: number) => void;
  interactiveGyro?: boolean;
  logoSettings: LogoDisplaySettings;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  rotation: number;
  vRot: number;
  type: ParticleType;
}

export const MotionCanvas: React.FC<MotionCanvasProps> = ({
  logoSrc,
  choreography,
  background,
  isPlaying,
  replayTrigger,
  canvasRef,
  onTimeUpdate,
  interactiveGyro = true,
  logoSettings,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Animation timeline state
  const animTimeRef = useRef<number>(0);
  const lastTimestampRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  // Mouse tilt
  const mouseTiltRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  // Particle pool
  const particlesRef = useRef<Particle[]>([]);
  const hasTriggeredImpactRef = useRef<boolean>(false);

  // Preload logo image
  useEffect(() => {
    setImageLoaded(false);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
      resetAnimation();
    };
    img.onerror = () => {
      console.warn('Failed to load logo image:', logoSrc.slice(0, 50));
    };
    img.src = logoSrc;
  }, [logoSrc]);

  // Reset animation and particles on replay
  const resetAnimation = useCallback(() => {
    animTimeRef.current = 0;
    lastTimestampRef.current = performance.now();
    hasTriggeredImpactRef.current = false;
    particlesRef.current = [];

    // Trigger kinetic audio
    if (choreography.soundFx && choreography.soundFx.synthStyle !== 'none') {
      kineticAudio.playSound(
        choreography.soundFx.synthStyle,
        choreography.soundFx.pitchFrequency || 440
      );
    }
  }, [choreography]);

  useEffect(() => {
    resetAnimation();
  }, [replayTrigger, resetAnimation]);

  // Mouse move for 3D gyro tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactiveGyro || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1 to 1
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseTiltRef.current.targetX = nx * 18;
    mouseTiltRef.current.targetY = ny * 18;
  };

  const handleMouseLeave = () => {
    mouseTiltRef.current.targetX = 0;
    mouseTiltRef.current.targetY = 0;
  };

  // Spawn particle burst on impact
  const spawnParticleBurst = (cx: number, cy: number, count: number, pColor: string, type: ParticleType) => {
    const list: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = (Math.random() * 4 + 2) * choreography.particles.speed;
      list.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 5 + 2,
        color: pColor,
        alpha: 1,
        life: 0,
        maxLife: Math.random() * 50 + 35,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.15,
        type,
      });
    }
    particlesRef.current.push(...list);
  };

  // Spawn continuous floating ambient particles
  const spawnAmbientParticle = (cx: number, cy: number, pColor: string, type: ParticleType) => {
    if (particlesRef.current.length > 90) return;
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * 120 + 20;
    particlesRef.current.push({
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -Math.random() * 1.2 - 0.2, // gently float up
      size: Math.random() * 3 + 1.5,
      color: pColor,
      alpha: Math.random() * 0.7 + 0.3,
      life: 0,
      maxLife: Math.random() * 70 + 40,
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.05,
      type,
    });
  };

  // Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const render = (now: number) => {
      if (!isRunning) return;

      const dt = lastTimestampRef.current ? Math.min((now - lastTimestampRef.current) / 1000, 0.08) : 0.016;
      lastTimestampRef.current = now;

      if (isPlaying) {
        animTimeRef.current += dt;
      }

      const t = animTimeRef.current;
      const entranceDur = Math.max(0.4, choreography.entrance.duration);
      const totalCycle = entranceDur + 4.0; // 4 seconds idle loop

      if (onTimeUpdate) {
        const progress = Math.min(1, (t % totalCycle) / totalCycle);
        onTimeUpdate(t, progress);
      }

      // Smooth mouse gyro
      mouseTiltRef.current.x += (mouseTiltRef.current.targetX - mouseTiltRef.current.x) * 0.08;
      mouseTiltRef.current.y += (mouseTiltRef.current.targetY - mouseTiltRef.current.y) * 0.08;

      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      // 1. Draw Background
      ctx.save();
      drawBackground(ctx, width, height, background, t, choreography);

      // Check impact trigger for particles & shake
      if (t >= entranceDur * 0.65 && !hasTriggeredImpactRef.current) {
        hasTriggeredImpactRef.current = true;
        if (choreography.particles.enabled && choreography.particles.burstOnImpact) {
          const pColor = choreography.particles.color || choreography.brandAnalysis?.accentGlowColor || '#6366f1';
          spawnParticleBurst(cx, cy, choreography.particles.count, pColor, choreography.particles.type);
        }
      }

      // Occasional ambient particle
      if (choreography.particles.enabled && Math.random() < 0.35) {
        const pColor = choreography.particles.color || '#a855f7';
        spawnAmbientParticle(cx, cy, pColor, choreography.particles.type);
      }

      // 2. Compute Logo Transformations
      let scale = 1;
      let rotZ = 0;
      let rotX = 0;
      let rotY = 0;
      let offsetY = 0;
      let alpha = 1;
      let blur = 0;
      let glitchJitterX = 0;
      let glitchJitterY = 0;

      const { entrance, idleLoop } = choreography;

      if (t < entranceDur) {
        // Entrance Phase
        const p = Math.min(1, Math.max(0, t / entranceDur));
        const eased = getEaseValue(p, entrance.type);

        scale = entrance.initialScale + (entrance.finalScale - entrance.initialScale) * eased;
        rotZ = (entrance.initialRotateZ || 0) * (1 - eased);
        rotX = (entrance.initialRotateX || 0) * (1 - eased);
        rotY = (entrance.initialRotateY || 0) * (1 - eased);
        alpha = Math.min(1, p * 2.5);
        blur = (entrance.initialBlur || 0) * (1 - eased);

        // Cyber glitch jitter
        if (entrance.type === 'cyber_glitch' && p < 0.85) {
          glitchJitterX = (Math.random() - 0.5) * 16 * (1 - p);
          glitchJitterY = (Math.random() - 0.5) * 10 * (1 - p);
        }
      } else {
        // Idle Loop Phase
        const loopTime = t - entranceDur;
        scale = entrance.finalScale;
        blur = 0;

        switch (idleLoop.type) {
          case 'levitate_float': {
            offsetY = Math.sin(loopTime * idleLoop.speed * 2) * idleLoop.amplitude;
            rotZ = Math.cos(loopTime * idleLoop.speed) * (idleLoop.rotationRange * 0.4);
            rotY = Math.sin(loopTime * idleLoop.speed * 1.5) * idleLoop.rotationRange;
            break;
          }
          case 'breathing_pulse': {
            const pulse = Math.sin(loopTime * idleLoop.speed * 2.5);
            scale = entrance.finalScale * (1 + pulse * 0.05);
            offsetY = Math.sin(loopTime * idleLoop.speed * 2) * (idleLoop.amplitude * 0.5);
            break;
          }
          case '3d_gyro_spin': {
            rotY = Math.sin(loopTime * idleLoop.speed * 1.8) * (idleLoop.rotationRange * 1.8);
            rotX = Math.cos(loopTime * idleLoop.speed * 1.4) * (idleLoop.rotationRange * 1.2);
            offsetY = Math.sin(loopTime * idleLoop.speed * 2) * idleLoop.amplitude;
            break;
          }
          case 'holographic_flicker': {
            offsetY = Math.sin(loopTime * 3) * 4;
            if (Math.random() < 0.08) {
              glitchJitterX = (Math.random() - 0.5) * 8;
              alpha = 0.82;
            }
            rotY = Math.sin(loopTime * 2) * 5;
            break;
          }
          case 'liquid_wave': {
            offsetY = Math.sin(loopTime * idleLoop.speed * 2.2) * idleLoop.amplitude;
            rotZ = Math.sin(loopTime * idleLoop.speed * 1.5) * 4;
            scale = entrance.finalScale * (1 + Math.sin(loopTime * 4) * 0.03);
            break;
          }
          default:
            offsetY = Math.sin(loopTime * 1.5) * 6;
        }
      }

      // Add interactive mouse gyro tilt
      rotY += mouseTiltRef.current.x;
      rotX -= mouseTiltRef.current.y;

      // 3. Render Particles Behind
      ctx.save();
      renderParticles(ctx, particlesRef.current, dt, true);
      ctx.restore();

      // 4. Render Logo with 2.5D Simulated Transform & Lighting
      if (imageRef.current && imageLoaded) {
        ctx.save();
        ctx.translate(cx + glitchJitterX, cy + offsetY + glitchJitterY);

        // Simulated 3D projection skew and perspective
        const radX = (rotX * Math.PI) / 180;
        const radY = (rotY * Math.PI) / 180;
        const radZ = (rotZ * Math.PI) / 180;

        // Apply 3D-ish matrix: scale, rotateZ, perspective compression
        const cosY = Math.cos(radY);
        const cosX = Math.cos(radX);
        const cosZ = Math.cos(radZ);
        const sinZ = Math.sin(radZ);

        ctx.transform(
          cosZ * scale * cosY,
          sinZ * scale,
          -sinZ * scale,
          cosZ * scale * cosX,
          0,
          0
        );

        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

        const img = imageRef.current;
        const maxDim = logoSettings?.size || 280;
        const aspect = img.width / (img.height || 1);
        let drawW = maxDim;
        let drawH = maxDim;
        if (aspect > 1) {
          drawH = maxDim / aspect;
        } else {
          drawW = maxDim * aspect;
        }

        // Drop shadow onto stage: fully customizable color, opacity, blur & offset
        const shadowColor = hexToRgba(
          logoSettings?.shadowColor || choreography.brandAnalysis?.accentGlowColor || '#6366f1',
          logoSettings?.shadowOpacity ?? 0.6
        );

        ctx.shadowColor = shadowColor;
        ctx.shadowBlur = Math.max(0, logoSettings?.shadowBlur ?? 24);
        ctx.shadowOffsetX = (logoSettings?.shadowOffsetX ?? 0) - rotY * 0.8;
        ctx.shadowOffsetY = (logoSettings?.shadowOffsetY ?? 15) + Math.abs(rotX * 0.8);

        // Draw original logo image purely without alteration
        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

        // Reset shadow for overlays
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;

        // Dynamic Shimmer Light Sweep Flare (only if not preserveOriginal or spotlight configured)
        if (!logoSettings?.preserveOriginal && choreography.lighting.spotlightIntensity > 0.2) {
          const shineT = (t * choreography.lighting.shineSpeed * 0.7) % 2.5;
          if (shineT < 1.0) {
            ctx.save();
            ctx.globalCompositeOperation = 'source-atop';
            const flareProgress = shineT; // 0 to 1
            const flareX = -drawW + flareProgress * (drawW * 2.5);

            const grad = ctx.createLinearGradient(flareX - 60, -drawH, flareX + 60, drawH);
            grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
            grad.addColorStop(0.5, `rgba(255, 255, 255, ${choreography.lighting.spotlightIntensity * 0.75})`);
            grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.fillStyle = grad;
            ctx.fillRect(-drawW, -drawH, drawW * 2, drawH * 2);
            ctx.restore();
          }
        }

        // Chromatic Aberration fringe ONLY when explicitly not in preserveOriginal mode
        if (!logoSettings?.preserveOriginal && choreography.lighting.chromaticAberration > 0.3 && (glitchJitterX !== 0 || Math.random() < 0.15)) {
          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          ctx.globalAlpha = 0.45;
          ctx.drawImage(img, -drawW / 2 + 5, -drawH / 2, drawW, drawH);
          ctx.drawImage(img, -drawW / 2 - 5, -drawH / 2, drawW, drawH);
          ctx.restore();
        }

        ctx.restore();
      }

      // 5. Render Particles In Front
      ctx.save();
      renderParticles(ctx, particlesRef.current, dt, false);
      ctx.restore();

      ctx.restore();

      rafIdRef.current = requestAnimationFrame(render);
    };

    rafIdRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [choreography, background, isPlaying, imageLoaded, onTimeUpdate, interactiveGyro, logoSettings]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-crosshair select-none"
    >
      <canvas
        ref={canvasRef as any}
        width={800}
        height={560}
        className="max-w-full max-h-full rounded-2xl shadow-2xl transition-all"
        style={{ aspectRatio: '800 / 560' }}
      />
    </div>
  );
};

function hexToRgba(hex: string, alpha: number): string {
  if (!hex) return `rgba(0, 0, 0, ${alpha})`;
  if (hex.startsWith('rgba')) return hex;
  if (hex.startsWith('rgb')) {
    return hex.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
  }
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
  }
  const num = parseInt(c, 16);
  if (isNaN(num)) return `rgba(0, 0, 0, ${alpha})`;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Physics Easing Curves
function getEaseValue(p: number, type: string): number {
  if (p <= 0) return 0;
  if (p >= 1) return 1;

  switch (type) {
    case 'elastic_pop': {
      // Elastic overshoot bounce
      const c4 = (2 * Math.PI) / 3;
      return p === 0 ? 0 : p === 1 ? 1 : Math.pow(2, -10 * p) * Math.sin((p * 10 - 0.75) * c4) + 1;
    }
    case 'cyber_glitch': {
      // Stepped snap with instant velocity
      if (p < 0.2) return p * 2.5;
      if (p < 0.6) return 0.75 + Math.sin(p * 20) * 0.08;
      return 1;
    }
    case 'luxury_shimmer':
    case 'liquid_splash': {
      // Smooth cubic ease out
      return 1 - Math.pow(1 - p, 4);
    }
    case '3d_vortex':
    case 'shockwave_pulse': {
      // Overshoot back-out
      const s = 1.70158 * 1.5;
      const t = p - 1;
      return t * t * ((s + 1) * t + s) + 1;
    }
    case 'cosmic_zoom': {
      // Fast start, slow settle
      return 1 - Math.pow(1 - p, 5);
    }
    default:
      return 1 - Math.pow(1 - p, 3);
  }
}

// Background Renderer
function drawBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  bg: StageBackground,
  time: number,
  ch: MotionChoreography
) {
  switch (bg) {
    case 'transparent': {
      // Checkerboard pattern for alpha transparency preview
      const size = 16;
      for (let y = 0; y < h; y += size) {
        for (let x = 0; x < w; x += size) {
          ctx.fillStyle = (Math.floor(x / size) + Math.floor(y / size)) % 2 === 0 ? '#18181b' : '#27272a';
          ctx.fillRect(x, y, size, size);
        }
      }
      break;
    }
    case 'cyber_grid': {
      // Deep dark cyber background with perspective grid
      ctx.fillStyle = '#050713';
      ctx.fillRect(0, 0, w, h);

      // Grid lines
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.12)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      const offset = (time * 25) % gridSize;

      for (let x = offset; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Central neon radial halo
      const grad = ctx.createRadialGradient(w / 2, h / 2, 40, w / 2, h / 2, w / 1.5);
      grad.addColorStop(0, 'rgba(6, 182, 212, 0.22)');
      grad.addColorStop(0.5, 'rgba(168, 85, 247, 0.08)');
      grad.addColorStop(1, 'rgba(5, 7, 19, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      break;
    }
    case 'golden_radial': {
      // Luxury warm royal velvet
      const grad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w / 1.3);
      grad.addColorStop(0, '#291d09');
      grad.addColorStop(0.4, '#171104');
      grad.addColorStop(1, '#070501');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Subtle gold sparkle ring
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.1)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 190, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
    case 'deep_space': {
      ctx.fillStyle = '#030209';
      ctx.fillRect(0, 0, w, h);

      // Cosmic nebula gradient
      const grad = ctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, w / 1.2);
      grad.addColorStop(0, 'rgba(139, 92, 246, 0.18)');
      grad.addColorStop(0.6, 'rgba(59, 130, 246, 0.06)');
      grad.addColorStop(1, '#030209');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      break;
    }
    case 'neon_sunset': {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#1e1035');
      grad.addColorStop(0.6, '#31103c');
      grad.addColorStop(1, '#0b0618');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      const rad = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, 240);
      rad.addColorStop(0, 'rgba(236, 72, 153, 0.25)');
      rad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = rad;
      ctx.fillRect(0, 0, w, h);
      break;
    }
    case 'light_minimal': {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, w, h);

      const grad = ctx.createRadialGradient(w / 2, h / 2, 30, w / 2, h / 2, w / 1.5);
      grad.addColorStop(0, 'rgba(226, 232, 240, 0.8)');
      grad.addColorStop(1, 'rgba(248, 250, 252, 1)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      break;
    }
    case 'dark_studio':
    default: {
      // Premium dark studio with chromatic spotlight
      ctx.fillStyle = '#090a0f';
      ctx.fillRect(0, 0, w, h);

      const accent = ch.brandAnalysis?.accentGlowColor || '#6366f1';
      const grad = ctx.createRadialGradient(w / 2, h / 2 - 30, 40, w / 2, h / 2, w / 1.3);
      grad.addColorStop(0, `${accent}2a`);
      grad.addColorStop(0.5, 'rgba(15, 23, 42, 0.35)');
      grad.addColorStop(1, '#090a0f');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Floor reflection pedestal
      const floorGrad = ctx.createRadialGradient(w / 2, h / 2 + 150, 10, w / 2, h / 2 + 150, 220);
      floorGrad.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
      floorGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = floorGrad;
      ctx.beginPath();
      ctx.ellipse(w / 2, h / 2 + 145, 240, 40, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
  }
}

// Particle Physics Engine
function renderParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  dt: number,
  drawBackLayer: boolean
) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life += 1;
    if (p.life >= p.maxLife) {
      particles.splice(i, 1);
      continue;
    }

    // Physics update
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.96; // drag
    p.vy *= 0.96;
    p.rotation += p.vRot;

    const progress = p.life / p.maxLife;
    const currentAlpha = p.alpha * (1 - progress);

    const isBack = p.vy < 0 || p.size < 3;
    if (isBack !== drawBackLayer) continue;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = Math.max(0, currentAlpha);
    ctx.fillStyle = p.color;

    switch (p.type) {
      case 'cyber_shards':
      case 'geometric_nodes': {
        // Crisp angular diamond shards
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 1.5);
        ctx.lineTo(p.size, 0);
        ctx.moveTo(0, p.size * 1.5);
        ctx.lineTo(-p.size, 0);
        ctx.closePath();
        ctx.fill();
        break;
      }
      case 'golden_dust':
      case 'starlight': {
        // Glowing 4-point star sparkle
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        break;
      }
      case 'liquid_drops': {
        // Soft rounded drops
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case 'sparks':
      default: {
        // Elongated velocity streak
        const speed = Math.hypot(p.vx, p.vy);
        const length = Math.max(p.size, speed * 2.5);
        ctx.fillRect(-p.size / 2, -length / 2, p.size, length);
        break;
      }
    }

    ctx.restore();
  }
}
