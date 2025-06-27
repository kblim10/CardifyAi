import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Deck, Card, ReviewSession } from '../types';
import database from '../services/database';
import api from '../services/api';
import { useAuth } from './AuthContext';

// App state interface
interface AppState {
  decks: Deck[];
  currentDeck: Deck | null;
  cards: Card[];
  reviewSessions: ReviewSession[];
  isLoading: boolean;
  isOnline: boolean;
  lastSync: Date | null;
  settings: {
    autoSync: boolean;
    reviewLimit: number;
    notifications: boolean;
    theme: 'light' | 'dark';
  };
}

// Initial state
const initialState: AppState = {
  decks: [],
  currentDeck: null,
  cards: [],
  reviewSessions: [],
  isLoading: false,
  isOnline: true,
  lastSync: null,
  settings: {
    autoSync: true,
    reviewLimit: 20,
    notifications: true,
    theme: 'light',
  },
};

// Action types
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ONLINE'; payload: boolean }
  | { type: 'SET_LAST_SYNC'; payload: Date }
  | { type: 'SET_DECKS'; payload: Deck[] }
  | { type: 'ADD_DECK'; payload: Deck }
  | { type: 'UPDATE_DECK'; payload: Deck }
  | { type: 'DELETE_DECK'; payload: string }
  | { type: 'SET_CURRENT_DECK'; payload: Deck | null }
  | { type: 'SET_CARDS'; payload: Card[] }
  | { type: 'ADD_CARD'; payload: Card }
  | { type: 'UPDATE_CARD'; payload: Card }
  | { type: 'DELETE_CARD'; payload: string }
  | { type: 'SET_REVIEW_SESSIONS'; payload: ReviewSession[] }
  | { type: 'ADD_REVIEW_SESSION'; payload: ReviewSession }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppState['settings']> };

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ONLINE':
      return { ...state, isOnline: action.payload };
    case 'SET_LAST_SYNC':
      return { ...state, lastSync: action.payload };
    case 'SET_DECKS':
      return { ...state, decks: action.payload };
    case 'ADD_DECK':
      return { ...state, decks: [action.payload, ...state.decks] };
    case 'UPDATE_DECK':
      return {
        ...state,
        decks: state.decks.map(deck =>
          deck.id === action.payload.id ? action.payload : deck
        ),
        currentDeck: state.currentDeck?.id === action.payload.id ? action.payload : state.currentDeck,
      };
    case 'DELETE_DECK':
      return {
        ...state,
        decks: state.decks.filter(deck => deck.id !== action.payload),
        currentDeck: state.currentDeck?.id === action.payload ? null : state.currentDeck,
      };
    case 'SET_CURRENT_DECK':
      return { ...state, currentDeck: action.payload };
    case 'SET_CARDS':
      return { ...state, cards: action.payload };
    case 'ADD_CARD':
      return { ...state, cards: [...state.cards, action.payload] };
    case 'UPDATE_CARD':
      return {
        ...state,
        cards: state.cards.map(card =>
          card.id === action.payload.id ? action.payload : card
        ),
      };
    case 'DELETE_CARD':
      return {
        ...state,
        cards: state.cards.filter(card => card.id !== action.payload),
      };
    case 'SET_REVIEW_SESSIONS':
      return { ...state, reviewSessions: action.payload };
    case 'ADD_REVIEW_SESSION':
      return { ...state, reviewSessions: [action.payload, ...state.reviewSessions] };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    default:
      return state;
  }
};

// Context
interface AppContextType extends AppState {
  // Deck actions
  loadDecks: () => Promise<void>;
  createDeck: (deck: Omit<Deck, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Deck>;
  updateDeck: (deck: Deck) => Promise<void>;
  deleteDeck: (id: string) => Promise<void>;
  setCurrentDeck: (deck: Deck | null) => void;

  // Card actions
  loadCards: (deckId: string) => Promise<void>;
  createCard: (card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Card>;
  updateCard: (card: Card) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
  getCardsForReview: (deckId: string, limit?: number) => Promise<Card[]>;

  // Review actions
  createReviewSession: (session: Omit<ReviewSession, 'id'>) => Promise<ReviewSession>;
  updateReviewSession: (session: ReviewSession) => Promise<void>;

  // Sync actions
  syncData: () => Promise<void>;
  updateSettings: (settings: Partial<AppState['settings']>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { user, isAuthenticated } = useAuth();

  // Initialize database and load data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await database.init();
        await loadSettings();
        
        if (isAuthenticated && user) {
          await loadDecks();
        }
      } catch (error) {
        console.error('App initialization error:', error);
      }
    };

    initializeApp();
  }, [isAuthenticated, user]);

  // Load settings from storage
  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('app_settings');
      if (settings) {
        const parsedSettings = JSON.parse(settings);
        dispatch({ type: 'UPDATE_SETTINGS', payload: parsedSettings });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  // Save settings to storage
  const saveSettings = async (settings: AppState['settings']) => {
    try {
      await AsyncStorage.setItem('app_settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  // Load decks
  const loadDecks = async () => {
    if (!user) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const decks = await database.getDecks(user.id);
      dispatch({ type: 'SET_DECKS', payload: decks });
    } catch (error) {
      console.error('Error loading decks:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Create deck
  const createDeck = async (deckData: Omit<Deck, 'id' | 'createdAt' | 'updatedAt'>): Promise<Deck> => {
    const deck: Deck = {
      ...deckData,
      id: `deck_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      await database.createDeck(deck);
      dispatch({ type: 'ADD_DECK', payload: deck });

      // Sync to server if online
      if (state.isOnline) {
        try {
          await api.post('/decks', deck);
        } catch (error) {
          console.error('Error syncing deck to server:', error);
        }
      }

      return deck;
    } catch (error) {
      console.error('Error creating deck:', error);
      throw error;
    }
  };

  // Update deck
  const updateDeck = async (deck: Deck) => {
    try {
      await database.updateDeck(deck);
      dispatch({ type: 'UPDATE_DECK', payload: deck });

      // Sync to server if online
      if (state.isOnline) {
        try {
          await api.put(`/decks/${deck.id}`, deck);
        } catch (error) {
          console.error('Error syncing deck to server:', error);
        }
      }
    } catch (error) {
      console.error('Error updating deck:', error);
      throw error;
    }
  };

  // Delete deck
  const deleteDeck = async (id: string) => {
    try {
      await database.deleteDeck(id);
      dispatch({ type: 'DELETE_DECK', payload: id });

      // Sync to server if online
      if (state.isOnline) {
        try {
          await api.delete(`/decks/${id}`);
        } catch (error) {
          console.error('Error syncing deck deletion to server:', error);
        }
      }
    } catch (error) {
      console.error('Error deleting deck:', error);
      throw error;
    }
  };

  // Set current deck
  const setCurrentDeck = (deck: Deck | null) => {
    dispatch({ type: 'SET_CURRENT_DECK', payload: deck });
  };

  // Load cards
  const loadCards = async (deckId: string) => {
    try {
      const cards = await database.getCards(deckId);
      dispatch({ type: 'SET_CARDS', payload: cards });
    } catch (error) {
      console.error('Error loading cards:', error);
    }
  };

  // Create card
  const createCard = async (cardData: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>): Promise<Card> => {
    const card: Card = {
      ...cardData,
      id: `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      nextReview: new Date(),
      interval: 1,
      repetition: 0,
      efactor: 2.5,
      status: 'new',
    };

    try {
      await database.createCard(card);
      dispatch({ type: 'ADD_CARD', payload: card });

      // Sync to server if online
      if (state.isOnline) {
        try {
          await api.post('/cards', card);
        } catch (error) {
          console.error('Error syncing card to server:', error);
        }
      }

      return card;
    } catch (error) {
      console.error('Error creating card:', error);
      throw error;
    }
  };

  // Update card
  const updateCard = async (card: Card) => {
    try {
      await database.updateCard(card);
      dispatch({ type: 'UPDATE_CARD', payload: card });

      // Sync to server if online
      if (state.isOnline) {
        try {
          await api.put(`/cards/${card.id}`, card);
        } catch (error) {
          console.error('Error syncing card to server:', error);
        }
      }
    } catch (error) {
      console.error('Error updating card:', error);
      throw error;
    }
  };

  // Delete card
  const deleteCard = async (id: string) => {
    try {
      await database.deleteCard(id);
      dispatch({ type: 'DELETE_CARD', payload: id });

      // Sync to server if online
      if (state.isOnline) {
        try {
          await api.delete(`/cards/${id}`);
        } catch (error) {
          console.error('Error syncing card deletion to server:', error);
        }
      }
    } catch (error) {
      console.error('Error deleting card:', error);
      throw error;
    }
  };

  // Get cards for review
  const getCardsForReview = async (deckId: string, limit: number = 20): Promise<Card[]> => {
    try {
      return await database.getCardsForReview(deckId, limit);
    } catch (error) {
      console.error('Error getting cards for review:', error);
      return [];
    }
  };

  // Create review session
  const createReviewSession = async (sessionData: Omit<ReviewSession, 'id'>): Promise<ReviewSession> => {
    const session: ReviewSession = {
      ...sessionData,
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    try {
      await database.createReviewSession(session);
      dispatch({ type: 'ADD_REVIEW_SESSION', payload: session });

      // Sync to server if online
      if (state.isOnline) {
        try {
          await api.post('/review-sessions', session);
        } catch (error) {
          console.error('Error syncing review session to server:', error);
        }
      }

      return session;
    } catch (error) {
      console.error('Error creating review session:', error);
      throw error;
    }
  };

  // Update review session
  const updateReviewSession = async (session: ReviewSession) => {
    try {
      await database.updateReviewSession(session.id, session);
      dispatch({ type: 'UPDATE_REVIEW_SESSION', payload: session });

      // Sync to server if online
      if (state.isOnline) {
        try {
          await api.put(`/review-sessions/${session.id}`, session);
        } catch (error) {
          console.error('Error syncing review session to server:', error);
        }
      }
    } catch (error) {
      console.error('Error updating review session:', error);
      throw error;
    }
  };

  // Sync data
  const syncData = async () => {
    if (!state.isOnline || !user) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Sync decks
      const unsyncedDecks = await database.getUnsyncedRecords('decks');
      for (const deck of unsyncedDecks) {
        try {
          await api.post('/decks', deck);
          await database.markAsSynced('decks', deck.id);
        } catch (error) {
          console.error('Error syncing deck:', error);
        }
      }

      // Sync cards
      const unsyncedCards = await database.getUnsyncedRecords('cards');
      for (const card of unsyncedCards) {
        try {
          await api.post('/cards', card);
          await database.markAsSynced('cards', card.id);
        } catch (error) {
          console.error('Error syncing card:', error);
        }
      }

      dispatch({ type: 'SET_LAST_SYNC', payload: new Date() });
    } catch (error) {
      console.error('Error syncing data:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Update settings
  const updateSettings = async (settings: Partial<AppState['settings']>) => {
    const newSettings = { ...state.settings, ...settings };
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
    await saveSettings(newSettings);
  };

  const value: AppContextType = {
    ...state,
    loadDecks,
    createDeck,
    updateDeck,
    deleteDeck,
    setCurrentDeck,
    loadCards,
    createCard,
    updateCard,
    deleteCard,
    getCardsForReview,
    createReviewSession,
    updateReviewSession,
    syncData,
    updateSettings,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Hook to use app context
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 