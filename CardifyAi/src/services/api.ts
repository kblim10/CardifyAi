import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL
const API_URL = 'http://10.0.2.2:5000/api'; // Untuk emulator Android
// const API_URL = 'http://localhost:5000/api'; // Untuk iOS simulator

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
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

const register = async (name: string, email: string, password: string) => {
  console.log('Mencoba registrasi dengan:', { name, email, password });
  try {
    const response = await axios.post('/api/auth/register', {
      name,
      email,
      password,
    });
    console.log('Registrasi berhasil:', response.data);
    return response;
  } catch (error) {
    console.error('Registrasi gagal:', error);
    throw error;
  }
};

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