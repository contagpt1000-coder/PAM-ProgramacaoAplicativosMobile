import axios from 'axios';
import { Platform } from 'react-native';

// Para emulador Android use 'http://10.0.2.2:3000'
// Para iOS ou Web use 'http://localhost:3000'
// Para dispositivo físico no Expo Go, troque pelo seu IP local (ex: 'http://192.168.1.15:3000')
const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor global para tratamento padronizado de erros de rede e HTTP
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Tempo limite da requisição excedido (Timeout). Verifique se o json-server está respondendo.'));
    }
    if (!error.response) {
      return Promise.reject(new Error('Falha de conexão com a API. Certifique-se que o json-server está rodando na porta 3000.'));
    }
    return Promise.reject(error);
  }
);
