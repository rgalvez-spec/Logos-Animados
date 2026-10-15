import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// API Route: AI Motion Choreographer for Logos
app.post('/api/animate-logo', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/png', userPrompt = '', brandVibe = 'auto', stylePreset } = req.body;

    if (!ai) {
      // Fallback smart choreography if API key is not yet configured
      return res.json({
        success: true,
        source: 'heuristic_engine',
        choreography: getProceduralChoreography(userPrompt, brandVibe || stylePreset),
      });
    }

    const parts: any[] = [];

    if (imageBase64) {
      // Clean base64 header if present
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
      parts.push({
        inlineData: {
          mimeType: mimeType || 'image/png',
          data: cleanBase64,
        },
      });
    }

    const promptText = `Eres un Director de Animación y Motion Designer de clase mundial para marcas globales (Apple, Nike, PlayStation, Netflix).
Analiza este logotipo visualmente (colores, formas geométricas, balance, tipografía, silueta y peso visual).
Luego diseña una coreografía de movimiento cinemática, automática y de alto impacto.

Instrucción adicional del usuario: "${userPrompt || 'Genera la animación de movimiento más impresionante y adecuada para este logo'}".
Estilo deseado: "${brandVibe || 'auto'}".

Devuelve ÚNICAMENTE un JSON válido con la siguiente estructura y parámetros matemáticos de animación:
{
  "brandAnalysis": {
    "detectedName": "nombre o descripción del logo",
    "shapeArchetype": "circular | geometric | organic | shield | typographic | abstract | mascot",
    "primaryColor": "#hex",
    "secondaryColor": "#hex",
    "accentGlowColor": "#hex",
    "mood": "descripción de 2 a 4 palabras de la energía y vibración de la marca",
    "recommendedVibe": "cyberpunk | luxury | cinematic | liquid | playful | minimal | energetic"
  },
  "choreography": {
    "title": "Nombre creativo del estilo de movimiento (ej: Cyber Quantum Surge, Golden Liquid Flourish)",
    "description": "Explicación de 1 frase del movimiento cinematográfico aplicado",
    "entrance": {
      "type": "elastic_pop | cyber_glitch | liquid_splash | 3d_vortex | luxury_shimmer | cosmic_zoom | minimalist_unfold | neon_trace | shockwave_pulse",
      "duration": 1.4,
      "delay": 0.1,
      "easing": "cubic-bezier(0.16, 1, 0.3, 1)",
      "springStiffness": 220,
      "springDamping": 16,
      "initialScale": 0.2,
      "finalScale": 1.0,
      "initialRotateZ": -45,
      "initialRotateX": 30,
      "initialRotateY": -25,
      "initialBlur": 12,
      "glowIntensity": 1.8
    },
    "idleLoop": {
      "type": "levitate_float | breathing_pulse | 3d_gyro_spin | holographic_flicker | liquid_wave | subtle_drift",
      "speed": 1.0,
      "amplitude": 12,
      "rotationRange": 8,
      "perspectiveDepth": 600
    },
    "particles": {
      "enabled": true,
      "type": "sparks | starlight | cyber_shards | liquid_drops | golden_dust | smoke_wisps | geometric_nodes",
      "count": 45,
      "speed": 1.8,
      "spreadAngle": 360,
      "color": "#hex",
      "burstOnImpact": true
    },
    "lighting": {
      "shineAngle": 45,
      "shineSpeed": 1.2,
      "spotlightIntensity": 0.8,
      "chromaticAberration": 0.3
    },
    "soundFx": {
      "synthStyle": "whoosh_impact | cyber_click | deep_sub_boom | crystal_chime | electric_zap | luxury_swell",
      "pitchFrequency": 440,
      "duration": 0.8
    }
  }
}`;

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const jsonText = response.text ? response.text.trim() : '{}';
    let data;
    try {
      data = JSON.parse(jsonText);
    } catch (parseErr) {
      // Clean possible markdown code fences
      const cleanJson = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();
      data = JSON.parse(cleanJson);
    }

    return res.json({
      success: true,
      source: 'gemini_ai',
      ...data,
    });
  } catch (error: any) {
    console.error('Gemini motion generation error:', error);
    // Return gracefully with smart procedural engine
    return res.json({
      success: true,
      source: 'heuristic_engine_fallback',
      choreography: getProceduralChoreography(req.body?.userPrompt, req.body?.brandVibe),
      errorDetail: error.message,
    });
  }
});

// Heuristic fallback generator when offline or API key isn't provided
function getProceduralChoreography(userPrompt = '', vibe = 'auto') {
  const isCyber = userPrompt.toLowerCase().includes('cyber') || userPrompt.toLowerCase().includes('glitch') || vibe === 'cyberpunk';
  const isLuxury = userPrompt.toLowerCase().includes('lujo') || userPrompt.toLowerCase().includes('oro') || vibe === 'luxury';
  const isLiquid = userPrompt.toLowerCase().includes('líquid') || userPrompt.toLowerCase().includes('agua') || vibe === 'liquid';
  const isPlayful = userPrompt.toLowerCase().includes('rebote') || userPrompt.toLowerCase().includes('juguet') || vibe === 'playful';

  if (isCyber) {
    return {
      title: 'Cyber Pulse & Glitch Shockwave',
      description: 'Entrada acelerada con aberración cromática, destello de neón y desintegración digital.',
      brandAnalysis: {
        detectedName: 'Cyberpunk Crest',
        shapeArchetype: 'geometric',
        primaryColor: '#06b6d4',
        secondaryColor: '#ec4899',
        accentGlowColor: '#3b82f6',
        mood: 'Futurista, Eléctrico, Disruptivo',
        recommendedVibe: 'cyberpunk',
      },
      entrance: {
        type: 'cyber_glitch',
        duration: 1.1,
        delay: 0.05,
        easing: 'cubic-bezier(0.2, 0.9, 0.3, 1.2)',
        springStiffness: 280,
        springDamping: 14,
        initialScale: 0.1,
        finalScale: 1.0,
        initialRotateZ: 15,
        initialRotateX: 20,
        initialRotateY: -20,
        initialBlur: 14,
        glowIntensity: 2.2,
      },
      idleLoop: {
        type: 'holographic_flicker',
        speed: 1.4,
        amplitude: 10,
        rotationRange: 6,
        perspectiveDepth: 550,
      },
      particles: {
        enabled: true,
        type: 'cyber_shards',
        count: 60,
        speed: 2.4,
        spreadAngle: 360,
        color: '#00f0ff',
        burstOnImpact: true,
      },
      lighting: {
        shineAngle: 60,
        shineSpeed: 2.0,
        spotlightIntensity: 0.9,
        chromaticAberration: 0.7,
      },
      soundFx: {
        synthStyle: 'electric_zap',
        pitchFrequency: 580,
        duration: 0.6,
      },
    };
  }

  if (isLuxury) {
    return {
      title: 'Golden Shimmer & Royal Reveal',
      description: 'Elegante giro de 360 grados en 3D con barrido de luz aurea y polvo de diamantes.',
      brandAnalysis: {
        detectedName: 'Luxury Monogram',
        shapeArchetype: 'shield',
        primaryColor: '#eab308',
        secondaryColor: '#fef08a',
        accentGlowColor: '#fbbf24',
        mood: 'Sofisticado, Prestigioso, Atemporal',
        recommendedVibe: 'luxury',
      },
      entrance: {
        type: 'luxury_shimmer',
        duration: 1.8,
        delay: 0.15,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        springStiffness: 160,
        springDamping: 22,
        initialScale: 0.4,
        finalScale: 1.0,
        initialRotateZ: -20,
        initialRotateX: 25,
        initialRotateY: -35,
        initialBlur: 8,
        glowIntensity: 1.5,
      },
      idleLoop: {
        type: 'levitate_float',
        speed: 0.8,
        amplitude: 8,
        rotationRange: 5,
        perspectiveDepth: 700,
      },
      particles: {
        enabled: true,
        type: 'golden_dust',
        count: 40,
        speed: 1.1,
        spreadAngle: 360,
        color: '#fbbf24',
        burstOnImpact: true,
      },
      lighting: {
        shineAngle: 45,
        shineSpeed: 1.0,
        spotlightIntensity: 1.0,
        chromaticAberration: 0.1,
      },
      soundFx: {
        synthStyle: 'luxury_swell',
        pitchFrequency: 520,
        duration: 1.0,
      },
    };
  }

  // Default Cinematic Vortex
  return {
    title: 'Kinetic Dimensional Vortex',
    description: 'Aceleración centrífuga con impacto elástico y onda expansiva de partículas luminosas.',
    brandAnalysis: {
      detectedName: 'Dynamic Brandmark',
      shapeArchetype: 'circular',
      primaryColor: '#6366f1',
      secondaryColor: '#a855f7',
      accentGlowColor: '#8b5cf6',
      mood: 'Innovador, Vanguardista, Impactante',
      recommendedVibe: 'cinematic',
    },
    entrance: {
      type: 'elastic_pop',
      duration: 1.3,
      delay: 0.1,
      easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      springStiffness: 230,
      springDamping: 15,
      initialScale: 0.15,
      finalScale: 1.0,
      initialRotateZ: -60,
      initialRotateX: 25,
      initialRotateY: 30,
      initialBlur: 10,
      glowIntensity: 1.8,
    },
    idleLoop: {
      type: 'breathing_pulse',
      speed: 1.1,
      amplitude: 10,
      rotationRange: 7,
      perspectiveDepth: 650,
    },
    particles: {
      enabled: true,
      type: 'sparks',
      count: 50,
      speed: 1.9,
      spreadAngle: 360,
      color: '#818cf8',
      burstOnImpact: true,
    },
    lighting: {
      shineAngle: 45,
      shineSpeed: 1.4,
      spotlightIntensity: 0.85,
      chromaticAberration: 0.25,
    },
    soundFx: {
      synthStyle: 'whoosh_impact',
      pitchFrequency: 440,
      duration: 0.8,
    },
  };
}

// Development with Vite or production static build
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 LogoMotion AI Server running on port ${PORT} [${isDev ? 'development' : 'production'}]`);
  });
}

startServer();
