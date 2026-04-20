import { create } from 'zustand';
import { api } from '../services/api';
import { APP_PALETTES } from '../services/constants';

const useStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('dancingflow_user')) || JSON.parse(localStorage.getItem('bachataflow_user')) || null,
  palette: JSON.parse(localStorage.getItem('dancingflow_palette')) || APP_PALETTES.tropical,
  steps: [],
  choreos: [],
  videos: [],
  allUsers: [],
  currentChoreo: {
    id: null,
    title: 'Nueva Coreografía',
    sequence: [],
    measures: 2,
  },
  loading: false,
  error: null,
  backendStatus: 'checking', // 'ok', 'error', 'checking'
  activeSlot: -1,
  playbackMode: 'scroll',
  isPlaying: false,
  playbackIntervalId: null,

  // Auth Actions
  login: async (username, password) => {
    const user = await api.login(username, password);
    set({ user });
    localStorage.setItem('dancingflow_user', JSON.stringify(user));
    await get().fetchInitialData();
  },

  register: async (username, password, token) => {
    const user = await api.register(username, password, token);
    set({ user });
    localStorage.setItem('dancingflow_user', JSON.stringify(user));
    await get().fetchInitialData();
  },

  logout: () => {
    set({ user: null, steps: [], choreos: [], videos: [] });
    localStorage.removeItem('dancingflow_user');
    localStorage.removeItem('bachataflow_user');
    get().fetchInitialData();
  },

  setPalette: (palette) => {
    set({ palette });
    localStorage.setItem('dancingflow_palette', JSON.stringify(palette));
    document.documentElement.style.setProperty('--color-primary', palette.primary);
    document.documentElement.style.setProperty('--color-secondary', palette.secondary);
    document.documentElement.style.setProperty('--color-accent', palette.accent);
  },

  // Actions
  checkBackend: async () => {
    try {
      const res = await fetch('/backend-service/ping');
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'ok') {
          set({ backendStatus: 'ok' });
          return true;
        }
      }
      set({ backendStatus: 'error' });
      return false;
    } catch (e) {
      set({ backendStatus: 'error' });
      return false;
    }
  },

  fetchInitialData: async () => {
    set({ loading: true });
    try {
      await get().checkBackend();
      const [steps, choreos, videos] = await Promise.all([
        api.getSteps(),
        api.getChoreos(),
        api.getVideos()
      ]);
      set({
        steps: steps || [],
        choreos: choreos || [],
        videos: videos || [],
        loading: false
      });
      // Apply initial palette
      const { palette } = get();
      document.documentElement.style.setProperty('--color-primary', palette.primary);
      document.documentElement.style.setProperty('--color-secondary', palette.secondary);
      document.documentElement.style.setProperty('--color-accent', palette.accent);
    } catch (error) {
      set({
        error: error.message,
        loading: false,
        steps: [],
        choreos: []
      });
    }
  },

  // Step Actions
  addStep: async (step) => {
    const { user } = get();
    if (!user) throw new Error('Debes iniciar sesión');
    const newStep = await api.saveStep(step, user.id, user.username);
    set((state) => ({ steps: [...state.steps, newStep] }));
  },

  updateStep: async (step) => {
    const { user } = get();
    if (!user) throw new Error('Debes iniciar sesión');
    const updatedStep = await api.updateStep(step, user.id, user.username);
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

  // Admin Actions
  fetchUsers: async () => {
    const { user } = get();
    if (!user) return;
    try {
      const users = await api.getUsers(user.id);
      set({ allUsers: users || [] });
    } catch (e) { console.error(e); }
  },

  updateUserRoleOrStatus: async (userId, data) => {
    const { user } = get();
    const updatedUser = await api.updateUser(userId, data, user.id);
    set((state) => ({
      allUsers: state.allUsers.map(u => u.id === userId ? updatedUser : u)
    }));
  },

  deleteUserAccount: async (userId) => {
    const { user } = get();
    await api.deleteUser(userId, user.id);
    set((state) => ({
      allUsers: state.allUsers.filter(u => u.id !== userId)
    }));
  },

  // Video Actions
  addVideo: async (videoData) => {
    const { user } = get();
    if (!user) throw new Error('Inicia sesión');

    // Check if it's a file upload
    if (videoData.videoFile) {
      const formData = new FormData();
      formData.append('videoFile', videoData.videoFile);
      formData.append('title', videoData.title);
      formData.append('level', videoData.level);
      formData.append('userId', user.id);
      formData.append('username', user.username);

      const res = await fetch('/backend-service/videos', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Error al subir video');
      }

      const newVideo = await res.json();
      set(state => ({ videos: [...state.videos, newVideo] }));
    } else {
      const newVideo = await api.saveVideo(videoData, user.id, user.username);
      set(state => ({ videos: [...state.videos, newVideo] }));
    }
  },

  deleteVideo: async (id) => {
    const { user } = get();
    if (!user) throw new Error('Inicia sesión');
    await api.deleteVideo(id, user.id);
    set(state => ({ videos: state.videos.filter(v => v.id !== id) }));
  },

  // Choreo Actions
  saveCurrentChoreo: async (asNew = false) => {
    const { currentChoreo, user } = get();
    if (!user) throw new Error('Debes iniciar sesión para guardar');

    const choreoToSave = asNew ? { ...currentChoreo, id: null } : currentChoreo;
    const savedChoreo = await api.saveChoreo(choreoToSave, user.id, user.username);

    set((state) => ({
      choreos: [...state.choreos.filter(c => c.id !== savedChoreo.id), savedChoreo],
      currentChoreo: savedChoreo
    }));
  },

  loadChoreo: (choreo) => {
    set({ currentChoreo: choreo });
  },

  deleteChoreo: async (id) => {
    const { user } = get();
    if (!user) throw new Error('Debes iniciar sesión');
    await api.deleteChoreo(id, user.id);
    set((state) => ({
      choreos: state.choreos.filter(c => c.id !== id),
      currentChoreo: state.currentChoreo.id === id ? {
        id: null,
        title: 'Nueva Coreografía',
        sequence: [],
        measures: 2,
      } : state.currentChoreo
    }));
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
