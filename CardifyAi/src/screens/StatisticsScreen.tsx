import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList } from '../navigation/AppNavigator';
import { storage } from '../services/storage';
import { getReviewStats } from '../services/srs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaWrapper } from '../components/SafeAreaWrapper';

type StatisticsScreenProps = NativeStackScreenProps<MainTabParamList, 'Statistics'>;

const { width } = Dimensions.get('window');

const StatisticsScreen: React.FC<StatisticsScreenProps> = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalDecks: 0,
    totalCards: 0,
    dueToday: 0,
    dueTomorrow: 0,
    dueThisWeek: 0,
    reviewedToday: 0,
    streakDays: 0,
    completionRate: 0,
  });
  const [weeklyActivity, setWeeklyActivity] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [deckStats, setDeckStats] = useState<Array<{name: string, cardCount: number, dueCount: number}>>([]);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      
      // Get decks and cards
      const decks = await storage.getDecks();
      const cards = await storage.getCards();
      
      // Calculate statistics
      const reviewStats = getReviewStats(cards);
      
      // Calculate deck-specific stats
      const deckStatsData = decks.map(deck => {
        const deckCards = cards.filter(card => card.deckId === deck.id);
        const dueCards = deckCards.filter(card => {
          const dueDate = new Date(card.srsData.dueDate);
          return dueDate <= new Date();
        });
        
        return {
          name: deck.title,
          cardCount: deckCards.length,
          dueCount: dueCards.length,
        };
      });
      
      // Sort decks by card count (descending)
      deckStatsData.sort((a, b) => b.cardCount - a.cardCount);
      
      // Calculate weekly activity (mock data for now)
      // In a real app, this would be calculated from actual review history
      const mockWeeklyActivity = [5, 12, 8, 15, 10, 7, 9];
      
      // Calculate streak days (mock data for now)
      // In a real app, this would be calculated from actual review history
      const mockStreakDays = 5;
      
      // Calculate completion rate
      const completionRate = reviewStats.dueToday > 0 
        ? Math.min(100, Math.round((reviewStats.reviewedToday / reviewStats.dueToday) * 100))
        : 100;
      
      setStats({
        totalDecks: decks.length,
        totalCards: cards.length,
        dueToday: reviewStats.dueToday,
        dueTomorrow: reviewStats.dueTomorrow,
        dueThisWeek: reviewStats.dueThisWeek,
        reviewedToday: reviewStats.reviewedToday,
        streakDays: mockStreakDays,
        completionRate,
      });
      
      setWeeklyActivity(mockWeeklyActivity);
      setDeckStats(deckStatsData.slice(0, 5)); // Show top 5 decks
      
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadStatistics();
  };

  const weekDays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  const maxActivity = Math.max(...weeklyActivity, 1);

  if (loading && !refreshing) {
    return (
      <SafeAreaWrapper>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200EE" />
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
      <Text style={styles.title}>Statistik Belajar</Text>

      {/* Overview */}
      <View style={styles.overviewContainer}>
        <View style={styles.statCard}>
          <Icon name="cards" size={24} color="#6200EE" />
          <Text style={styles.statValue}>{stats.totalCards}</Text>
          <Text style={styles.statLabel}>Total Kartu</Text>
        </View>
        
        <View style={styles.statCard}>
          <Icon name="book-open-variant" size={24} color="#6200EE" />
          <Text style={styles.statValue}>{stats.totalDecks}</Text>
          <Text style={styles.statLabel}>Total Deck</Text>
        </View>
        
        <View style={styles.statCard}>
          <Icon name="fire" size={24} color="#FF9800" />
          <Text style={styles.statValue}>{stats.streakDays}</Text>
          <Text style={styles.statLabel}>Streak Hari</Text>
        </View>
      </View>

      {/* Progress */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Progress Hari Ini</Text>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressTextContainer}>
            <Text style={styles.progressValue}>{stats.reviewedToday}/{stats.dueToday}</Text>
            <Text style={styles.progressLabel}>Kartu Direview</Text>
          </View>
          
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${stats.completionRate}%` }
              ]} 
            />
            <Text style={styles.progressPercentage}>{stats.completionRate}%</Text>
          </View>
        </View>
      </View>

      {/* Weekly Activity */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Aktivitas Mingguan</Text>
        
        <View style={styles.activityContainer}>
          {weeklyActivity.map((count, index) => (
            <View key={index} style={styles.activityColumn}>
              <View style={styles.activityBarContainer}>
                <View 
                  style={[
                    styles.activityBar, 
                    { height: `${(count / maxActivity) * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.activityDay}>{weekDays[index]}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Due Cards */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Kartu Jatuh Tempo</Text>
        
        <View style={styles.dueCardsContainer}>
          <View style={styles.dueCardItem}>
            <View style={[styles.dueIndicator, styles.dueTodayIndicator]} />
            <Text style={styles.dueCardCount}>{stats.dueToday}</Text>
            <Text style={styles.dueCardLabel}>Hari Ini</Text>
          </View>
          
          <View style={styles.dueCardItem}>
            <View style={[styles.dueIndicator, styles.dueTomorrowIndicator]} />
            <Text style={styles.dueCardCount}>{stats.dueTomorrow}</Text>
            <Text style={styles.dueCardLabel}>Besok</Text>
          </View>
          
          <View style={styles.dueCardItem}>
            <View style={[styles.dueIndicator, styles.dueWeekIndicator]} />
            <Text style={styles.dueCardCount}>{stats.dueThisWeek}</Text>
            <Text style={styles.dueCardLabel}>Minggu Ini</Text>
          </View>
        </View>
      </View>

      {/* Deck Statistics */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Statistik Deck</Text>
        
        {deckStats.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Belum ada deck</Text>
          </View>
        ) : (
          deckStats.map((deck, index) => (
            <View key={index} style={styles.deckStatItem}>
              <View style={styles.deckStatHeader}>
                <Text style={styles.deckStatName} numberOfLines={1}>{deck.name}</Text>
                <Text style={styles.deckStatCount}>{deck.cardCount} kartu</Text>
              </View>
              
              <View style={styles.deckStatProgress}>
                <View 
                  style={[
                    styles.deckStatProgressBar, 
                    { width: `${deck.dueCount > 0 ? (deck.dueCount / deck.cardCount) * 100 : 0}%` }
                  ]} 
                />
              </View>
              
              <Text style={styles.deckStatDue}>
                {deck.dueCount} kartu jatuh tempo
              </Text>
            </View>
          ))
        )}
      </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 24,
  },
  overviewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: (width - 48) / 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  progressContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  progressTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginRight: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#666666',
  },
  progressBarContainer: {
    height: 20,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#6200EE',
    borderRadius: 10,
  },
  progressPercentage: {
    position: 'absolute',
    right: 8,
    top: 2,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  activityContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    height: 200,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  activityColumn: {
    alignItems: 'center',
    width: (width - 64) / 7,
  },
  activityBarContainer: {
    height: 140,
    width: 16,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  activityBar: {
    width: '100%',
    backgroundColor: '#6200EE',
    borderRadius: 8,
  },
  activityDay: {
    marginTop: 8,
    fontSize: 12,
    color: '#666666',
  },
  dueCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dueCardItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: (width - 48) / 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  dueIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  dueTodayIndicator: {
    backgroundColor: '#FF5252',
  },
  dueTomorrowIndicator: {
    backgroundColor: '#FFC107',
  },
  dueWeekIndicator: {
    backgroundColor: '#4CAF50',
  },
  dueCardCount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  dueCardLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  deckStatItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  deckStatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deckStatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
  },
  deckStatCount: {
    fontSize: 14,
    color: '#666666',
  },
  deckStatProgress: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  deckStatProgressBar: {
    height: '100%',
    backgroundColor: '#FF5252',
    borderRadius: 4,
  },
  deckStatDue: {
    fontSize: 12,
    color: '#FF5252',
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999999',
  },
});

export default StatisticsScreen; 