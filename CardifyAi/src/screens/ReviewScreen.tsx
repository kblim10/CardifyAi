import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Card as CardType } from '../services/srs';
import { calculateNextReview } from '../services/srs';
import { storage } from '../services/storage';
import { cardsAPI } from '../services/api';
import Card from '../components/Card';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type ReviewScreenProps = NativeStackScreenProps<RootStackParamList, 'Review'>;

const ReviewScreen: React.FC<ReviewScreenProps> = ({ route, navigation }) => {
  const { deckId } = route.params;
  const [cards, setCards] = useState<CardType[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reviewComplete, setReviewComplete] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    reviewed: 0,
    easy: 0,
    hard: 0,
  });

  useEffect(() => {
    loadDueCards();
  }, [deckId]);

  const loadDueCards = async () => {
    try {
      setLoading(true);
      
      // Get all cards for the deck
      const allCards = await storage.getCardsByDeckId(deckId);
      
      // Filter due cards
      const now = new Date();
      const dueCards = allCards.filter(card => {
        const dueDate = new Date(card.srsData.dueDate);
        return dueDate <= now;
      });
      
      // Shuffle cards
      const shuffledCards = [...dueCards].sort(() => Math.random() - 0.5);
      
      setCards(shuffledCards);
      setStats({
        total: shuffledCards.length,
        reviewed: 0,
        easy: 0,
        hard: 0,
      });
    } catch (error) {
      console.error('Error loading due cards:', error);
      Alert.alert('Error', 'Gagal memuat kartu untuk review');
    } finally {
      setLoading(false);
    }
  };

  const handleSwipeLeft = async () => {
    // Hard
    await updateCardSRS(1);
    
    setStats(prev => ({
      ...prev,
      reviewed: prev.reviewed + 1,
      hard: prev.hard + 1,
    }));
    
    moveToNextCard();
  };

  const handleSwipeRight = async () => {
    // Easy
    await updateCardSRS(4);
    
    setStats(prev => ({
      ...prev,
      reviewed: prev.reviewed + 1,
      easy: prev.easy + 1,
    }));
    
    moveToNextCard();
  };

  const updateCardSRS = async (quality: number) => {
    try {
      const currentCard = cards[currentCardIndex];
      
      // Calculate new SRS data
      const newSrsData = calculateNextReview(quality, currentCard.srsData);
      
      // Update local storage
      await storage.updateCardSRS(currentCard.id, newSrsData);
      
      // Try to update on server
      try {
        await cardsAPI.updateCardSRS(currentCard.id, newSrsData);
      } catch (apiError) {
        console.log('Failed to update card SRS on server:', apiError);
        // Continue anyway, we've updated locally
      }
    } catch (error) {
      console.error('Error updating card SRS:', error);
    }
  };

  const moveToNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setReviewComplete(true);
    }
  };

  const handleFinishReview = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    );
  }

  if (cards.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="check-circle-outline" size={80} color="#4CAF50" />
        <Text style={styles.emptyTitle}>Tidak Ada Kartu</Text>
        <Text style={styles.emptySubtitle}>
          Semua kartu sudah direview. Kembali lagi nanti.
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (reviewComplete) {
    return (
      <View style={styles.completeContainer}>
        <Icon name="check-circle" size={80} color="#4CAF50" />
        <Text style={styles.completeTitle}>Review Selesai!</Text>
        <Text style={styles.completeSubtitle}>
          Anda telah menyelesaikan semua kartu yang jatuh tempo.
        </Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.easy}</Text>
            <Text style={[styles.statLabel, { color: '#4CAF50' }]}>Mudah</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.hard}</Text>
            <Text style={[styles.statLabel, { color: '#FF5252' }]}>Sulit</Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.finishButton}
          onPress={handleFinishReview}>
          <Text style={styles.finishButtonText}>Selesai</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentCard = cards[currentCardIndex];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}>
          <Icon name="close" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.progress}>
          {currentCardIndex + 1} / {cards.length}
        </Text>
      </View>

      <View style={styles.cardContainer}>
        <Card
          frontContent={currentCard.frontContent}
          backContent={currentCard.backContent}
          mediaPath={currentCard.mediaPath}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.hardButton]}
          onPress={handleSwipeLeft}>
          <Icon name="thumb-down" size={24} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Sulit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.easyButton]}
          onPress={handleSwipeRight}>
          <Icon name="thumb-up" size={24} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Mudah</Text>
        </TouchableOpacity>
      </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  closeButton: {
    padding: 8,
  },
  progress: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
  },
  hardButton: {
    backgroundColor: '#FF5252',
  },
  easyButton: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  completeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  completeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 16,
  },
  completeSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  finishButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 16,
  },
  finishButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ReviewScreen; 