import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, NativeModules } from 'react-native';

// Import language files
import en from './locales/en.json';
import id from './locales/id.json';

// Get device language
const getDeviceLanguage = (): string => {
  const deviceLanguage =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0]
      : NativeModules.I18nManager.localeIdentifier;

  return deviceLanguage.split('_')[0];
};

// Language resources
const resources = {
  en: {
    translation: en,
  },
  id: {
    translation: id,
  },
};

// i18n configuration
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getDeviceLanguage(),
    fallbackLng: 'en',
    debug: __DEV__,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

// Language detection and persistence
const detectAndSetLanguage = async () => {
  try {
    // Try to get saved language preference
    const savedLanguage = await AsyncStorage.getItem('app_language');
    
    if (savedLanguage && resources[savedLanguage]) {
      await i18n.changeLanguage(savedLanguage);
    } else {
      // Use device language or fallback to English
      const deviceLanguage = getDeviceLanguage();
      const language = resources[deviceLanguage] ? deviceLanguage : 'en';
      await i18n.changeLanguage(language);
      await AsyncStorage.setItem('app_language', language);
    }
  } catch (error) {
    console.error('Error detecting language:', error);
    // Fallback to English
    await i18n.changeLanguage('en');
  }
};

// Initialize language detection
detectAndSetLanguage();

// Change language function
export const changeLanguage = async (language: string) => {
  try {
    if (resources[language]) {
      await i18n.changeLanguage(language);
      await AsyncStorage.setItem('app_language', language);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error changing language:', error);
    return false;
  }
};

// Get current language
export const getCurrentLanguage = (): string => {
  return i18n.language;
};

// Get available languages
export const getAvailableLanguages = (): string[] => {
  return Object.keys(resources);
};

// Get language name
export const getLanguageName = (code: string): string => {
  const languageNames: { [key: string]: string } = {
    en: 'English',
    id: 'Bahasa Indonesia',
  };
  return languageNames[code] || code;
};

// Get language native name
export const getLanguageNativeName = (code: string): string => {
  const nativeNames: { [key: string]: string } = {
    en: 'English',
    id: 'Bahasa Indonesia',
  };
  return nativeNames[code] || code;
};

// Check if language is RTL
export const isRTL = (language?: string): boolean => {
  const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
  const lang = language || getCurrentLanguage();
  return rtlLanguages.includes(lang);
};

export default i18n; 