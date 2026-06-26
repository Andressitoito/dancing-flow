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
    { id: 'social', label: 'CONEXIÓN SOCIAL' },
    { id: 'hobby', label: 'HOBBY & PASIÓN' },
    { id: 'sport', label: 'BIENESTAR FÍSICO' },
    { id: 'profession', label: 'MAESTRÍA PROFESIONAL' },
    { id: 'emotional', label: 'EVOLUCIÓN EMOCIONAL' }
  ],
  objectives: [
    { id: 'social_dance', label: 'MAESTRÍA EN EL SOCIAL' },
    { id: 'shows', label: 'PERFORMANCE & ESCENARIO' },
    { id: 'teacher', label: 'FORMACIÓN DOCENTE' },
    { id: 'technique', label: 'PERFECCIONAMIENTO TÉCNICO' },
    { id: 'competition', label: 'ÉLITE COMPETITIVA' }
  ],
  hardestPart: [
    { id: 'rhythm', label: 'MUSICALIDAD & RITMO' },
    { id: 'technique', label: 'PRECISIÓN TÉCNICA' },
    { id: 'connection', label: 'CONEXIÓN & LEAD/FOLLOW' },
    { id: 'expression', label: 'EXPRESIÓN CORPORAL' },
    { id: 'memory', label: 'RETENCIÓN DE SECUENCIAS' }
  ],
  fears: [
    { id: 'ridicule', label: 'JUICIO EXTERNO' },
    { id: 'camera', label: 'LENTE & CÁMARA' },
    { id: 'mistakes', label: 'ERROR EN EJECUCIÓN' },
    { id: 'judgment', label: 'BLOQUEO CREATIVO' },
    { id: 'not_learning', label: 'MESETA DE APRENDIZAJE' }
  ],
  recordingPreference: [
    { id: 'alone', label: 'SESIÓN INDIVIDUAL' },
    { id: 'couple', label: 'ENTRENAMIENTO EN PAREJA' },
    { id: 'shy', label: 'PERFIL BAJO (PRIVADO)' },
    { id: 'show', label: 'ENFOQUE PERFORMANCE' },
    { id: 'training_teacher', label: 'PROGRAMA DE PROFESORADO' }
  ]
};
