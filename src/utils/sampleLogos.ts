import { SampleLogo } from '../types/motion';

export const SAMPLE_LOGOS: SampleLogo[] = [
  {
    id: 'cyber-pulse',
    name: 'Cyber Core AI',
    category: 'Tecnología & IA',
    accentColor: '#06b6d4',
    recommendedVibe: 'cyberpunk',
    svg: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cyber-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00f0ff" />
          <stop offset="50%" stop-color="#3b82f6" />
          <stop offset="100%" stop-color="#a855f7" />
        </linearGradient>
        <filter id="glow-cyber" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <!-- Outer Hex -->
      <polygon points="100,20 170,60 170,140 100,180 30,140 30,60" stroke="url(#cyber-grad)" stroke-width="6" stroke-linejoin="round" fill="none" filter="url(#glow-cyber)" />
      <!-- Inner Core -->
      <polygon points="100,48 145,74 145,126 100,152 55,126 55,74" fill="url(#cyber-grad)" opacity="0.3" />
      <polygon points="100,55 138,77 138,123 100,145 62,123 62,77" stroke="#ffffff" stroke-width="3" fill="none" />
      <!-- Central Quantum Node -->
      <circle cx="100" cy="100" r="14" fill="#00f0ff" />
      <circle cx="100" cy="100" r="6" fill="#ffffff" />
      <!-- Circuit Nodes -->
      <circle cx="100" cy="20" r="4" fill="#00f0ff" />
      <circle cx="170" cy="60" r="4" fill="#00f0ff" />
      <circle cx="170" cy="140" r="4" fill="#a855f7" />
      <circle cx="100" cy="180" r="4" fill="#a855f7" />
      <circle cx="30" cy="140" r="4" fill="#3b82f6" />
      <circle cx="30" cy="60" r="4" fill="#3b82f6" />
    </svg>`,
  },
  {
    id: 'aura-luxe',
    name: 'Aura Royale',
    category: 'Lujo & Moda',
    accentColor: '#eab308',
    recommendedVibe: 'luxury',
    svg: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef08a" />
          <stop offset="30%" stop-color="#eab308" />
          <stop offset="70%" stop-color="#ca8a04" />
          <stop offset="100%" stop-color="#fef08a" />
        </linearGradient>
      </defs>
      <!-- Circular Laurel Ribbon / Crown Ring -->
      <circle cx="100" cy="100" r="76" stroke="url(#gold-grad)" stroke-width="2.5" stroke-dasharray="8 6" />
      <circle cx="100" cy="100" r="82" stroke="url(#gold-grad)" stroke-width="1" opacity="0.6" />
      <!-- Central Octahedron Diamond -->
      <polygon points="100,45 142,88 100,155 58,88" stroke="url(#gold-grad)" stroke-width="4" fill="none" />
      <line x1="58" y1="88" x2="142" y2="88" stroke="url(#gold-grad)" stroke-width="3" />
      <line x1="100" y1="45" x2="100" y2="155" stroke="url(#gold-grad)" stroke-width="2.5" />
      <polygon points="100,45 118,88 100,155 82,88" fill="url(#gold-grad)" opacity="0.25" />
      <!-- Star Sparkles -->
      <path d="M100 22 L103 32 L113 35 L103 38 L100 48 L97 38 L87 35 L97 32 Z" fill="url(#gold-grad)" />
      <path d="M100 152 L102 158 L108 160 L102 162 L100 168 L98 162 L92 160 L98 158 Z" fill="url(#gold-grad)" />
    </svg>`,
  },
  {
    id: 'apex-velocity',
    name: 'Apex Speed',
    category: 'Deportes & Gaming',
    accentColor: '#f97316',
    recommendedVibe: 'energetic',
    svg: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="speed-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffedd5" />
          <stop offset="25%" stop-color="#fb923c" />
          <stop offset="75%" stop-color="#ea580c" />
          <stop offset="100%" stop-color="#dc2626" />
        </linearGradient>
      </defs>
      <!-- Dynamic Racing Chevrons -->
      <path d="M40 145 L85 55 L130 145 L105 145 L85 102 L65 145 Z" fill="url(#speed-grad)" />
      <path d="M110 145 L145 75 L180 145 L160 145 L145 115 L130 145 Z" fill="url(#speed-grad)" opacity="0.85" />
      <!-- Speed Dash Lines -->
      <line x1="20" y1="70" x2="60" y2="70" stroke="#f97316" stroke-width="4" stroke-linecap="round" />
      <line x1="15" y1="90" x2="45" y2="90" stroke="#f97316" stroke-width="4" stroke-linecap="round" opacity="0.7" />
      <line x1="25" y1="110" x2="55" y2="110" stroke="#f97316" stroke-width="3" stroke-linecap="round" opacity="0.4" />
    </svg>`,
  },
  {
    id: 'terra-eco',
    name: 'Terra Bio Botanics',
    category: 'Orgánico & Eco',
    accentColor: '#10b981',
    recommendedVibe: 'liquid',
    svg: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="leaf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#6ee7b7" />
          <stop offset="50%" stop-color="#10b981" />
          <stop offset="100%" stop-color="#047857" />
        </linearGradient>
      </defs>
      <!-- Spiraling Double Leaf -->
      <path d="M100 25 C145 25 175 65 175 110 C175 155 135 175 100 175 C100 135 115 105 140 90 C110 95 85 120 75 150 C50 140 40 110 40 95 C40 50 75 25 100 25 Z" fill="url(#leaf-grad)" />
      <!-- Central Dew Drop -->
      <circle cx="100" cy="115" r="9" fill="#a7f3d0" />
      <path d="M100 95 C100 95 109 110 109 115 C109 120 105 124 100 124 C95 124 91 120 91 115 C91 110 100 95 100 95 Z" fill="#ffffff" opacity="0.8" />
    </svg>`,
  },
  {
    id: 'vortex-media',
    name: 'Vortex Cinema',
    category: 'Cine & Streaming',
    accentColor: '#8b5cf6',
    recommendedVibe: 'cinematic',
    svg: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="vortex-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#c084fc" />
          <stop offset="50%" stop-color="#8b5cf6" />
          <stop offset="100%" stop-color="#4c1d95" />
        </linearGradient>
      </defs>
      <!-- Dynamic Swirl Blades -->
      <path d="M100 30 C135 30 165 58 170 95 C150 90 125 95 100 100 C100 65 100 45 100 30 Z" fill="url(#vortex-grad)" opacity="0.95" />
      <path d="M170 105 C165 142 135 170 100 170 C100 155 105 130 100 100 C130 100 155 105 170 105 Z" fill="url(#vortex-grad)" opacity="0.8" />
      <path d="M90 170 C55 165 30 135 30 100 C45 100 70 105 100 100 C100 135 95 155 90 170 Z" fill="url(#vortex-grad)" opacity="0.65" />
      <path d="M30 90 C35 55 65 30 100 30 C100 45 95 70 100 100 C70 95 45 90 30 90 Z" fill="url(#vortex-grad)" opacity="0.5" />
      <circle cx="100" cy="100" r="16" fill="#ffffff" />
      <polygon points="96,91 108,100 96,109" fill="#4c1d95" />
    </svg>`,
  },
  {
    id: 'pixel-arcade',
    name: 'PlayPop Studio',
    category: 'Casual & Apps',
    accentColor: '#ec4899',
    recommendedVibe: 'playful',
    svg: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pop-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f472b6" />
          <stop offset="60%" stop-color="#ec4899" />
          <stop offset="100%" stop-color="#be185d" />
        </linearGradient>
      </defs>
      <!-- Rounded Jelly Ghost / Mascot -->
      <rect x="40" y="45" width="120" height="110" rx="36" fill="url(#pop-grad)" />
      <!-- Kawaii Eyes -->
      <ellipse cx="78" cy="90" rx="9" ry="13" fill="#ffffff" />
      <ellipse cx="122" cy="90" rx="9" ry="13" fill="#ffffff" />
      <circle cx="80" cy="88" r="5" fill="#1e1b4b" />
      <circle cx="124" cy="88" r="5" fill="#1e1b4b" />
      <!-- Cheeks -->
      <circle cx="64" cy="108" r="8" fill="#fda4af" opacity="0.7" />
      <circle cx="136" cy="108" r="8" fill="#fda4af" opacity="0.7" />
      <!-- Cute Smile -->
      <path d="M92 108 Q100 118 108 108" stroke="#1e1b4b" stroke-width="4" stroke-linecap="round" fill="none" />
      <!-- Sparkle on head -->
      <polygon points="100,22 103,32 113,35 103,38 100,48 97,38 87,35 97,32" fill="#fbbf24" />
    </svg>`,
  },
];
