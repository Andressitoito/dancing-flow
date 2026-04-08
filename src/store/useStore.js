import { create } from 'zustand';
import { api } from '../services/api';

const useStore = create((set, get) => ({
  steps: [],
  choreos: [],
  currentChoreo: {
    id: null,
    title: 'Nueva Coreografía',
    sequence: [], // { stepId: string, slotIndex: number }
    measures: 2, // Default 2 measures of 8 beats each
  },
  loading: false,
  error: null,
  activeSlot: -1, // For Playback mode
  playbackMode: 'scroll', // 'scroll' or 'centered'
  isPlaying: false,

  // Actions
  fetchInitialData: async () => {
    set({ loading: true });
    try {
      const [steps, choreos] = await Promise.all([
        api.getSteps(),
        api.getChoreos()
      ]);
      set({ steps, choreos, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Step Actions
  addStep: async (step) => {
    const newStep = await api.saveStep(step);
    set((state) => ({ steps: [...state.steps, newStep] }));
  },

  updateStep: async (step) => {
    const updatedStep = await api.updateStep(step);
    set((state) => ({
      steps: state.steps.map((s) => (s.id === updatedStep.id ? updatedStep : s))
    }));
  },

  deleteStep: async (id) => {
    await api.deleteStep(id);
    set((state) => ({
      steps: state.steps.filter((s) => s.id !== id)
    }));
  },

  // Choreo Actions
  saveCurrentChoreo: async () => {
    const { currentChoreo } = get();
    const savedChoreo = await api.saveChoreo(currentChoreo);
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

  setActiveSlot: (slot) => set({ activeSlot: slot }),
  setPlaybackMode: (mode) => set({ playbackMode: mode }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),

  addStepToChoreo: (stepId, slotIndex) => {
    const { currentChoreo, steps } = get();
    const step = steps.find(s => s.id === stepId);
    if (!step) return;

    // VALIDATION: Prevent measure/timeline overflow ("desborde")
    const totalSlots = currentChoreo.measures * 8;
    if (slotIndex + step.duration > totalSlots) return;

    // VALIDATION: Check if it overflows the 8-beat measure boundary IF required (e.g. 4-beat step can't start at 7)
    const measureStart = Math.floor(slotIndex / 8) * 8;
    const measureEnd = measureStart + 8;
    if (slotIndex + step.duration > measureEnd) return;

    // Check for occupancy conflicts
    const newSequence = currentChoreo.sequence.filter(item => {
      const itemStep = steps.find(s => s.id === item.stepId);
      if (!itemStep) return false;
      // Remove any step that occupies the same slotIndex
      // Or if the new step overlaps with existing one
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
