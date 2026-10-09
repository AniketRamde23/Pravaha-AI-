import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const STORAGE_KEY_TOKEN = '@pravaha_token';
const STORAGE_KEY_BASE_URL = '@pravaha_base_url';

// Smart default: 192.168.0.4 for real Android phone & Expo Go, 10.0.2.2 for Android emulator, localhost for iOS simulator/web
export const DEFAULT_BASE_URL = Platform.select({
  android: 'http://192.168.0.4:8080/api', // default to host machine LAN for real phones & expo go
  ios: 'http://localhost:8080/api',
  default: 'http://localhost:8080/api',
});

export const PRESET_URLS = [
  { label: 'Current Wi-Fi LAN (192.168.0.4)', url: 'http://192.168.0.4:8080/api' },
  { label: 'Android Emulator (10.0.2.2)', url: 'http://10.0.2.2:8080/api' },
  { label: 'Localhost (Simulator/Web)', url: 'http://localhost:8080/api' },
];

export const apiClient = axios.create({
  baseURL: DEFAULT_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Initialize base URL from AsyncStorage
export const initApiConfig = async () => {
  try {
    const savedUrl = await AsyncStorage.getItem(STORAGE_KEY_BASE_URL);
    if (savedUrl) {
      apiClient.defaults.baseURL = savedUrl;
      return savedUrl;
    }
  } catch (e) {
    console.warn('Failed to load saved base URL', e);
  }
  return DEFAULT_BASE_URL;
};

// Set custom Base URL
export const setCustomBaseUrl = async (url) => {
  let cleaned = url.trim();
  if (!cleaned.endsWith('/api')) {
    cleaned = cleaned.replace(/\/+$/, '') + '/api';
  }
  apiClient.defaults.baseURL = cleaned;
  await AsyncStorage.setItem(STORAGE_KEY_BASE_URL, cleaned);
  return cleaned;
};

// Interceptor to inject stored JWT token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEY_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // ignore
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Token helpers
export const saveAuthToken = async (token) => {
  if (token) {
    await AsyncStorage.setItem(STORAGE_KEY_TOKEN, token);
  } else {
    await AsyncStorage.removeItem(STORAGE_KEY_TOKEN);
  }
};

export const getStoredToken = async () => {
  return AsyncStorage.getItem(STORAGE_KEY_TOKEN);
};

// API Services
export const authApi = {
  login: async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    return res.data;
  },

  registerDriver: async (driverData) => {
    const res = await apiClient.post('/auth/register/driver', driverData);
    return res.data;
  },

  registerProvider: async (providerData) => {
    const res = await apiClient.post('/auth/register/provider', providerData);
    return res.data;
  },

  getMe: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },
};

export const driverApi = {
  diagnoseBreakdown: async (data) => {
    const res = await apiClient.post('/driver/breakdown/diagnose', data);
    return res.data;
  },

  findNearbyProviders: async (query) => {
    const res = await apiClient.post('/driver/providers/nearby', query);
    return res.data;
  },

  createRequest: async (requestData) => {
    const res = await apiClient.post('/driver/requests', requestData);
    return res.data;
  },

  getActiveRequest: async () => {
    const res = await apiClient.get('/driver/requests/active');
    return res.status === 204 ? null : res.data;
  },

  getHistory: async () => {
    const res = await apiClient.get('/driver/requests/history');
    return res.data;
  },

  cancelRequest: async (requestId, reason) => {
    const res = await apiClient.patch(`/driver/requests/${requestId}/cancel`, { reason });
    return res.data;
  },

  rateRequest: async (requestId, rating, review) => {
    const res = await apiClient.post(`/driver/requests/${requestId}/rate`, { rating, review });
    return res.data;
  },

  addVehicle: async (vehicleData) => {
    const res = await apiClient.post('/driver/vehicle', vehicleData);
    return res.data;
  },
};

export const providerApi = {
  getIncomingRequests: async () => {
    const res = await apiClient.get('/provider/requests/incoming');
    return res.data;
  },

  getActiveJob: async () => {
    const res = await apiClient.get('/provider/requests/active');
    return res.status === 204 ? null : res.data;
  },

  updateStatus: async (requestId, status, note) => {
    const res = await apiClient.patch(`/provider/requests/${requestId}/status`, { status, note });
    return res.data;
  },

  toggleAvailability: async (available) => {
    const res = await apiClient.patch('/provider/availability', { available });
    return res.data;
  },
};

export const checkBackendHealth = async () => {
  try {
    const start = Date.now();
    // Test auth endpoint or root
    await apiClient.get('/auth/me').catch((e) => {
      // 401/403 means backend is alive and responding
      if (e.response && (e.response.status === 401 || e.response.status === 403)) {
        return { status: 'ONLINE' };
      }
      throw e;
    });
    return { ok: true, latency: Date.now() - start };
  } catch (err) {
    return { ok: false, error: err.message || 'Cannot reach server' };
  }
};
