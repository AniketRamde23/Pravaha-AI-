import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Attach Bearer token from localStorage to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('smartroad_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authApi = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },

  registerDriver: async (driverData) => {
    const res = await api.post('/auth/register/driver', driverData);
    return res.data;
  },

  registerProvider: async (providerData) => {
    const res = await api.post('/auth/register/provider', providerData);
    return res.data;
  },

  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
};

export const driverApi = {
  diagnoseBreakdown: async (data) => {
    const res = await api.post('/driver/breakdown/diagnose', data);
    return res.data;
  },

  findNearbyProviders: async (query) => {
    const res = await api.post('/driver/providers/nearby', query);
    return res.data;
  },

  createRequest: async (requestData) => {
    const res = await api.post('/driver/requests', requestData);
    return res.data;
  },

  getActiveRequest: async () => {
    const res = await api.get('/driver/requests/active');
    return res.status === 204 ? null : res.data;
  },

  getHistory: async () => {
    const res = await api.get('/driver/requests/history');
    return res.data;
  },

  cancelRequest: async (requestId, reason) => {
    const res = await api.patch(`/driver/requests/${requestId}/cancel`, { reason });
    return res.data;
  },

  rateRequest: async (requestId, rating, review) => {
    const res = await api.post(`/driver/requests/${requestId}/rate`, { rating, review });
    return res.data;
  },

  addVehicle: async (vehicleData) => {
    const res = await api.post('/driver/vehicle', vehicleData);
    return res.data;
  },
};

export const providerApi = {
  getIncomingRequests: async () => {
    const res = await api.get('/provider/requests/incoming');
    return res.data;
  },

  getActiveJob: async () => {
    const res = await api.get('/provider/requests/active');
    return res.status === 204 ? null : res.data;
  },

  updateStatus: async (requestId, status, note) => {
    const res = await api.patch(`/provider/requests/${requestId}/status`, { status, note });
    return res.data;
  },

  toggleAvailability: async (available) => {
    const res = await api.patch('/provider/availability', { available });
    return res.data;
  },
};
