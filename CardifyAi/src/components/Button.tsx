import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  type = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const getButtonStyle = () => {
    let buttonStyle: ViewStyle = { ...styles.button };

    // Type styles
    if (type === 'primary') {
      buttonStyle = { ...buttonStyle, ...styles.primaryButton };
    } else if (type === 'secondary') {
      buttonStyle = { ...buttonStyle, ...styles.secondaryButton };
    } else if (type === 'outline') {
      buttonStyle = { ...buttonStyle, ...styles.outlineButton };
    }

    // Size styles
    if (size === 'small') {
      buttonStyle = { ...buttonStyle, ...styles.smallButton };
    } else if (size === 'large') {
      buttonStyle = { ...buttonStyle, ...styles.largeButton };
    }

    // Disabled style
    if (disabled) {
      buttonStyle = { ...buttonStyle, ...styles.disabledButton };
    }

    return buttonStyle;
  };

  const getTextStyle = () => {
    let textStyleVar: TextStyle = { ...styles.buttonText };

    // Type styles
    if (type === 'primary') {
      textStyleVar = { ...textStyleVar, ...styles.primaryText };
    } else if (type === 'secondary') {
      textStyleVar = { ...textStyleVar, ...styles.secondaryText };
    } else if (type === 'outline') {
      textStyleVar = { ...textStyleVar, ...styles.outlineText };
    }

    // Size styles
    if (size === 'small') {
      textStyleVar = { ...textStyleVar, ...styles.smallText };
    } else if (size === 'large') {
      textStyleVar = { ...textStyleVar, ...styles.largeText };
    }

    // Disabled style
    if (disabled) {
      textStyleVar = { ...textStyleVar, ...styles.disabledText };
    }

    return textStyleVar;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={type === 'outline' ? '#6200EE' : '#FFFFFF'}
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  primaryButton: {
    backgroundColor: '#6200EE',
  },
  secondaryButton: {
    backgroundColor: '#03DAC5',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#6200EE',
  },
  smallButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  largeButton: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
    borderColor: '#CCCCCC',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#000000',
  },
  outlineText: {
    color: '#6200EE',
  },
  smallText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 18,
  },
  disabledText: {
    color: '#666666',
  },
});

export default Button; 