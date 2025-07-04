import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaRoot } from './src/components/SafeAreaWrapper';
import AppNavigator from './src/navigation/AppNavigator';
import { storage } from './src/services/storage';

function App(): React.JSX.Element {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize database
        await storage.initDatabase();
        
        // Set initialized flag
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };

    initializeApp();
  }, []);

  if (!isInitialized) {
    // Show loading screen or splash screen
    return (
      <SafeAreaRoot>
        <SafeAreaView style={styles.loadingContainer}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        </SafeAreaView>
      </SafeAreaRoot>
    );
  }

  return (
    <SafeAreaRoot>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <AppNavigator />
      </SafeAreaView>
    </SafeAreaRoot>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default App; 