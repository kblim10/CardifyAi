// src/types/index.ts

// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
  error: string | null;
}

// Deck related types
export interface Deck {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  cardCount: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  lastReviewed?: Date;
  tags?: string[];
}

// Card related types
export interface Card {
  id: string;
  deckId: string;
  front: string;
  back: string;
  notes?: string;
  images?: string[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  // SRS related fields
  nextReview: Date;
  interval: number;
  repetition: number;
  efactor: number;
  status: 'new' | 'learning' | 'review' | 'relearn';
}

// Review related types
export interface ReviewSession {
  deckId: string;
  cards: Card[];
  startTime: Date;
  endTime?: Date;
  cardsReviewed: number;
  cardsCorrect: number;
}

export interface ReviewAnswer {
  cardId: string;
  quality: 0 | 1 | 2 | 3 | 4 | 5;
  timeSpent: number;
}

// OCR related types
export interface OcrResult {
  text: string;
  confidence: number;
}

// Statistics related types
export interface DailyStats {
  date: string;
  cardsLearned: number;
  cardsReviewed: number;
  timeSpent: number;
  correctAnswers: number;
}

export interface CardStats {
  cardId: string;
  reviewCount: number;
  correctCount: number;
  averageTime: number;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Create: undefined;
  Review: undefined;
  Statistics: undefined;
  Profile: undefined;
};

export type MainStackParamList = {
  HomeTab: undefined;
  CreateTab: undefined;
  ReviewTab: undefined;
  StatisticsTab: undefined;
  ProfileTab: undefined;
  CreateDeck: undefined;
  CreateCard: { deckId?: string };
  DeckDetail: { deckId: string };
  Scan: undefined;
};

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface CreateDeckForm {
  title: string;
  description: string;
  coverImage?: string;
  tags?: string[];
}

export interface CreateCardForm {
  front: string;
  back: string;
  notes?: string;
  images?: string[];
  tags?: string[];
}

// Theme types
export interface Theme {
  COLORS: {
    primary: string;
    secondary: string;
    tertiary: string;
    success: string;
    error: string;
    warning: string;
    info: string;
    black: string;
    white: string;
    background: string;
    card: string;
    text: string;
    border: string;
    gray100: string;
    gray200: string;
    gray300: string;
    gray400: string;
    gray500: string;
    gray600: string;
    gray700: string;
    gray800: string;
    gray900: string;
  };
  SIZES: {
    base: number;
    font: number;
    radius: number;
    padding: number;
    margin: number;
    largeTitle: number;
    h1: number;
    h2: number;
    h3: number;
    h4: number;
    h5: number;
    body1: number;
    body2: number;
    body3: number;
    body4: number;
    body5: number;
    width: number;
    height: number;
  };
  FONTS: {
    largeTitle: any;
    h1: any;
    h2: any;
    h3: any;
    h4: any;
    h5: any;
    body1: any;
    body2: any;
    body3: any;
    body4: any;
    body5: any;
  };
  SHADOWS: {
    light: any;
    medium: any;
    dark: any;
  };
}
