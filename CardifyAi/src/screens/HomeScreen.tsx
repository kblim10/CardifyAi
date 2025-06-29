import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList } from '../navigation/AppNavigator';
import DeckCard from '../components/DeckCard';
import Button from '../components/Button';
import { Deck } from '../services/storage';
import { decksAPI } from '../services/api';
import { storage } from '../services/storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type HomeScreenProps = NativeStackScreenProps<MainTabParamList, 'Home'>;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [dueCardCounts, setDueCardCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    loadUserData();
    loadDecks();
    
    // Add listener for when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadDecks();
    });
    
    return unsubscribe;
  }, [navigation]);

  const loadUserData = async () => {
    const userData = await storage.getUser();
    setUser(userData);
  };

  const loadDecks = async () => {
    try {
      setLoading(true);
      
      // Debug: Check if token exists
      const token = await storage.getToken();
      console.log('Token exists:', !!token);
      console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'No token');
      
      // Try to get decks from API
      try {
        // Use public endpoint temporarily for testing
        const response = await decksAPI.getDecks();
        const apiDecks = response.data.data;
        
        // Save decks to local storage
        await storage.saveDecks(apiDecks);
        
        // Debug: Log deck data
        console.log('API Decks loaded:', apiDecks.length);
        if (apiDecks.length > 0) {
          console.log('First deck:', JSON.stringify(apiDecks[0], null, 2));
        }
        
        // Update state
        setDecks(apiDecks);
      } catch (apiError) {
        console.log('Failed to fetch from API, using local data', apiError);
        
        // If API fails, load from local storage
        const localDecks = await storage.getDecks();
        console.log('Local Decks loaded:', localDecks.length);
        if (localDecks.length > 0) {
          console.log('First local deck:', JSON.stringify(localDecks[0], null, 2));
        }
        setDecks(localDecks);
      }
      
      // Load due card counts
      await loadDueCardCounts();
    } catch (error) {
      console.error('Error loading decks:', error);
      Alert.alert('Error', 'Gagal memuat deck');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadDueCardCounts = async () => {
    try {
      const allCards = await storage.getCards();
      const counts: Record<string, number> = {};
      
      // Get current date
      const now = new Date();
      
      // Count due cards for each deck
      allCards.forEach(card => {
        const dueDate = new Date(card.srsData.dueDate);
        if (dueDate <= now) {
          counts[card.deckId] = (counts[card.deckId] || 0) + 1;
        }
      });
      
      setDueCardCounts(counts);
    } catch (error) {
      console.error('Error loading due card counts:', error);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadDecks();
  };

  const handleDeckPress = (deckId: string) => {
    console.log('Navigating to DeckDetail with deckId:', deckId);
    navigation.navigate('DeckDetail' as any, { deckId });
  };

  const handleCreateDeck = () => {
    navigation.navigate('CreateDeck' as any);
  };

  const renderDeckItem = ({ item }: { item: Deck }) => (
    <DeckCard
      title={item.title}
      description={item.description}
      coverImagePath={item.coverImagePath}
      cardCount={0} // This would be replaced with actual card count
      dueCardCount={dueCardCounts[item.id] || 0}
      onPress={() => handleDeckPress(item.id)}
    />
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>
            Halo, {user?.name || 'Pengguna'}!
          </Text>
          <Text style={styles.subTitle}>Apa yang ingin kamu pelajari hari ini?</Text>
        </View>
        <TouchableOpacity style={styles.scanButton} onPress={() => navigation.navigate('Scan' as any)}>
          <Icon name="camera" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {decks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="cards-outline" size={80} color="#CCCCCC" />
          <Text style={styles.emptyText}>Belum ada deck</Text>
          <Text style={styles.emptySubText}>
            Mulai buat deck untuk menyimpan flashcard Anda
          </Text>
          <Button
            title="Buat Deck Baru"
            onPress={handleCreateDeck}
            style={styles.createDeckButton}
          />
        </View>
      ) : (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Deck Saya</Text>
            <TouchableOpacity onPress={handleCreateDeck}>
              <Text style={styles.seeAllText}>+ Buat Baru</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={decks}
            renderItem={renderDeckItem}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={styles.deckRow}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
            contentContainerStyle={styles.deckList}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  subTitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  scanButton: {
    backgroundColor: '#6200EE',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#6200EE',
    fontWeight: '500',
  },
  deckRow: {
    justifyContent: 'space-between',
  },
  deckList: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  createDeckButton: {
    width: '80%',
  },
});

export default HomeScreen;