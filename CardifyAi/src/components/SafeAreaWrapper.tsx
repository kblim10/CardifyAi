import React from 'react';
import { View, StatusBar, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

interface SafeAreaWrapperProps {
  children: React.ReactNode;
  backgroundColor?: string;
  statusBarStyle?: 'light-content' | 'dark-content' | 'default';
  showStatusBar?: boolean;
}

// Hook untuk mendapatkan safe area insets
export const useSafeArea = () => {
  return useSafeAreaInsets();
};

// Komponen wrapper dengan safe area
export const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({
  children,
  backgroundColor = '#ffffff',
  statusBarStyle = 'dark-content',
  showStatusBar = true,
}) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={backgroundColor}
        translucent={Platform.OS === 'android'}
        hidden={!showStatusBar}
      />
      {children}
    </SafeAreaView>
  );
};

// Provider yang harus dibungkus di root aplikasi
export const SafeAreaRoot: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <SafeAreaProvider>{children}</SafeAreaProvider>;
};

// Komponen untuk mendapatkan padding manual jika diperlukan
export const SafePaddingView: React.FC<{
  children: React.ReactNode;
  style?: any;
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
}> = ({ children, style, top = true, bottom = true, left = true, right = true }) => {
  const insets = useSafeAreaInsets();

  const paddingStyle = {
    paddingTop: top ? insets.top : 0,
    paddingBottom: bottom ? insets.bottom : 0,
    paddingLeft: left ? insets.left : 0,
    paddingRight: right ? insets.right : 0,
  };

  return <View style={[paddingStyle, style]}>{children}</View>;
};

export default SafeAreaWrapper;
