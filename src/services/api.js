const BASE_URL = '/backend-service';

export const api = {
  // Auth
  login: async (username, password) => {
    const res = await fetch(`${BASE_URL}/login-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },

  register: async (username, password, token, firstName, lastName) => {
    const res = await fetch(`${BASE_URL}/signup-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, token, firstName, lastName })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },

  getUsers: async (adminId) => {
    const res = await fetch(`${BASE_URL}/admin/users?adminId=${adminId}`);
    return res.json();
  },

  updateUser: async (userId, data, adminId) => {
    const res = await fetch(`${BASE_URL}/admin/users/${userId}?adminId=${adminId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  deleteUser: async (userId, adminId) => {
    const res = await fetch(`${BASE_URL}/admin/users/${userId}?adminId=${adminId}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Steps
  getSteps: async () => {
    const res = await fetch(`${BASE_URL}/steps`);
    return res.json();
  },

  saveStep: async (step, userId, creatorName) => {
    const res = await fetch(`${BASE_URL}/steps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...step, userId, creatorName })
    });
    return res.json();
  },

  updateStep: async (step, userId, creatorName) => {
    const res = await fetch(`${BASE_URL}/steps/${step.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...step, userId, creatorName })
    });
    return res.json();
  },

  deleteStep: async (id, userId) => {
    const res = await fetch(`${BASE_URL}/steps/${id}?userId=${userId}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Choreos
  getChoreos: async () => {
    const res = await fetch(`${BASE_URL}/choreos`);
    return res.json();
  },

  saveChoreo: async (choreo, userId, creatorName) => {
    const res = await fetch(`${BASE_URL}/choreos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...choreo, userId, creatorName })
    });
    return res.json();
  },

  deleteChoreo: async (id, userId) => {
    const res = await fetch(`${BASE_URL}/choreos/${id}?userId=${userId}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  likeChoreo: async (id, userId) => {
    const res = await fetch(`${BASE_URL}/choreos/${id}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return res.json();
  },

  favoriteChoreo: async (id, userId) => {
    const res = await fetch(`${BASE_URL}/choreos/${id}/favorite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return res.json();
  },

  // Videos
  getVideos: async () => {
    const res = await fetch(`${BASE_URL}/videos`);
    return res.json();
  },

  saveVideo: async (video, userId, creatorName) => {
    const res = await fetch(`${BASE_URL}/videos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...video, userId, creatorName })
    });
    return res.json();
  },

  deleteVideo: async (id, userId) => {
    const res = await fetch(`${BASE_URL}/videos/${id}?userId=${userId}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  likeVideo: async (id, userId) => {
    const res = await fetch(`${BASE_URL}/videos/${id}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return res.json();
  },

  favoriteVideo: async (id, userId) => {
    const res = await fetch(`${BASE_URL}/videos/${id}/favorite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return res.json();
  }
};
