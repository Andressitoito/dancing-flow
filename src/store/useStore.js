import { create } from 'zustand';
import { api } from '../services/api';
import { APP_PALETTES } from '../services/constants';

const useStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('dancingflow_user')) || JSON.parse(localStorage.getItem('bachataflow_user')) || null,
  palette: JSON.parse(localStorage.getItem('dancingflow_palette')) || APP_PALETTES.tropical,
  choreos: [],
  videos: [],
  allUsers: [],
  currentChoreo: {
    id: null,
    title: 'Nueva Coreografía',
    difficulty: 'principiante',
    color: '#3b82f6',
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
  paintingDuration: null, // null, 1, 2, 4
  isMetronomeEnabled: false,

  // Auth Actions
  login: async (username, password) => {
    const user = await api.login(username, password);
    set({ user });
    localStorage.setItem('dancingflow_user', JSON.stringify(user));
    await get().fetchInitialData();
  },

  register: async (username, password, token, firstName, lastName) => {
    const user = await api.register(username, password, token, firstName, lastName);
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
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '26, 26, 26';
    };
    document.documentElement.style.setProperty('--df-primary', palette.primary);
    document.documentElement.style.setProperty('--df-secondary', palette.secondary);
    document.documentElement.style.setProperty('--df-accent', palette.accent);
    document.documentElement.style.setProperty('--df-bg', palette.background || '#1a1a1a');
    document.documentElement.style.setProperty('--df-surface', palette.surface || '#1a1a1a');
    document.documentElement.style.setProperty('--df-surface-glass', `rgba(${hexToRgb(palette.surface || '#1a1a1a')}, 0.6)`);
    document.documentElement.style.setProperty('--df-border', 'rgba(255, 255, 255, 0.1)');
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
      const [choreos, videos] = await Promise.all([
        api.getChoreos(),
        api.getVideos()
      ]);
      set({
        choreos: choreos || [],
        videos: videos || [],
        loading: false
      });
      // Apply initial palette
      const { palette, setPalette } = get();
      setPalette(palette);
    } catch (error) {
      set({
        error: error.message,
        loading: false,
        steps: [],
        choreos: []
      });
    }
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
      formData.append('subtitle', videoData.subtitle || '');
      formData.append('level', videoData.level);
      formData.append('userId', user.id);
      formData.append('creatorName', user.username);

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

  likeVideo: async (id) => {
    const { user } = get();
    if (!user) return;
    const updated = await api.likeVideo(id, user.id);
    set(state => ({ videos: state.videos.map(v => v.id === id ? updated : v) }));
  },

  favoriteVideo: async (id) => {
    const { user } = get();
    if (!user) return;
    const updated = await api.favoriteVideo(id, user.id);
    set(state => ({ videos: state.videos.map(v => v.id === id ? updated : v) }));
  },

  // Choreo Actions
  saveCurrentChoreo: async (asNew = false) => {
    const { currentChoreo, user } = get();
    if (!user) throw new Error('Debes iniciar sesión para guardar');

    const choreoToSave = asNew ? { ...currentChoreo, id: null, userId: user.id, creatorName: user.username } : currentChoreo;
    const savedChoreo = await api.saveChoreo(choreoToSave, user.id, user.username);

    set((state) => ({
      choreos: [...state.choreos.filter(c => c.id !== savedChoreo.id), savedChoreo],
      currentChoreo: savedChoreo
    }));
  },

  copyChoreo: async (choreo) => {
    const { user } = get();
    if (!user) throw new Error('Inicia sesión para copiar');

    const newChoreo = {
      ...choreo,
      id: null,
      title: `${choreo.title} (Copia)`,
      userId: user.id,
      creatorName: user.username,
      isPublic: false
    };

    const saved = await api.saveChoreo(newChoreo, user.id, user.username);
    set(state => ({
      choreos: [...state.choreos, saved],
      currentChoreo: saved
    }));
    return saved;
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

  likeChoreo: async (id) => {
    const { user } = get();
    if (!user) return;
    const updated = await api.likeChoreo(id, user.id);
    set(state => ({
      choreos: state.choreos.map(c => c.id === id ? updated : c),
      currentChoreo: state.currentChoreo.id === id ? updated : state.currentChoreo
    }));
  },

  favoriteChoreo: async (id) => {
    const { user } = get();
    if (!user) return;
    const updated = await api.favoriteChoreo(id, user.id);
    set(state => ({
      choreos: state.choreos.map(c => c.id === id ? updated : c),
      currentChoreo: state.currentChoreo.id === id ? updated : state.currentChoreo
    }));
  },

  resetChoreo: () => {
    set({
      currentChoreo: {
        id: null,
        title: 'Nueva Coreografía',
        difficulty: 'principiante',
        color: '#3b82f6',
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

  updateChoreoDifficulty: (difficulty) => {
    const colors = {
      'principiante': '#3b82f6',
      'intermedio': '#fbbf24',
      'avanzado': '#e11d48'
    };
    set((state) => ({
      currentChoreo: {
        ...state.currentChoreo,
        difficulty,
        color: colors[difficulty] || '#3b82f6'
      }
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
  setPaintingDuration: (duration) => set({ paintingDuration: duration }),
  setMetronomeEnabled: (enabled) => set({ isMetronomeEnabled: enabled }),

  startPlayback: (bpm) => {
    const { playbackIntervalId } = get();
    if (playbackIntervalId) clearInterval(playbackIntervalId);

    if (get().activeSlot === -1) {
      set({ activeSlot: 0 });
    }

    // Prepare metronome sound
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    const playTick = (freq) => {
      if (!get().isMetronomeEnabled) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    };

    const intervalId = setInterval(() => {
      set((state) => {
        const totalSlots = state.currentChoreo.measures * 8;
        if (totalSlots === 0) return { activeSlot: -1 };
        const nextSlot = (state.activeSlot + 1) % totalSlots;

        // Metronome sound logic
        const beatInMeasure = (nextSlot % 8) + 1;
        if (beatInMeasure === 1) {
          playTick(880); // Higher pitch for beat 1
        } else {
          playTick(440); // Standard pitch
        }

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

  addBlockToChoreo: (blockData, slotIndex) => {
    const { currentChoreo } = get();
    const duration = blockData.duration || 1;
    const totalSlots = currentChoreo.measures * 8;

    // Check overflow
    if (slotIndex + duration > totalSlots) return;

    // Check measure overflow (blocks can't cross 4-beat boundaries: 1-4 and 5-8)
    const halfMeasureStart = Math.floor(slotIndex / 4) * 4;
    const halfMeasureEnd = halfMeasureStart + 4;
    if (slotIndex + duration > halfMeasureEnd) return;

    // Remove overlapping blocks
    const newSequence = currentChoreo.sequence.filter(item => {
      const itemEnd = item.slotIndex + item.duration;
      const newEnd = slotIndex + duration;
      return !(slotIndex < itemEnd && newEnd > item.slotIndex);
    });

    const newBlock = {
      id: Math.random().toString(36).substr(2, 9),
      name: blockData.name || 'Paso',
      duration: duration,
      color: blockData.color || '#e11d48', // Default Bachata Rose
      description: blockData.description || '',
      leadInstructions: blockData.leadInstructions || '',
      followerInstructions: blockData.followerInstructions || '',
      slotIndex
    };

    set({
      currentChoreo: {
        ...currentChoreo,
        sequence: [...newSequence, newBlock]
      }
    });
  },

  updateBlockInChoreo: (slotIndex, data) => {
    set((state) => ({
      currentChoreo: {
        ...state.currentChoreo,
        sequence: state.currentChoreo.sequence.map(item =>
          item.slotIndex === slotIndex ? { ...item, ...data } : item
        )
      }
    }));
  },

  removeBlockFromChoreo: (slotIndex) => {
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
