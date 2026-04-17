import { create } from 'zustand';
import { api } from '../services/api';

const useStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('bachataflow_user')) || null,
  steps: [],
  choreos: [],
  currentChoreo: {
    id: null,
    title: 'Nueva Coreografía',
    sequence: [],
    measures: 2,
  },
  loading: false,
  error: null,
  activeSlot: -1,
  playbackMode: 'scroll',
  isPlaying: false,
  playbackIntervalId: null,

  // Auth Actions
  login: async (username, password) => {
    const user = await api.login(username, password);
    set({ user });
    localStorage.setItem('bachataflow_user', JSON.stringify(user));
    await get().fetchInitialData();
  },

  register: async (username, password, token) => {
    const user = await api.register(username, password, token);
    set({ user });
    localStorage.setItem('bachataflow_user', JSON.stringify(user));
    await get().fetchInitialData();
  },

  logout: () => {
    set({ user: null, steps: [], choreos: [] });
    localStorage.removeItem('bachataflow_user');
    get().fetchInitialData();
  },

  // Actions
  fetchInitialData: async () => {
    set({ loading: true });
    try {
      const { user } = get();
      const [steps, choreos] = await Promise.all([
        api.getSteps(user?.id),
        api.getChoreos(user?.id)
      ]);
      set({ steps, choreos, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Step Actions
  addStep: async (step) => {
    const { user } = get();
    if (!user) throw new Error('Debes iniciar sesión');
    const newStep = await api.saveStep(step, user.id);
    set((state) => ({ steps: [...state.steps, newStep] }));
  },

  updateStep: async (step) => {
    const { user } = get();
    if (!user) throw new Error('Debes iniciar sesión');
    const updatedStep = await api.updateStep(step, user.id);
    set((state) => ({
      steps: state.steps.map((s) => (s.id === updatedStep.id ? updatedStep : s))
    }));
  },

  deleteStep: async (id) => {
    const { user } = get();
    if (!user) throw new Error('Debes iniciar sesión');
    await api.deleteStep(id, user.id);
    set((state) => ({
      steps: state.steps.filter((s) => s.id !== id)
    }));
  },

  // Choreo Actions
  saveCurrentChoreo: async (asNew = false) => {
    const { currentChoreo, user } = get();
    if (!user) throw new Error('Debes iniciar sesión para guardar');

    const choreoToSave = asNew ? { ...currentChoreo, id: null } : currentChoreo;
    const savedChoreo = await api.saveChoreo(choreoToSave, user.id);

    set((state) => ({
      choreos: [...state.choreos.filter(c => c.id !== savedChoreo.id), savedChoreo],
      currentChoreo: savedChoreo
    }));
  },

  loadChoreo: (choreo) => {
    set({ currentChoreo: choreo });
  },

  resetChoreo: () => {
    set({
      currentChoreo: {
        id: null,
        title: 'Nueva Coreografía',
        sequence: [],
        measures: 2,
      }
    });
  },

  updateChoreoTitle: (title) => {
    set((state) => ({
      currentChoreo: { ...state.currentChoreo, title }
    }));
  },

  addMeasure: () => {
    set((state) => ({
      currentChoreo: {
        ...state.currentChoreo,
        measures: state.currentChoreo.measures + 1
      }
    }));
  },

  removeMeasure: (measureIndex) => {
    set((state) => {
      const { currentChoreo } = state;
      const newMeasures = Math.max(1, currentChoreo.measures - 1);

      const startSlot = measureIndex * 8;
      const endSlot = startSlot + 8;

      const newSequence = currentChoreo.sequence
        .filter(item => item.slotIndex < startSlot || item.slotIndex >= endSlot)
        .map(item => {
           if (item.slotIndex >= endSlot) {
             return { ...item, slotIndex: item.slotIndex - 8 };
           }
           return item;
        });

      return {
        currentChoreo: {
          ...currentChoreo,
          measures: newMeasures,
          sequence: newSequence
        }
      };
    });
  },

  setActiveSlot: (slot) => set((state) => ({
    activeSlot: typeof slot === 'function' ? slot(state.activeSlot) : slot
  })),
  setPlaybackMode: (mode) => set({ playbackMode: mode }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),

  startPlayback: (bpm) => {
    const { playbackIntervalId } = get();
    if (playbackIntervalId) clearInterval(playbackIntervalId);

    if (get().activeSlot === -1) {
      set({ activeSlot: 0 });
    }

    const intervalId = setInterval(() => {
      set((state) => {
        const totalSlots = state.currentChoreo.measures * 8;
        if (totalSlots === 0) return { activeSlot: -1 };
        const nextSlot = (state.activeSlot + 1) % totalSlots;
        return { activeSlot: nextSlot };
      });
    }, (60 / Math.max(bpm, 1)) * 1000);

    set({ isPlaying: true, playbackIntervalId: intervalId });
  },

  stopPlayback: () => {
    const { playbackIntervalId } = get();
    if (playbackIntervalId) clearInterval(playbackIntervalId);
    set({ isPlaying: false, activeSlot: -1, playbackIntervalId: null });
  },

  pausePlayback: () => {
    const { playbackIntervalId } = get();
    if (playbackIntervalId) clearInterval(playbackIntervalId);
    set({ isPlaying: false, playbackIntervalId: null });
  },

  addStepToChoreo: (stepId, slotIndex) => {
    const { currentChoreo, steps } = get();
    const step = steps.find(s => s.id === stepId);
    if (!step) return;

    const totalSlots = currentChoreo.measures * 8;
    if (slotIndex + step.duration > totalSlots) return;

    const relativeSlot = slotIndex % 8;
    if (relativeSlot % step.duration !== 0) return;

    const measureStart = Math.floor(slotIndex / 8) * 8;
    const measureEnd = measureStart + 8;
    if (slotIndex + step.duration > measureEnd) return;

    const newSequence = currentChoreo.sequence.filter(item => {
      const itemStep = steps.find(s => s.id === item.stepId);
      if (!itemStep) return false;
      const itemEnd = item.slotIndex + itemStep.duration;
      const newEnd = slotIndex + step.duration;
      return !(slotIndex < itemEnd && newEnd > item.slotIndex);
    });

    set({
      currentChoreo: {
        ...currentChoreo,
        sequence: [...newSequence, { stepId, slotIndex }]
      }
    });
  },

  removeStepFromChoreo: (slotIndex) => {
    const { currentChoreo } = get();
    set({
      currentChoreo: {
        ...currentChoreo,
        sequence: currentChoreo.sequence.filter(item => item.slotIndex !== slotIndex)
      }
    });
  }
}));

export default useStore;
