import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Card } from '../services/srs';
import { Deck } from '../services/storage';
import { cardsAPI, decksAPI } from '../services/api';
import { storage } from '../services/storage';
import Button from '../components/Button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type DeckDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'DeckDetail'>;

const DeckDetailScreen: React.FC<DeckDetailScreenProps> = ({ route, navigation }) => {
  const { deckId } = route.params;
  const [deck, setDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dueCardCount, setDueCardCount] = useState(0);

  useEffect(() => {
    loadDeck();
    loadCards();
    
    // Add listener for when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadCards();
    });
    
    return unsubscribe;
  }, [navigation, deckId]);

  const loadDeck = async () => {
    try {
      // Try to get deck from API
      try {
        const response = await decksAPI.getDeck(deckId);
        const apiDeck = response.data.data;
        
        // Save deck to local storage
        await storage.saveDecks([apiDeck]);
        
        // Update state
        setDeck(apiDeck);
      } catch (apiError) {
        console.log('Failed to fetch deck from API, using local data', apiError);
        
        // If API fails, load from local storage
        const localDeck = await storage.getDeck(deckId);
        setDeck(localDeck);
      }
    } catch (error) {
      console.error('Error loading deck:', error);
      Alert.alert('Error', 'Gagal memuat detail deck');
    }
  };

  const loadCards = async () => {
    try {
      setLoading(true);
      
      // Try to get cards from API
      try {
        const response = await cardsAPI.getDeckCards(deckId);
        const apiCards = response.data.data;
        
        // Save cards to local storage
        await storage.saveCards(apiCards);
        
        // Update state
        setCards(apiCards);
        
        // Count due cards
        const now = new Date();
        const dueCards = apiCards.filter(card => {
          const dueDate = new Date(card.srsData.dueDate);
          return dueDate <= now;
        });
        setDueCardCount(dueCards.length);
      } catch (apiError) {
        console.log('Failed to fetch cards from API, using local data', apiError);
        
        // If API fails, load from local storage
        const localCards = await storage.getCardsByDeckId(deckId);
        setCards(localCards);
        
        // Count due cards
        const now = new Date();
        const dueCards = localCards.filter(card => {
          const dueDate = new Date(card.srsData.dueDate);
          return dueDate <= now;
        });
        setDueCardCount(dueCards.length);
      }
    } catch (error) {
      console.error('Error loading cards:', error);
      Alert.alert('Error', 'Gagal memuat kartu');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadDeck();
    loadCards();
  };

  const handleStartReview = () => {
    navigation.navigate('Review', { deckId });
  };

  const handleCreateCard = () => {
    navigation.navigate('CreateCard', { deckId });
  };

  const handleDeleteDeck = async () => {
    Alert.alert(
      'Hapus Deck',
      'Apakah Anda yakin ingin menghapus deck ini? Semua kartu di dalamnya juga akan dihapus.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await decksAPI.deleteDeck(deckId);
              await storage.deleteDeck(deckId);
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting deck:', error);
              Alert.alert('Error', 'Gagal menghapus deck');
            }
          },
        },
      ]
    );
  };

  const renderCardItem = ({ item }: { item: Card }) => (
    <TouchableOpacity style={styles.cardItem}>
      <View style={styles.cardContent}>
        <Text style={styles.cardFront} numberOfLines={2}>{item.frontContent}</Text>
        <Icon name="chevron-right" size={24} color="#CCCCCC" />
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing && !deck) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Deck Header */}
      <View style={styles.deckHeader}>
        <View style={styles.deckInfo}>
          <Text style={styles.deckTitle}>{deck?.title || 'Loading...'}</Text>
          {deck?.description && (
            <Text style={styles.deckDescription}>{deck.description}</Text>
          )}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{cards.length}</Text>
              <Text style={styles.statLabel}>Kartu</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{dueCardCount}</Text>
              <Text style={styles.statLabel}>Jatuh Tempo</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <Button
          title="Mulai Review"
          onPress={handleStartReview}
          disabled={cards.length === 0}
          style={[styles.actionButton, cards.length === 0 && styles.disabledButton]}
        />
        <Button
          title="Tambah Kartu"
          onPress={handleCreateCard}
          type="outline"
          style={styles.actionButton}
        />
      </View>

      {/* Cards List */}
      <View style={styles.cardsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Kartu</Text>
          <TouchableOpacity onPress={handleCreateCard}>
            <Text style={styles.addCardText}>+ Tambah</Text>
          </TouchableOpacity>
        </View>

        {cards.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="cards" size={64} color="#CCCCCC" />
            <Text style={styles.emptyText}>Belum ada kartu</Text>
            <Text style={styles.emptySubText}>
              Tambahkan kartu untuk mulai belajar
            </Text>
          </View>
        ) : (
          <FlatList
            data={cards}
            renderItem={renderCardItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
            contentContainerStyle={styles.cardsList}
          />
        )}
      </View>

      {/* Delete Button */}
      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteDeck}>
        <Icon name="delete" size={20} color="#FF5252" />
        <Text style={styles.deleteText}>Hapus Deck</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deckHeader: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  deckInfo: {
    flex: 1,
  },
  deckTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  deckDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  statItem: {
    marginRight: 24,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
  },
  actionContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
  cardsContainer: {
    flex: 1,
    padding: 16,
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
  addCardText: {
    fontSize: 14,
    color: '#6200EE',
    fontWeight: '500',
  },
  cardsList: {
    paddingBottom: 16,
  },
  cardItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardFront: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
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
  },
  deleteButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  deleteText: {
    fontSize: 14,
    color: '#FF5252',
    marginLeft: 8,
  },
});

export default DeckDetailScreen; 