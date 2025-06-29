import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Base URL configuration
const getApiUrl = () => {
  if (__DEV__) {
    // Development environment
    if (Platform.OS === 'android') {
      // Multiple URLs to try for Android emulator
      // Replace 192.168.1.100 with your actual computer IP address
      // You can find it by running: ipconfig (Windows) or ifconfig (Mac/Linux)
      return 'http://192.168.52.161:5000/api'; // Try your computer's IP first
      // return 'http://10.0.2.2:5000/api'; // Android emulator default
      // return 'http://localhost:5000/api'; // Last resort
    } else {
      return 'http://localhost:5000/api'; // iOS simulator
    }
  } else {
    // Production environment
    return 'https://your-production-api.com/api';
  }
};

const API_URL = getApiUrl();

console.log('API_URL configured as:', API_URL);
console.log('Platform:', Platform.OS);
console.log('Dev mode:', __DEV__);

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
api.interceptors.request.use(
  async config => {
    // Get token from storage
    const token = await AsyncStorage.getItem('token');
    
    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      console.error('Network connection failed. Make sure backend server is running on:', API_URL);
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) => {
    return api.post('/auth/login', { email, password });
  },
  
  register: (name: string, email: string, password: string) => {
    return api.post('/auth/register', { name, email, password });
  },
  
  getProfile: () => {
    return api.get('/auth/me');
  },
  
  updateProfile: (userData: { name: string; email: string }) => {
    return api.put('/auth/updatedetails', userData);
  },
  
  updatePassword: (currentPassword: string, newPassword: string) => {
    return api.put('/auth/updatepassword', { currentPassword, newPassword });
  },
};

// Decks API
export const decksAPI = {
  getDecks: () => {
    return api.get('/decks');
  },
  
  getUserDecks: () => {
    return api.get('/decks/user');
  },
  
  getDeck: (deckId: string) => {
    return api.get(`/decks/${deckId}`);
  },
  
  createDeck: (deckData: { title: string; description?: string; isPublic: boolean; tags?: string[] }) => {
    return api.post('/decks', deckData);
  },
  
  updateDeck: (deckId: string, deckData: { title?: string; description?: string; isPublic?: boolean; tags?: string[] }) => {
    return api.put(`/decks/${deckId}`, deckData);
  },
  
  deleteDeck: (deckId: string) => {
    return api.delete(`/decks/${deckId}`);
  },
};

// Cards API
export const cardsAPI = {
  getCards: () => {
    return api.get('/cards');
  },
  
  getDeckCards: (deckId: string) => {
    return api.get(`/cards/deck/${deckId}`);
  },
  
  getCard: (cardId: string) => {
    return api.get(`/cards/${cardId}`);
  },
  
  createCard: (cardData: { deckId: string; frontContent: string; backContent: string; tags?: string[]; mediaPath?: string }) => {
    return api.post('/cards', cardData);
  },
  
  updateCard: (cardId: string, cardData: { frontContent?: string; backContent?: string; tags?: string[]; mediaPath?: string }) => {
    return api.put(`/cards/${cardId}`, cardData);
  },
  
  deleteCard: (cardId: string) => {
    return api.delete(`/cards/${cardId}`);
  },
  
  updateCardSRS: (cardId: string, srsData: { easeFactor: number; interval: number; repetitions: number; dueDate: Date; lastReviewedAt: Date }) => {
    return api.put(`/cards/${cardId}/srs`, { srsData });
  },
};

// OCR API
export const ocrAPI = {
  processImage: (imageData: FormData) => {
    return api.post('/ocr/image', imageData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  processDocument: (documentData: FormData) => {
    return api.post('/ocr/document', documentData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default api;