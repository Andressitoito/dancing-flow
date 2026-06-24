export const APP_PALETTES = {
  tropical: {
    name: 'Tropical (Nueva)',
    primary: '#4ade80',
    secondary: '#fbbf24',
    accent: '#22d3ee',
    background: '#062e26',
    surface: '#0d4a3e',
    border: '#146e59'
  },
  latina: {
    name: 'Latina (Original)',
    primary: '#f472b6',
    secondary: '#fbbf24',
    accent: '#d8b4fe',
    background: '#3b1219',
    surface: '#5c1d28',
    border: '#832e3c'
  },
  classic: {
    name: 'Clásico Dark',
    primary: '#e11d48',
    secondary: '#fbbf24',
    accent: '#10b981',
    background: '#111111',
    surface: '#1f1f1f',
    border: '#333333'
  }
};

export const API_BASE_URL = '/backend-service';

export const getMediaUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  // Use relative path for production, which will be proxied by Nginx or served by the same express server
  // For development, Vite proxy handles /backend-service
  // But media files are often served from /uploads directly
  return path;
};

export const APP_COLORS = [
  '#e11d48', // Rose
  '#fbbf24', // Amber
  '#10b981', // Emerald
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
  '#f97316', // Orange
  '#06b6d4', // Cyan
  '#e28000', // Deep Orange
  '#ff9800', // Bright Orange
  '#ffc340', // Golden
  '#e00000', // Deep Red
  '#ff0000', // Pure Red
];

export const QUESTIONNAIRE_OPTIONS = {
  whyStarted: [
    { id: 'social', label: 'Socializar y conocer gente' },
    { id: 'hobby', label: 'Hobby y diversión' },
    { id: 'sport', label: 'Deporte y salud' },
    { id: 'profession', label: 'Carrera profesional' },
    { id: 'emotional', label: 'Desahogo emocional / Terapia' }
  ],
  objectives: [
    { id: 'social_dance', label: 'Bailar mejor en el social' },
    { id: 'shows', label: 'Hacer shows y coreografías' },
    { id: 'teacher', label: 'Formarme como profesor' },
    { id: 'technique', label: 'Perfeccionar mi técnica' },
    { id: 'competition', label: 'Competir' }
  ],
  hardestPart: [
    { id: 'rhythm', label: 'El ritmo y la música' },
    { id: 'technique', label: 'La técnica de pasos' },
    { id: 'connection', label: 'La conexión en pareja' },
    { id: 'expression', label: 'La expresión corporal' },
    { id: 'memory', label: 'Memorizar secuencias' }
  ],
  fears: [
    { id: 'ridicule', label: 'Hacer el ridículo' },
    { id: 'camera', label: 'La cámara / Grabarme' },
    { id: 'mistakes', label: 'Equivocarme y molestar a la pareja' },
    { id: 'judgment', label: 'El juicio de los demás' },
    { id: 'not_learning', label: 'No ser capaz de aprender' }
  ],
  recordingPreference: [
    { id: 'alone', label: 'Prefiero grabar solo' },
    { id: 'couple', label: 'Quiero grabar en pareja' },
    { id: 'shy', label: 'Me da vergüenza la cámara' },
    { id: 'show', label: 'Quiero hacer shows' },
    { id: 'training_teacher', label: 'Entrenando para profesor' }
  ]
};
