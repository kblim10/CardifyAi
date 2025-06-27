// API Configuration
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:5000/api' 
  : 'https://your-production-api.com/api';

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  DECKS: 'decks',
  CARDS: 'cards',
  REVIEW_SESSIONS: 'review_sessions',
  SETTINGS: 'settings',
};

// SRS Configuration
export const SRS_CONFIG = {
  INITIAL_INTERVAL: 1,
  INITIAL_EFACTOR: 2.5,
  MIN_EFACTOR: 1.3,
  QUALITY_WEIGHTS: [0, 1, 2, 3, 4, 5],
};

// Review Quality Levels
export const REVIEW_QUALITY = {
  AGAIN: 0,
  HARD: 1,
  GOOD: 2,
  EASY: 3,
  PERFECT: 4,
  EXCELLENT: 5,
};

// Navigation Routes
export const ROUTES = {
  AUTH: {
    LOGIN: 'Login',
    REGISTER: 'Register',
  },
  MAIN: {
    HOME: 'Home',
    CREATE: 'Create',
    REVIEW: 'Review',
    STATISTICS: 'Statistics',
    PROFILE: 'Profile',
  },
  STACK: {
    CREATE_DECK: 'CreateDeck',
    CREATE_CARD: 'CreateCard',
    DECK_DETAIL: 'DeckDetail',
    SCAN: 'Scan',
  },
};

// File Upload
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
  MAX_IMAGES_PER_CARD: 5,
};

// Notifications
export const NOTIFICATION_CHANNELS = {
  REMINDERS: 'reminders',
  GENERAL: 'general',
};

// App Settings
export const APP_SETTINGS = {
  DEFAULT_REVIEW_LIMIT: 20,
  AUTO_SYNC_INTERVAL: 5 * 60 * 1000, // 5 minutes
  OFFLINE_SYNC_DELAY: 30 * 1000, // 30 seconds
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
  AUTH_ERROR: 'Sesi Anda telah berakhir. Silakan login kembali.',
  UPLOAD_ERROR: 'Gagal mengunggah file. Coba lagi.',
  OCR_ERROR: 'Gagal mengekstrak teks dari gambar. Coba lagi.',
  GENERAL_ERROR: 'Terjadi kesalahan. Coba lagi.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login berhasil!',
  REGISTER_SUCCESS: 'Registrasi berhasil!',
  DECK_CREATED: 'Deck berhasil dibuat!',
  CARD_CREATED: 'Kartu berhasil ditambahkan!',
  REVIEW_COMPLETED: 'Sesi review selesai!',
  SYNC_SUCCESS: 'Data berhasil disinkronkan!',
};

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  TITLE_MIN_LENGTH: 3,
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
};

// Colors for different card statuses
export const CARD_STATUS_COLORS = {
  new: '#4F6AF5',
  learning: '#FF8B3D',
  review: '#00C851',
  relearn: '#FF3D77',
};

// Animation durations
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
};

// Pagination
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

// Cache configuration
export const CACHE_CONFIG = {
  DECKS_TTL: 5 * 60 * 1000, // 5 minutes
  CARDS_TTL: 10 * 60 * 1000, // 10 minutes
  USER_TTL: 30 * 60 * 1000, // 30 minutes
}; 