const BASE_URL = '/backend-service';

// Helper for authenticated requests
const authFetch = async (url, options = {}) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const headers = {
    ...options.headers,
    'x-user-id': user?.id || '',
  };

  const res = await fetch(url, { ...options, headers });
  if (res.status === 401 || res.status === 403) {
    // Optional: handle session expiry/unauthorized globally
    // localStorage.removeItem('user');
    // window.location.href = '/login';
  }
  return res;
};

export const api = {
  // Auth
  login: async (username, password) => {
    const res = await fetch(`${BASE_URL}/auth/login-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },

  register: async (username, password, token, gender, level) => {
    const res = await fetch(`${BASE_URL}/auth/signup-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, token, gender, level })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },

  changeRole: async (userId, newRole, token) => {
    const res = await fetch(`${BASE_URL}/auth/change-role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, newRole, token })
    });
    return res.json();
  },

  // Users & Admin
  getUsers: async () => {
    const res = await authFetch(`${BASE_URL}/users/all`);
    return res.json();
  },

  updateUser: async (userId, data) => {
    const res = await authFetch(`${BASE_URL}/admin/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  deleteUser: async (userId) => {
    const res = await authFetch(`${BASE_URL}/admin/users/${userId}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Questionnaires
  getQuestionnaire: async () => {
    const res = await authFetch(`${BASE_URL}/users/me/questionnaire`);
    return res.json();
  },

  saveQuestionnaire: async (data) => {
    const res = await authFetch(`${BASE_URL}/users/me/questionnaire`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Mentorship / Study Blocks
  getBlocks: async () => {
    const res = await authFetch(`${BASE_URL}/study/blocks`);
    return res.json();
  },

  createBlock: async (formData) => {
    const res = await authFetch(`${BASE_URL}/study/blocks`, {
      method: 'POST',
      body: formData // Form data handles multipart/form-data
    });
    return res.json();
  },

  assignBlock: async (studyBlockId, userIds) => {
    const res = await authFetch(`${BASE_URL}/study/assignments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studyBlockId, userIds })
    });
    return res.json();
  },

  getMyAssignments: async () => {
    const res = await authFetch(`${BASE_URL}/study/my-assignments`);
    return res.json();
  },

  postReply: async (formData) => {
    const res = await authFetch(`${BASE_URL}/study/replies`, {
      method: 'POST',
      body: formData
    });
    return res.json();
  }
};
