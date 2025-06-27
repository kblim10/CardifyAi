import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SIZES } from '../theme';
import Button from './Button';

interface ErrorViewProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
  showIcon?: boolean;
}

const ErrorView: React.FC<ErrorViewProps> = ({
  title = 'Terjadi Kesalahan',
  message,
  onRetry,
  retryText = 'Coba Lagi',
  showIcon = true,
}) => {
  return (
    <View style={styles.container}>
      {showIcon && (
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>⚠️</Text>
        </View>
      )}
      
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      
      {onRetry && (
        <Button
          title={retryText}
          onPress={onRetry}
          style={styles.retryButton}
          textStyle={styles.retryButtonText}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
    backgroundColor: COLORS.background,
  },
  iconContainer: {
    marginBottom: SIZES.margin,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    ...FONTS.h3,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SIZES.base,
  },
  message: {
    ...FONTS.body3,
    color: COLORS.gray600,
    textAlign: 'center',
    marginBottom: SIZES.margin,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
  },
  retryButtonText: {
    ...FONTS.body4,
    color: COLORS.white,
    fontWeight: '600',
  },
});

export default ErrorView; 