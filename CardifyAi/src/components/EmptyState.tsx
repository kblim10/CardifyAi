import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES } from '../theme';
import Button from './Button';

interface EmptyStateProps {
  icon?: string;
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
  showAction?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📚',
  title,
  message,
  actionText,
  onAction,
  showAction = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      
      {showAction && onAction && actionText && (
        <Button
          title={actionText}
          onPress={onAction}
          style={styles.actionButton}
          textStyle={styles.actionButtonText}
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
    fontSize: 64,
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
    maxWidth: 280,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
  },
  actionButtonText: {
    ...FONTS.body4,
    color: COLORS.white,
    fontWeight: '600',
  },
});

export default EmptyState; 