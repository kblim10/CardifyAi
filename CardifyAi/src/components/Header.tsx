import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../theme';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightComponent?: React.ReactNode;
  transparent?: boolean;
  titleStyle?: any;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBack,
  rightComponent,
  transparent = false,
  titleStyle,
}) => {
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.container, transparent && styles.transparent]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={transparent ? 'transparent' : COLORS.white}
        translucent
      />
      
      <View style={styles.content}>
        <View style={styles.leftContainer}>
          {showBack && (
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.titleContainer}>
          <Text style={[styles.title, titleStyle]} numberOfLines={1}>
            {title}
          </Text>
        </View>

        <View style={styles.rightContainer}>
          {rightComponent}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingTop: StatusBar.currentHeight || 44,
    paddingBottom: SIZES.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.light,
  },
  transparent: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    ...SHADOWS.none,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    height: 56,
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  backIcon: {
    fontSize: 24,
    color: COLORS.text,
    fontWeight: '600',
  },
  title: {
    ...FONTS.h4,
    color: COLORS.text,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Header; 