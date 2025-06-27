import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Image,
} from 'react-native';

interface CardProps {
  frontContent: string;
  backContent: string;
  mediaPath?: string;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = height * 0.6;

const Card: React.FC<CardProps> = ({
  frontContent,
  backContent,
  mediaPath,
  onSwipeLeft,
  onSwipeRight,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const animatedValue = new Animated.Value(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(
    null,
  );
  const swipeThreshold = 120;
  const swipeAnimatedValue = new Animated.Value(0);

  // Interpolate rotation for flip animation
  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = animatedValue.interpolate({
    inputRange: [89, 90],
    outputRange: [1, 0],
  });

  const backOpacity = animatedValue.interpolate({
    inputRange: [89, 90],
    outputRange: [0, 1],
  });

  // Interpolate for swipe animation
  const cardTranslateX = swipeAnimatedValue.interpolate({
    inputRange: [-swipeThreshold, 0, swipeThreshold],
    outputRange: [-width, 0, width],
    extrapolate: 'clamp',
  });

  const cardRotate = swipeAnimatedValue.interpolate({
    inputRange: [-swipeThreshold, 0, swipeThreshold],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const flipCard = () => {
    if (isFlipped) {
      Animated.spring(animatedValue, {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(animatedValue, {
        toValue: 180,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    }
    setIsFlipped(!isFlipped);
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    const toValue = direction === 'left' ? -width : width;
    
    Animated.timing(swipeAnimatedValue, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (direction === 'left' && onSwipeLeft) {
        onSwipeLeft();
      } else if (direction === 'right' && onSwipeRight) {
        onSwipeRight();
      }
      
      // Reset card position
      swipeAnimatedValue.setValue(0);
      setSwipeDirection(null);
    });
  };

  const frontAnimatedStyle = {
    transform: [
      { rotateY: frontInterpolate },
      { translateX: cardTranslateX },
      { rotate: cardRotate },
    ],
    opacity: frontOpacity,
  };

  const backAnimatedStyle = {
    transform: [
      { rotateY: backInterpolate },
      { translateX: cardTranslateX },
      { rotate: cardRotate },
    ],
    opacity: backOpacity,
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={1} onPress={flipCard}>
        <Animated.View style={[styles.card, frontAnimatedStyle]}>
          <View style={styles.cardContent}>
            {mediaPath && (
              <Image
                source={{ uri: mediaPath }}
                style={styles.media}
                resizeMode="contain"
              />
            )}
            <Text style={styles.cardText}>{frontContent}</Text>
          </View>
          <Text style={styles.flipHint}>Tap untuk membalik</Text>
        </Animated.View>

        <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
          <View style={styles.cardContent}>
            <Text style={styles.cardText}>{backContent}</Text>
          </View>
          <Text style={styles.flipHint}>Tap untuk membalik</Text>
        </Animated.View>
      </TouchableOpacity>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonLeft]}
          onPress={() => handleSwipe('left')}>
          <Text style={styles.actionButtonText}>Sulit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonRight]}
          onPress={() => handleSwipe('right')}>
          <Text style={styles.actionButtonText}>Mudah</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backfaceVisibility: 'hidden',
    justifyContent: 'space-between',
    padding: 20,
  },
  cardBack: {
    position: 'absolute',
    top: 0,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#333333',
  },
  flipHint: {
    textAlign: 'center',
    color: '#888888',
    fontSize: 12,
    marginTop: 10,
  },
  media: {
    width: '100%',
    height: 150,
    marginBottom: 20,
    borderRadius: 8,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: CARD_WIDTH,
    marginTop: 20,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  actionButtonLeft: {
    backgroundColor: '#FF5252',
  },
  actionButtonRight: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Card; 