export const APP_PALETTES = {
  premium: {
    name: 'Oro y Negro Premium',
    primary: '#D4AF37',
    secondary: '#EAC249',
    accent: '#C5A028',
    background: '#000000',
    surface: '#051424',
    border: 'rgba(212, 175, 55, 0.2)'
  }
};

export const API_BASE_URL = '/backend-service';

export const getMediaUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return path;
};

export const APP_COLORS = [
  '#D4AF37', // Gold
  '#F9E498', // Champagne
  '#C5A028', // Deep Gold
  '#EAC249', // Secondary Gold
  '#ffffff', // White
  '#A0A0A0', // Grey
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
