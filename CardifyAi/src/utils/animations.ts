import { Animated, Easing } from 'react-native';

// Fade in animation
export const fadeIn = (value: Animated.Value, duration: number = 300) => {
  Animated.timing(value, {
    toValue: 1,
    duration,
    useNativeDriver: true,
  }).start();
};

// Fade out animation
export const fadeOut = (value: Animated.Value, duration: number = 300) => {
  Animated.timing(value, {
    toValue: 0,
    duration,
    useNativeDriver: true,
  }).start();
};

// Slide in from bottom
export const slideInFromBottom = (value: Animated.Value, duration: number = 300) => {
  Animated.timing(value, {
    toValue: 0,
    duration,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  }).start();
};

// Slide out to bottom
export const slideOutToBottom = (value: Animated.Value, duration: number = 300) => {
  Animated.timing(value, {
    toValue: 100,
    duration,
    easing: Easing.in(Easing.cubic),
    useNativeDriver: true,
  }).start();
};

// Scale animation
export const scale = (value: Animated.Value, toValue: number, duration: number = 300) => {
  Animated.timing(value, {
    toValue,
    duration,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  }).start();
};

// Bounce animation
export const bounce = (value: Animated.Value) => {
  Animated.sequence([
    Animated.timing(value, {
      toValue: 1.1,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(value, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }),
  ]).start();
};

// Shake animation
export const shake = (value: Animated.Value) => {
  Animated.sequence([
    Animated.timing(value, {
      toValue: 10,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(value, {
      toValue: -10,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(value, {
      toValue: 10,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(value, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }),
  ]).start();
};

// Pulse animation
export const pulse = (value: Animated.Value) => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(value, {
        toValue: 1.1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(value, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ])
  ).start();
};

// Flip animation for cards
export const flipCard = (value: Animated.Value, duration: number = 300) => {
  Animated.timing(value, {
    toValue: 180,
    duration,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  }).start();
};

// Swipe animation for cards
export const swipeCard = (
  translateX: Animated.Value,
  translateY: Animated.Value,
  direction: 'left' | 'right' | 'up' | 'down',
  duration: number = 300
) => {
  const screenWidth = 400; // Approximate screen width
  const screenHeight = 800; // Approximate screen height

  let toValueX = 0;
  let toValueY = 0;

  switch (direction) {
    case 'left':
      toValueX = -screenWidth;
      break;
    case 'right':
      toValueX = screenWidth;
      break;
    case 'up':
      toValueY = -screenHeight;
      break;
    case 'down':
      toValueY = screenHeight;
      break;
  }

  Animated.parallel([
    Animated.timing(translateX, {
      toValue: toValueX,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }),
    Animated.timing(translateY, {
      toValue: toValueY,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }),
  ]).start();
};

// Reset card position
export const resetCardPosition = (
  translateX: Animated.Value,
  translateY: Animated.Value,
  duration: number = 200
) => {
  Animated.parallel([
    Animated.timing(translateX, {
      toValue: 0,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }),
    Animated.timing(translateY, {
      toValue: 0,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }),
  ]).start();
};

// Loading spinner animation
export const spin = (value: Animated.Value) => {
  Animated.loop(
    Animated.timing(value, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    })
  ).start();
};

// Progress bar animation
export const animateProgress = (value: Animated.Value, toValue: number, duration: number = 1000) => {
  Animated.timing(value, {
    toValue,
    duration,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: false,
  }).start();
};

// Stagger animation for lists
export const staggerAnimation = (
  values: Animated.Value[],
  delay: number = 100,
  duration: number = 300
) => {
  const animations = values.map((value, index) =>
    Animated.timing(value, {
      toValue: 1,
      duration,
      delay: index * delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    })
  );

  Animated.stagger(delay, animations).start();
};

// Create animated values with initial values
export const createAnimatedValues = (initialValues: { [key: string]: number }) => {
  const animatedValues: { [key: string]: Animated.Value } = {};
  
  Object.keys(initialValues).forEach(key => {
    animatedValues[key] = new Animated.Value(initialValues[key]);
  });
  
  return animatedValues;
}; 