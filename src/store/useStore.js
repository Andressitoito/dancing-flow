import { create } from 'zustand';
import { API_BASE_URL } from '../services/constants';
import io from 'socket.io-client';

const useStore = create((set, get) => ({
  user: null,
  users: [],
  questionnaire: null,
  assignments: [],
  onlineUsers: [],
  loading: false,
  socket: null,
  palette: {
    name: 'Clásico Dark',
    primary: '#e11d48',
    secondary: '#fbbf24',
    accent: '#10b981',
    background: '#111111',
    surface: '#1f1f1f',
    border: '#333333'
  },

  setPalette: (p) => {
    set({ palette: p });
    localStorage.setItem('dancing_palette', JSON.stringify(p));
    document.documentElement.style.setProperty('--primary', p.primary);
    document.documentElement.style.setProperty('--secondary', p.secondary);
    document.documentElement.style.setProperty('--accent', p.accent);
    document.documentElement.style.setProperty('--background', p.background);
    document.documentElement.style.setProperty('--surface', p.surface);
    document.documentElement.style.setProperty('--outline', p.border);
  },

  fetchInitialData: async () => {
    set({ loading: true });

    // Initial Palette setup
    const savedPalette = localStorage.getItem('dancing_palette');
    if (savedPalette) {
      get().setPalette(JSON.parse(savedPalette));
    } else {
      get().setPalette(get().palette);
    }

    // Restore Session
    const savedUser = localStorage.getItem('dancing_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      set({ user, questionnaire: user.Questionnaire });
      get().initSocket(user.id);
    }

    try {
      const usersRes = await fetch(`${API_BASE_URL}/users/all`);
      const users = await usersRes.json();
      set({ users });
    } catch (e) {
      console.error(e);
    } finally {
      set({ loading: false });
    }
  },

  login: async (username, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        set({ user: data, questionnaire: data.Questionnaire });
        localStorage.setItem('dancing_user', JSON.stringify(data));
        get().initSocket(data.id);
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (e) {
      return { success: false, error: 'Error de conexión' };
    }
  },

  signup: async (formData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/signup-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        set({ user: data });
        localStorage.setItem('dancing_user', JSON.stringify(data));
        get().initSocket(data.id);
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (e) {
      return { success: false, error: 'Error de conexión' };
    }
  },

  logout: () => {
    const { socket } = get();
    if (socket) socket.disconnect();
    localStorage.removeItem('dancing_user');
    set({ user: null, questionnaire: null, socket: null });
  },

  initSocket: (userId) => {
    const socket = io(window.location.origin);
    socket.emit('authenticate', userId);
    socket.on('online_users', (list) => set({ onlineUsers: list }));

    // Listen for new messages to update state in real-time
    socket.on('new_message', (reply) => {
      const { assignments } = get();
      const updated = assignments.map(a => {
        if (a.id === reply.assignmentId) {
          // Check if reply already exists to avoid duplicates
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
    const { user } = get();
    const res = await fetch(`${API_BASE_URL}/users/me/questionnaire`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, userId: user.id })
    });
    const updated = await res.json();
    set({ questionnaire: updated });
  },

  fetchAssignments: async () => {
    const { user } = get();
    const res = await fetch(`${API_BASE_URL}/study/my-assignments?userId=${user.id}`);
    const data = await res.json();
    set({ assignments: data });
  },

  postReply: async (assignmentId, content, audioFile = null) => {
    const { user, socket } = get();
    const formData = new FormData();
    formData.append('assignmentId', assignmentId);
    formData.append('userId', user.id);
    formData.append('content', content);
    if (audioFile) formData.append('audio', audioFile);

    const res = await fetch(`${API_BASE_URL}/study/replies`, {
      method: 'POST',
      body: formData
    });
    const newReply = await res.json();

    // Emit via socket for real-time
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
  }
}));

export default useStore;
