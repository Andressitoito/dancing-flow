// Relative path works both for Production (monolith) and Dev (Vite Proxy)
const API_BASE = '/api';

export const api = {
  // Auth
  async login(username, password) {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Error al iniciar sesión');
    }
    return res.json();
  },

  async register(username, password, token) {
    const res = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, token })
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Error al registrarse');
    }
    return res.json();
  },

  // Steps API
  async getSteps(userId) {
    const res = await fetch(`${API_BASE}/steps?userId=${userId || ''}`);
    return res.json();
  },

  async saveStep(step, userId) {
    const res = await fetch(`${API_BASE}/steps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ step, userId })
    });
    return res.json();
  },

  async updateStep(step, userId) {
    const res = await fetch(`${API_BASE}/steps`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ step, userId })
    });
    return res.json();
  },

  async deleteStep(id, userId) {
    await fetch(`${API_BASE}/steps/${id}?userId=${userId}`, {
      method: 'DELETE'
    });
  },

  // Choreos API
  async getChoreos(userId) {
    const res = await fetch(`${API_BASE}/choreos?userId=${userId || ''}`);
    return res.json();
  },

  async saveChoreo(choreo, userId) {
    const res = await fetch(`${API_BASE}/choreos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ choreo, userId })
    });
    return res.json();
  }
};
