import { Platform } from 'react-native';

// Environment configuration
export const ENV = {
  DEV: __DEV__,
  PROD: !__DEV__,
  PLATFORM: Platform.OS,
  VERSION: '1.0.0',
  BUILD_NUMBER: '1',
};

// API configuration
export const API_CONFIG = {
  BASE_URL: __DEV__ 
    ? 'http://localhost:5000/api' 
    : 'https://cardifyai-backend.azurewebsites.net/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// Database configuration
export const DB_CONFIG = {
  NAME: 'CardifyAi.db',
  VERSION: '1.0',
  DISPLAY_NAME: 'CardifyAi Database',
  SIZE: 200000,
};

// Storage configuration
export const STORAGE_CONFIG = {
  PREFIX: 'cardifyai_',
  ENCRYPTION_KEY: 'your-encryption-key-here',
};

// OCR configuration
export const OCR_CONFIG = {
  API_URL: 'https://api.ocr.space/parse/image',
  API_KEY: 'your-ocr-api-key-here',
  LANGUAGE: 'eng',
  ORIENTATION: 'auto',
  SCALE: true,
  DETECT_ORIENTATION: true,
  IS_TABLE: false,
  OCREngine: 2,
};

// SRS configuration
export const SRS_CONFIG = {
  INITIAL_INTERVAL: 1,
  INITIAL_EFACTOR: 2.5,
  MIN_EFACTOR: 1.3,
  MAX_EFACTOR: 2.5,
  QUALITY_WEIGHTS: [0, 1, 2, 3, 4, 5],
  BONUS_EFACTOR: 0.1,
  PENALTY_EFACTOR: 0.2,
};

// Review configuration
export const REVIEW_CONFIG = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  MIN_INTERVAL: 1,
  MAX_INTERVAL: 365,
  QUALITY_THRESHOLDS: {
    AGAIN: 0,
    HARD: 1,
    GOOD: 2,
    EASY: 3,
    PERFECT: 4,
    EXCELLENT: 5,
  },
};

// File upload configuration
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'text/plain'],
  MAX_IMAGES_PER_CARD: 5,
  COMPRESSION_QUALITY: 0.8,
  MAX_WIDTH: 1920,
  MAX_HEIGHT: 1080,
};

// Notification configuration
export const NOTIFICATION_CONFIG = {
  CHANNELS: {
    REMINDERS: {
      id: 'reminders',
      name: 'Reminder Notifications',
      description: 'Reminder notifications for card reviews',
      importance: 4,
      sound: 'default',
      vibrate: true,
    },
    GENERAL: {
      id: 'general',
      name: 'General Notifications',
      description: 'General notifications for the app',
      importance: 3,
      sound: 'default',
      vibrate: true,
    },
  },
  DEFAULT_REMINDER_TIME: '09:00',
  REMINDER_INTERVAL: 24 * 60 * 60 * 1000, // 24 hours
};

// Cache configuration
export const CACHE_CONFIG = {
  DECKS_TTL: 5 * 60 * 1000, // 5 minutes
  CARDS_TTL: 10 * 60 * 1000, // 10 minutes
  USER_TTL: 30 * 60 * 1000, // 30 minutes
  IMAGES_TTL: 7 * 24 * 60 * 60 * 1000, // 7 days
  MAX_CACHE_SIZE: 100 * 1024 * 1024, // 100MB
};

// Sync configuration
export const SYNC_CONFIG = {
  AUTO_SYNC_INTERVAL: 5 * 60 * 1000, // 5 minutes
  MANUAL_SYNC_TIMEOUT: 30 * 1000, // 30 seconds
  MAX_SYNC_RETRIES: 3,
  SYNC_BATCH_SIZE: 50,
  OFFLINE_QUEUE_SIZE: 1000,
};

// Validation configuration
export const VALIDATION_CONFIG = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  TITLE_MIN_LENGTH: 3,
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
  PHONE_REGEX: /^(08|\+628|628)\d{8,11}$/,
};

// Animation configuration
export const ANIMATION_CONFIG = {
  DURATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
    VERY_SLOW: 1000,
  },
  EASING: {
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out',
  },
  SPRING: {
    TENSION: 100,
    FRICTION: 8,
  },
};

// Performance configuration
export const PERFORMANCE_CONFIG = {
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 100,
  LAZY_LOAD_THRESHOLD: 100,
  IMAGE_CACHE_SIZE: 50,
  MEMORY_WARNING_THRESHOLD: 0.8,
};

// Security configuration
export const SECURITY_CONFIG = {
  JWT_EXPIRY: 30 * 24 * 60 * 60 * 1000, // 30 days
  REFRESH_TOKEN_EXPIRY: 90 * 24 * 60 * 60 * 1000, // 90 days
  PASSWORD_HASH_ROUNDS: 12,
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
};

// Feature flags
export const FEATURE_FLAGS = {
  OCR_ENABLED: true,
  OFFLINE_MODE: true,
  PUSH_NOTIFICATIONS: true,
  ANALYTICS: true,
  CRASH_REPORTING: true,
  DARK_MODE: true,
  BIOMETRIC_AUTH: false,
  CLOUD_SYNC: true,
  SHARING: true,
  EXPORT: true,
  IMPORT: true,
};

// App settings defaults
export const DEFAULT_SETTINGS = {
  THEME: 'light',
  LANGUAGE: 'id',
  AUTO_SYNC: true,
  NOTIFICATIONS: true,
  SOUND_EFFECTS: true,
  HAPTIC_FEEDBACK: true,
  REVIEW_LIMIT: 20,
  SHOW_ANSWER_TIME: true,
  SHOW_PROGRESS: true,
  AUTO_PLAY_AUDIO: false,
  DOWNLOAD_IMAGES: true,
  COMPRESS_IMAGES: true,
  BACKUP_ENABLED: true,
  BACKUP_FREQUENCY: 'daily',
  PRIVACY_MODE: false,
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
  AUTH_ERROR: 'Sesi Anda telah berakhir. Silakan login kembali.',
  UPLOAD_ERROR: 'Gagal mengunggah file. Coba lagi.',
  OCR_ERROR: 'Gagal mengekstrak teks dari gambar. Coba lagi.',
  SYNC_ERROR: 'Gagal menyinkronkan data. Coba lagi.',
  STORAGE_ERROR: 'Gagal menyimpan data. Coba lagi.',
  VALIDATION_ERROR: 'Data yang dimasukkan tidak valid.',
  PERMISSION_ERROR: 'Izin diperlukan untuk fitur ini.',
  GENERAL_ERROR: 'Terjadi kesalahan. Coba lagi.',
  TIMEOUT_ERROR: 'Permintaan timeout. Coba lagi.',
  SERVER_ERROR: 'Terjadi kesalahan pada server.',
  NOT_FOUND_ERROR: 'Data tidak ditemukan.',
  CONFLICT_ERROR: 'Data sudah ada.',
  RATE_LIMIT_ERROR: 'Terlalu banyak permintaan. Coba lagi nanti.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login berhasil!',
  REGISTER_SUCCESS: 'Registrasi berhasil!',
  LOGOUT_SUCCESS: 'Logout berhasil!',
  DECK_CREATED: 'Deck berhasil dibuat!',
  DECK_UPDATED: 'Deck berhasil diperbarui!',
  DECK_DELETED: 'Deck berhasil dihapus!',
  CARD_CREATED: 'Kartu berhasil ditambahkan!',
  CARD_UPDATED: 'Kartu berhasil diperbarui!',
  CARD_DELETED: 'Kartu berhasil dihapus!',
  REVIEW_COMPLETED: 'Sesi review selesai!',
  SYNC_SUCCESS: 'Data berhasil disinkronkan!',
  SETTINGS_SAVED: 'Pengaturan berhasil disimpan!',
  PROFILE_UPDATED: 'Profil berhasil diperbarui!',
  PASSWORD_CHANGED: 'Password berhasil diubah!',
  BACKUP_CREATED: 'Backup berhasil dibuat!',
  RESTORE_COMPLETED: 'Restore berhasil diselesaikan!',
  EXPORT_COMPLETED: 'Export berhasil diselesaikan!',
  IMPORT_COMPLETED: 'Import berhasil diselesaikan!',
};

// App constants
export const APP_CONSTANTS = {
  MAX_DECKS_PER_USER: 1000,
  MAX_CARDS_PER_DECK: 10000,
  MAX_TAGS_PER_ITEM: 20,
  MAX_IMAGES_PER_CARD: 5,
  MAX_NOTES_LENGTH: 1000,
  MIN_REVIEW_INTERVAL: 1,
  MAX_REVIEW_INTERVAL: 365,
  DEFAULT_REVIEW_LIMIT: 20,
  MAX_REVIEW_LIMIT: 100,
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  AUTO_SAVE_DELAY: 2000, // 2 seconds
  DEBOUNCE_DELAY: 300, // 300ms
  THROTTLE_DELAY: 100, // 100ms
};

// Export all configurations
export default {
  ENV,
  API_CONFIG,
  DB_CONFIG,
  STORAGE_CONFIG,
  OCR_CONFIG,
  SRS_CONFIG,
  REVIEW_CONFIG,
  UPLOAD_CONFIG,
  NOTIFICATION_CONFIG,
  CACHE_CONFIG,
  SYNC_CONFIG,
  VALIDATION_CONFIG,
  ANIMATION_CONFIG,
  PERFORMANCE_CONFIG,
  SECURITY_CONFIG,
  FEATURE_FLAGS,
  DEFAULT_SETTINGS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  APP_CONSTANTS,
}; 