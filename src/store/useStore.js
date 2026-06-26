import { create } from 'zustand';
import io from 'socket.io-client';
import { api } from '../services/api';
import { APP_PALETTES } from '../services/constants';

const STORAGE_KEY = 'dancing_user';

const useStore = create((set, get) => ({
  user: null,
  users: [],
  questionnaire: null,
  assignments: [],
  onlineUsers: [],
  loading: false,
  isInitialLoad: true,
  socket: null,
  palette: APP_PALETTES.premium,

  setPalette: (p) => {
    // We lock to premium for now as per requirements
    const palette = APP_PALETTES.premium;
    set({ palette });

    document.documentElement.style.setProperty('--df-primary', palette.primary);
    document.documentElement.style.setProperty('--df-secondary', palette.secondary);
    document.documentElement.style.setProperty('--df-accent', palette.accent);
    document.documentElement.style.setProperty('--df-bg', palette.background);
    document.documentElement.style.setProperty('--df-surface', palette.surface);
    document.documentElement.style.setProperty('--df-border', palette.border);
  },

  fetchInitialData: async () => {
    const { isInitialLoad, user } = get();
    if (isInitialLoad) set({ loading: true });

    // Force Premium Palette
    get().setPalette(APP_PALETTES.premium);

    // Restore Session
    const savedUser = localStorage.getItem(STORAGE_KEY);
    let currentUser = user;
    if (savedUser && !currentUser) {
      currentUser = JSON.parse(savedUser);
      set({ user: currentUser, questionnaire: currentUser.Questionnaire });
      get().initSocket(currentUser.id);
    }

    if (!currentUser) {
      set({ loading: false });
      return;
    }

    try {
      if (currentUser.role === 'profesor') {
        const users = await api.getUsers();
        if (Array.isArray(users)) {
          set({ users });
        } else {
          if (users?.error === 'Unauthorized' || users?.error === 'No autenticado') {
            get().logout();
          }
        }
      }

      set({ isInitialLoad: false });
    } catch (e) {
      console.error('Error fetching initial data:', e);
    } finally {
      set({ loading: false });
    }
  },

  login: async (username, password) => {
    try {
      const data = await api.login(username, password);
      set({ user: data, questionnaire: data.Questionnaire });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      get().initSocket(data.id);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  signup: async (formData) => {
    try {
      const data = await api.register(
        formData.username,
        formData.password,
        formData.token,
        formData.gender,
        formData.level
      );
      set({ user: data, questionnaire: data.Questionnaire });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      get().initSocket(data.id);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  logout: () => {
    const { socket } = get();
    if (socket) socket.disconnect();
    localStorage.removeItem(STORAGE_KEY);
    set({ user: null, questionnaire: null, socket: null, users: [], assignments: [] });
  },

  initSocket: (userId) => {
    const socket = io(window.location.origin);
    socket.emit('authenticate', userId);
    socket.on('online_users', (list) => set({ onlineUsers: list }));

    socket.on('new_message', (reply) => {
      const { assignments } = get();
      const updated = assignments.map(a => {
        if (a.id === reply.assignmentId) {
          if (a.Replies?.some(r => r.id === reply.id)) return a;
          return { ...a, Replies: [...(a.Replies || []), reply] };
        }
        return a;
      });
      set({ assignments: updated });
    });

    set({ socket });
  },

  updateQuestionnaire: async (data) => {
    try {
      const updated = await api.saveQuestionnaire(data);
      set({ questionnaire: updated });

      const { user } = get();
      if (user) {
        const newUser = { ...user, Questionnaire: updated };
        set({ user: newUser });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      }
    } catch (e) {
      console.error('Error updating questionnaire:', e);
    }
  },

  fetchAssignments: async () => {
    const { user, socket } = get();
    if (!user) return;
    try {
      const data = await api.getMyAssignments();
      if (Array.isArray(data)) {
        set({ assignments: data });
        if (socket) {
          data.forEach(asgn => {
            socket.emit('join_assignment', asgn.id);
          });
        }
      } else {
        set({ assignments: [] });
      }
    } catch (e) {
      console.error('Error fetching assignments:', e);
      set({ assignments: [] });
    }
  },

  postReply: async (assignmentId, content, audioFile = null, videoFile = null) => {
    const { user, socket } = get();
    const formData = new FormData();
    formData.append('assignmentId', assignmentId);
    formData.append('content', content);
    if (audioFile) formData.append('audio', audioFile);
    if (videoFile) formData.append('video', videoFile);

    try {
      const newReply = await api.postReply(formData);

      if (socket) {
        socket.emit('send_message', { ...newReply, User: { username: user.username, role: user.role } });
      }

      const { assignments } = get();
      const updated = assignments.map(a => {
        if (a.id === assignmentId) {
          return { ...a, Replies: [...(a.Replies || []), { ...newReply, User: user }] };
        }
        return a;
      });
      set({ assignments: updated });
    } catch (e) {
      console.error('Error posting reply:', e);
    }
  }
}));

export default useStore;
