// Relative path works both for Production (monolith) and Dev (Vite Proxy)
const API_BASE = '/backend-service';

const handleResponse = async (res) => {
  const contentType = res.headers.get('content-type');
  if (!res.ok) {
    console.error(`API Error ${res.status}:`, {
      url: res.url,
      method: res.method,
      contentType
    });

    if (contentType && contentType.includes('application/json')) {
      const error = await res.json();
      throw new Error(error.error || 'Error del servidor');
    }

    // Attempt to read body text for debugging
    const text = await res.text().catch(() => 'No body');
    console.error('API Error Body Snippet:', text.substring(0, 200));

    throw new Error(`Error ${res.status}: El servidor devolvió un formato inesperado (${contentType}).`);
  }

  if (contentType && contentType.includes('application/json')) {
    return res.json();
  }
  return null;
};

export const api = {
  // Auth
  async login(username, password) {
    const res = await fetch(`${API_BASE}/login-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return handleResponse(res);
  },

  async register(username, password, token) {
    const res = await fetch(`${API_BASE}/signup-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, token })
    });
    return handleResponse(res);
  },

  // Steps API
  async getSteps() {
    const res = await fetch(`${API_BASE}/steps`);
    return handleResponse(res);
  },

  async saveStep(step, userId, username) {
    const res = await fetch(`${API_BASE}/steps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ step, userId, username })
    });
    return handleResponse(res);
  },

  async updateStep(step, userId, username) {
    const res = await fetch(`${API_BASE}/steps`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ step, userId, username })
    });
    return handleResponse(res);
  },

  async deleteStep(id, userId) {
    const res = await fetch(`${API_BASE}/steps/${id}?userId=${userId}`, {
      method: 'DELETE'
    });
    return handleResponse(res);
  },

  // Choreos API
  async getChoreos() {
    const res = await fetch(`${API_BASE}/choreos`);
    return handleResponse(res);
  },

  async saveChoreo(choreo, userId, username) {
    const res = await fetch(`${API_BASE}/choreos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ choreo, userId, username })
    });
    return handleResponse(res);
  }
};
