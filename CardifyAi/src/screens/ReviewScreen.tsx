import React, { useState, useEffect, useCallback } from 'react';
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
import { SafeAreaWrapper } from '../components/SafeAreaWrapper';

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
  }, [deckId, loadDueCards]);

  const loadDueCards = useCallback(async () => {
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
  }, [deckId]);

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
      <SafeAreaWrapper>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200EE" />
        </View>
      </SafeAreaWrapper>
    );
  }

  if (cards.length === 0) {
    return (
      <SafeAreaWrapper>
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
      </SafeAreaWrapper>
    );
  }

  if (reviewComplete) {
    return (
      <SafeAreaWrapper>
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
              <Text style={[styles.statLabel, styles.easyLabel]}>Mudah</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.hard}</Text>
              <Text style={[styles.statLabel, styles.hardLabel]}>Sulit</Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.finishButton}
            onPress={handleFinishReview}>
            <Text style={styles.finishButtonText}>Selesai</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaWrapper>
    );
  }

  const currentCard = cards[currentCardIndex];

  return (
    <SafeAreaWrapper>
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
            card={currentCard}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
          />
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, styles.hardButton]}
            onPress={handleSwipeLeft}>
            <Icon name="thumb-down" size={24} color="#FFFFFF" />
            <Text style={styles.controlButtonText}>Sulit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.controlButton, styles.easyButton]}
            onPress={handleSwipeRight}>
            <Icon name="thumb-up" size={24} color="#FFFFFF" />
            <Text style={styles.controlButtonText}>Mudah</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaWrapper>
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
    fontWeight: '600',
    color: '#333333',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    paddingBottom: 32,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  hardButton: {
    backgroundColor: '#FF5252',
  },
  easyButton: {
    backgroundColor: '#4CAF50',
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  completeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  completeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 16,
    marginBottom: 8,
  },
  completeSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 32,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  easyLabel: {
    color: '#4CAF50',
  },
  hardLabel: {
    color: '#FF5252',
  },
  finishButton: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  finishButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ReviewScreen;