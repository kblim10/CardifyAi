/**
 * UUID generator untuk React Native
 * Kompatibel dengan environment yang tidak memiliki crypto.getRandomValues()
 */

import uuid from 'react-native-uuid';

export const generateUUID = (): string => {
  return uuid.v4() as string;
};

export const generateShortId = (): string => {
  // Generate short ID (8 characters)
  return Math.random().toString(36).substring(2, 10);
};

// Fallback UUID generator jika react-native-uuid tidak tersedia
export const generateFallbackUUID = (): string => {
  // Template untuk UUID v4: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    // eslint-disable-next-line no-bitwise
    const r = Math.random() * 16 | 0;
    // eslint-disable-next-line no-bitwise
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export default generateUUID;
