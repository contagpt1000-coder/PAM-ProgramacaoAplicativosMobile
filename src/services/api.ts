import axios from 'axios';
import { Platform } from 'react-native';

const getBaseURL = (): string => {
  // 1. Prioridade para variável de ambiente explícita
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // 2. Ambiente Web: utiliza dinamicamente o hostname do navegador (localhost ou IP da rede local)
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname || 'localhost';
    return `http://${hostname}:3000`;
  }

  // 3. Emulador Android nativo
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }

  // 4. iOS Simulator e padrão local
  return 'http://localhost:3000';
};

export const API_URL = getBaseURL();

export const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor global com logs diagnósticos informativos
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.warn('[BarberFlow API] Timeout na requisição HTTP. Acionando camada de resiliência.');
    } else if (!error.response) {
      console.warn('[BarberFlow API] Servidor REST indisponível ou inacessível. Acionando fallback local.');
    }
    return Promise.reject(error);
  }
);
