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
  saveCurrentChoreo: async (asNew = false) => {
    const { currentChoreo } = get();
    const choreoToSave = asNew ? { ...currentChoreo, id: null } : currentChoreo;
    const savedChoreo = await api.saveChoreo(choreoToSave);
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

  removeMeasure: () => {
    set((state) => {
      const newMeasures = Math.max(1, state.currentChoreo.measures - 1);
      // Also filter sequence to remove steps that were in the removed measure
      const maxSlot = newMeasures * 8;
      const newSequence = state.currentChoreo.sequence.filter(item => item.slotIndex < maxSlot);

      return {
        currentChoreo: {
          ...state.currentChoreo,
          measures: newMeasures,
          sequence: newSequence
        }
      };
    });
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

    // VALIDATION: Strict alignment (Desborde and division lines)
    // Rule: duration 4 can only start on 0, 4 (relative to measure)
    // Rule: duration 2 can only start on 0, 2, 4, 6 (relative to measure)
    const relativeSlot = slotIndex % 8;
    if (relativeSlot % step.duration !== 0) return;

    // VALIDATION: Check if it overflows the 8-beat measure boundary
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
