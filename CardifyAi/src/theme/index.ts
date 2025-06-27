import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const COLORS = {
  primary: '#4F6AF5',
  secondary: '#FF8B3D',
  tertiary: '#FF3D77',
  
  success: '#00C851',
  error: '#ff4444',
  warning: '#ffbb33',
  info: '#33b5e5',
  
  black: '#000000',
  white: '#FFFFFF',
  
  background: '#F9FBFF',
  card: '#FFFFFF',
  text: '#333333',
  border: '#E1E9F8',
  
  gray100: '#F5F7FA',
  gray200: '#E1E9F8',
  gray300: '#C8D4E5',
  gray400: '#A3B4CC',
  gray500: '#7D8DA6',
  gray600: '#5D6B80',
  gray700: '#3E4959',
  gray800: '#1F2733',
  gray900: '#0F141C',
};

export const SIZES = {
  // Global sizes
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,
  margin: 20,

  // Font sizes
  largeTitle: 40,
  h1: 30,
  h2: 22,
  h3: 18,
  h4: 16,
  h5: 14,
  body1: 30,
  body2: 22,
  body3: 16,
  body4: 14,
  body5: 12,

  // App dimensions
  width,
  height,
};

export const FONTS = {
  largeTitle: { fontFamily: 'Roboto-Bold', fontSize: SIZES.largeTitle },
  h1: { fontFamily: 'Roboto-Bold', fontSize: SIZES.h1, lineHeight: 36 },
  h2: { fontFamily: 'Roboto-Bold', fontSize: SIZES.h2, lineHeight: 30 },
  h3: { fontFamily: 'Roboto-SemiBold', fontSize: SIZES.h3, lineHeight: 22 },
  h4: { fontFamily: 'Roboto-SemiBold', fontSize: SIZES.h4, lineHeight: 22 },
  h5: { fontFamily: 'Roboto-SemiBold', fontSize: SIZES.h5, lineHeight: 22 },
  body1: { fontFamily: 'Roboto-Regular', fontSize: SIZES.body1, lineHeight: 36 },
  body2: { fontFamily: 'Roboto-Regular', fontSize: SIZES.body2, lineHeight: 30 },
  body3: { fontFamily: 'Roboto-Regular', fontSize: SIZES.body3, lineHeight: 22 },
  body4: { fontFamily: 'Roboto-Regular', fontSize: SIZES.body4, lineHeight: 22 },
  body5: { fontFamily: 'Roboto-Regular', fontSize: SIZES.body5, lineHeight: 22 },
};

export const SHADOWS = {
  light: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5.84,
    elevation: 5,
  },
  dark: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.2,
    shadowRadius: 9.16,
    elevation: 10,
  },
};

const appTheme = { COLORS, SIZES, FONTS, SHADOWS };

export default appTheme;
