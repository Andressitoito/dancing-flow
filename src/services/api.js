const STORAGE_KEYS = {
  STEPS: 'bachataflow_steps',
  CHOREOS: 'bachataflow_choreos',
};

// Initial Steps for Seeding
const INITIAL_STEPS = [
  {
    id: 'basic-1',
    name: 'Paso Básico',
    duration: 1,
    description: 'El paso fundamental de la bachata (1 tiempo)',
    color: '#e11d48',
    category: 'base'
  },
  {
    id: 'basic-2',
    name: 'Paso Lateral',
    duration: 2,
    description: 'Desplazamiento lateral de dos tiempos',
    color: '#fbbf24',
    category: 'base'
  },
  {
    id: 'madrid-step',
    name: 'Madrid Step',
    duration: 4,
    description: 'Paso avanzado típico de Bachata Sensual',
    color: '#8b5cf6',
    category: 'adorno'
  },
  {
    id: 'giro-derecha',
    name: 'Giro Derecha',
    duration: 4,
    description: 'Giro básico a la derecha en 4 tiempos',
    color: '#10b981',
    category: 'giro'
  }
];

const sleep = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

const getFromStorage = (key, defaultData) => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultData));
    return defaultData;
  }
  return JSON.parse(data);
};

const saveToStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const api = {
  // Steps API
  async getSteps() {
    await sleep();
    return getFromStorage(STORAGE_KEYS.STEPS, INITIAL_STEPS);
  },

  async saveStep(step) {
    await sleep();
    const steps = getFromStorage(STORAGE_KEYS.STEPS, INITIAL_STEPS);
    const newStep = { ...step, id: step.id || Date.now().toString() };
    steps.push(newStep);
    saveToStorage(STORAGE_KEYS.STEPS, steps);
    return newStep;
  },

  async updateStep(updatedStep) {
    await sleep();
    let steps = getFromStorage(STORAGE_KEYS.STEPS, INITIAL_STEPS);
    steps = steps.map(s => s.id === updatedStep.id ? updatedStep : s);
    saveToStorage(STORAGE_KEYS.STEPS, steps);
    return updatedStep;
  },

  async deleteStep(id) {
    await sleep();
    let steps = getFromStorage(STORAGE_KEYS.STEPS, INITIAL_STEPS);
    steps = steps.filter(s => s.id !== id);
    saveToStorage(STORAGE_KEYS.STEPS, steps);
  },

  // Choreos API
  async getChoreos() {
    await sleep();
    return getFromStorage(STORAGE_KEYS.CHOREOS, []);
  },

  async saveChoreo(choreo) {
    await sleep();
    const choreos = getFromStorage(STORAGE_KEYS.CHOREOS, []);
    const newChoreo = { ...choreo, id: choreo.id || Date.now().toString() };

    const existingIndex = choreos.findIndex(c => c.id === newChoreo.id);
    if (existingIndex > -1) {
      choreos[existingIndex] = newChoreo;
    } else {
      choreos.push(newChoreo);
    }

    saveToStorage(STORAGE_KEYS.CHOREOS, choreos);
    return newChoreo;
  },

  async deleteChoreo(id) {
    await sleep();
    let choreos = getFromStorage(STORAGE_KEYS.CHOREOS, []);
    choreos = choreos.filter(c => c.id !== id);
    saveToStorage(STORAGE_KEYS.CHOREOS, choreos);
  }
};
