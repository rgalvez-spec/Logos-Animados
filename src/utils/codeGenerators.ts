import { MotionChoreography, LogoDisplaySettings } from '../types/motion';

export function generateCssCode(
  choreography: MotionChoreography,
  logoSettings?: LogoDisplaySettings
): string {
  const { entrance, idleLoop } = choreography;
  const shadowCol = logoSettings?.shadowColor || '#6366f1';
  const shadowBlur = logoSettings?.shadowBlur ?? 24;
  const size = logoSettings?.size || 280;

  return `/* ========================================================
   LogoMotion AI - Generated CSS Animation
   Style: ${choreography.title}
   Logo Size: ${size}px | Shadow: ${shadowCol}
   ======================================================== */

.animated-logo-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  perspective: ${idleLoop.perspectiveDepth}px;
}

.animated-logo {
  width: ${size}px;
  height: auto;
  max-width: 100%;
  animation: 
    logo-entrance ${entrance.duration}s ${entrance.easing} ${entrance.delay}s forwards,
    logo-idle ${idleLoop.speed * 3}s ease-in-out ${entrance.duration + entrance.delay}s infinite alternate;
  transform-style: preserve-3d;
  will-change: transform, filter, opacity;
}

@keyframes logo-entrance {
  0% {
    opacity: 0;
    transform: 
      scale(${entrance.initialScale})
      rotateZ(${entrance.initialRotateZ}deg)
      rotateX(${entrance.initialRotateX}deg)
      rotateY(${entrance.initialRotateY}deg);
    filter: blur(${entrance.initialBlur}px) drop-shadow(0 15px ${shadowBlur}px ${shadowCol});
  }
  60% {
    opacity: 1;
    transform: scale(${entrance.finalScale * 1.08}) rotateZ(0deg) rotateX(0deg) rotateY(0deg);
  }
  100% {
    opacity: 1;
    transform: scale(${entrance.finalScale}) rotateZ(0deg) rotateX(0deg) rotateY(0deg);
    filter: blur(0px) drop-shadow(0 15px ${shadowBlur}px ${shadowCol});
  }
}

@keyframes logo-idle {
  0% {
    transform: translateY(0px) rotateX(0deg) rotateY(0deg);
  }
  50% {
    transform: translateY(-${idleLoop.amplitude}px) rotateX(${idleLoop.rotationRange}deg) rotateY(-${idleLoop.rotationRange * 0.8}deg);
  }
  100% {
    transform: translateY(0px) rotateX(0deg) rotateY(0deg);
  }
}
`;
}

export function generateFramerMotionCode(
  choreography: MotionChoreography,
  logoSettings?: LogoDisplaySettings
): string {
  const { entrance, idleLoop } = choreography;
  const shadowCol = logoSettings?.shadowColor || '#6366f1';
  const shadowBlur = logoSettings?.shadowBlur ?? 24;
  const size = logoSettings?.size || 280;

  return `import { motion } from 'motion/react';

export function AnimatedLogo({ src, alt = "Logo" }: { src: string; alt?: string }) {
  return (
    <div style={{ perspective: ${idleLoop.perspectiveDepth} }}>
      <motion.img
        src={src}
        alt={alt}
        initial={{
          opacity: 0,
          scale: ${entrance.initialScale},
          rotateZ: ${entrance.initialRotateZ},
          rotateX: ${entrance.initialRotateX},
          rotateY: ${entrance.initialRotateY},
          filter: "blur(${entrance.initialBlur}px) drop-shadow(0 15px ${shadowBlur}px ${shadowCol})",
        }}
        animate={{
          opacity: 1,
          scale: [${entrance.initialScale}, ${entrance.finalScale * 1.06}, ${entrance.finalScale}],
          rotateZ: 0,
          rotateX: [${entrance.initialRotateX}, 0, ${idleLoop.rotationRange}, 0],
          rotateY: [${entrance.initialRotateY}, 0, -${idleLoop.rotationRange}, 0],
          y: [0, -${idleLoop.amplitude}, 0],
          filter: "blur(0px) drop-shadow(0 15px ${shadowBlur}px ${shadowCol})",
        }}
        transition={{
          duration: ${entrance.duration},
          ease: [0.16, 1, 0.3, 1],
          y: {
            repeat: Infinity,
            duration: ${idleLoop.speed * 2.5},
            ease: "easeInOut",
          },
        }}
        style={{
          width: '${size}px',
          height: 'auto',
          objectFit: 'contain',
        }}
      />
    </div>
  );
}
`;
}

export function generateTailwindSnippet(
  choreography: MotionChoreography,
  logoSettings?: LogoDisplaySettings
): string {
  const size = logoSettings?.size || 280;
  const shadowCol = logoSettings?.shadowColor || '#6366f1';

  return `// Tailwind CSS Config Extension (tailwind.config.js):
module.exports = {
  theme: {
    extend: {
      keyframes: {
        'logo-pop': {
          '0%': { transform: 'scale(${choreography.entrance.initialScale}) rotate(${choreography.entrance.initialRotateZ}deg)', opacity: '0' },
          '70%': { transform: 'scale(1.08) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        'logo-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-${choreography.idleLoop.amplitude}px)' },
        }
      },
      animation: {
        'logo-in': 'logo-pop ${choreography.entrance.duration}s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'logo-float': 'logo-float ${choreography.idleLoop.speed * 2.5}s ease-in-out infinite',
      }
    }
  }
};

// HTML / JSX Usage:
// <img 
//   src="/logo.png" 
//   style={{ width: '${size}px', filter: 'drop-shadow(0 15px 24px ${shadowCol})' }} 
//   className="animate-logo-in animate-logo-float object-contain" 
// />
`;
}
