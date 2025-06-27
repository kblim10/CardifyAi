# CardifyAi Components Documentation

## Overview
This document describes all the reusable components in the CardifyAi application. All components are built with TypeScript and follow React Native best practices.

## Component Structure
```
src/components/
├── Button.tsx
├── Card.tsx
├── DeckCard.tsx
├── Input.tsx
├── LoadingSpinner.tsx
├── ErrorView.tsx
├── EmptyState.tsx
└── Header.tsx
```

---

## Button Component

A customizable button component with various styles and states.

### Props
```typescript
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
}
```

### Usage
```tsx
import Button from '../components/Button';

// Primary button
<Button 
  title="Save" 
  onPress={handleSave} 
  variant="primary" 
/>

// Secondary button with icon
<Button 
  title="Add Card" 
  onPress={handleAddCard}
  variant="secondary"
  icon={<Icon name="plus" />}
  iconPosition="left"
/>

// Disabled button
<Button 
  title="Submit" 
  onPress={handleSubmit}
  disabled={!isValid}
  loading={isSubmitting}
/>
```

### Variants
- **primary**: Blue background with white text
- **secondary**: Orange background with white text
- **outline**: Transparent background with colored border
- **ghost**: Transparent background with colored text

### Sizes
- **small**: 32px height
- **medium**: 44px height (default)
- **large**: 56px height

---

## Card Component

A flashcard component with flip animation and swipe gestures.

### Props
```typescript
interface CardProps {
  card: Card;
  onFlip?: () => void;
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down') => void;
  showAnswer?: boolean;
  onShowAnswer?: () => void;
  onHideAnswer?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
```

### Usage
```tsx
import Card from '../components/Card';

<Card 
  card={currentCard}
  onFlip={handleFlip}
  onSwipe={handleSwipe}
  showAnswer={isAnswerVisible}
  onShowAnswer={showAnswer}
  onHideAnswer={hideAnswer}
/>
```

### Features
- **Flip Animation**: Smooth 3D flip animation
- **Swipe Gestures**: Support for left, right, up, down swipes
- **Answer Toggle**: Show/hide answer functionality
- **Responsive Design**: Adapts to different screen sizes

---

## DeckCard Component

A card component for displaying deck information in lists.

### Props
```typescript
interface DeckCardProps {
  deck: Deck;
  onPress?: () => void;
  onLongPress?: () => void;
  showMenu?: boolean;
  onMenuPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
```

### Usage
```tsx
import DeckCard from '../components/DeckCard';

<DeckCard 
  deck={deck}
  onPress={() => navigation.navigate('DeckDetail', { deckId: deck.id })}
  onLongPress={showDeckOptions}
  showMenu={true}
  onMenuPress={handleMenuPress}
/>
```

### Features
- **Deck Information**: Shows title, description, card count, and last reviewed date
- **Cover Image**: Displays deck cover image if available
- **Tags**: Shows deck tags
- **Interactive**: Press and long press handlers
- **Menu**: Optional menu button for additional actions

---

## Input Component

A customizable input component with validation and error handling.

### Props
```typescript
interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  error?: string;
  disabled?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  testID?: string;
}
```

### Usage
```tsx
import Input from '../components/Input';

<Input 
  label="Email"
  placeholder="Enter your email"
  value={email}
  onChangeText={setEmail}
  error={emailError}
  keyboardType="email-address"
  autoCapitalize="none"
  leftIcon={<Icon name="email" />}
/>

<Input 
  label="Password"
  placeholder="Enter your password"
  value={password}
  onChangeText={setPassword}
  secureTextEntry={!showPassword}
  rightIcon={<Icon name={showPassword ? "eye-off" : "eye"} />}
  onRightIconPress={togglePasswordVisibility}
/>
```

### Features
- **Label**: Optional label above input
- **Error Handling**: Displays error messages below input
- **Icons**: Left and right icons with press handlers
- **Validation**: Visual feedback for validation states
- **Accessibility**: Proper accessibility labels and hints

---

## LoadingSpinner Component

A loading indicator component with customizable appearance.

### Props
```typescript
interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  fullScreen?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
```

### Usage
```tsx
import LoadingSpinner from '../components/LoadingSpinner';

// Small spinner
<LoadingSpinner size="small" />

// Large spinner with text
<LoadingSpinner 
  size="large" 
  text="Loading cards..." 
/>

// Full screen loading
<LoadingSpinner 
  fullScreen={true}
  text="Syncing data..." 
/>
```

### Features
- **Multiple Sizes**: Small and large spinner options
- **Custom Colors**: Configurable spinner color
- **Loading Text**: Optional text below spinner
- **Full Screen**: Option to cover entire screen

---

## ErrorView Component

A component for displaying error states with retry functionality.

### Props
```typescript
interface ErrorViewProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
  showIcon?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
```

### Usage
```tsx
import ErrorView from '../components/ErrorView';

<ErrorView 
  title="Connection Error"
  message="Unable to connect to server. Please check your internet connection."
  onRetry={retryConnection}
  retryText="Try Again"
  showIcon={true}
/>
```

### Features
- **Error Icon**: Optional warning icon
- **Retry Button**: Optional retry functionality
- **Customizable Text**: Configurable title and message
- **Full Screen**: Can be used as full screen error state

---

## EmptyState Component

A component for displaying empty states with call-to-action buttons.

### Props
```typescript
interface EmptyStateProps {
  icon?: string;
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
  showAction?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
```

### Usage
```tsx
import EmptyState from '../components/EmptyState';

<EmptyState 
  icon="📚"
  title="No Decks Yet"
  message="Create your first deck to start learning"
  actionText="Create Deck"
  onAction={createFirstDeck}
  showAction={true}
/>
```

### Features
- **Custom Icon**: Emoji or custom icon support
- **Action Button**: Optional call-to-action button
- **Responsive Layout**: Adapts to different screen sizes
- **Consistent Styling**: Matches app design system

---

## Header Component

A navigation header component with back button and title.

### Props
```typescript
interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightComponent?: React.ReactNode;
  transparent?: boolean;
  titleStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
```

### Usage
```tsx
import Header from '../components/Header';

<Header 
  title="Create Deck"
  showBack={true}
  onBack={() => navigation.goBack()}
  rightComponent={<Button title="Save" onPress={handleSave} />}
/>

<Header 
  title="CardifyAi"
  transparent={true}
  rightComponent={<Icon name="settings" onPress={openSettings} />}
/>
```

### Features
- **Back Button**: Optional back navigation
- **Custom Title**: Configurable title text and style
- **Right Component**: Optional right-side component
- **Transparent Mode**: Option for transparent background
- **Status Bar**: Automatic status bar handling

---

## Component Guidelines

### Styling
- All components use the app's theme system
- Colors, fonts, and spacing are consistent
- Components are responsive and work on different screen sizes

### Accessibility
- All interactive elements have proper accessibility labels
- Touch targets meet minimum size requirements (44px)
- Color contrast meets WCAG guidelines
- Screen reader support for all components

### Performance
- Components are optimized for performance
- Use React.memo for expensive components
- Avoid unnecessary re-renders
- Lazy load images and heavy content

### Testing
- All components have unit tests
- Include integration tests for complex interactions
- Test accessibility features
- Performance testing for animations

### Usage Examples

#### Form with Validation
```tsx
const [email, setEmail] = useState('');
const [emailError, setEmailError] = useState('');

const validateEmail = (text: string) => {
  if (!text) {
    setEmailError('Email is required');
  } else if (!isValidEmail(text)) {
    setEmailError('Invalid email format');
  } else {
    setEmailError('');
  }
};

<Input 
  label="Email"
  value={email}
  onChangeText={(text) => {
    setEmail(text);
    validateEmail(text);
  }}
  error={emailError}
  keyboardType="email-address"
/>
```

#### Loading State with Error Handling
```tsx
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');

const loadData = async () => {
  setLoading(true);
  setError('');
  
  try {
    const data = await api.getData();
    setData(data);
  } catch (err) {
    setError('Failed to load data');
  } finally {
    setLoading(false);
  }
};

if (loading) {
  return <LoadingSpinner text="Loading..." />;
}

if (error) {
  return (
    <ErrorView 
      message={error}
      onRetry={loadData}
    />
  );
}
```

#### Empty State with Action
```tsx
const decks = useDecks();

if (decks.length === 0) {
  return (
    <EmptyState 
      icon="📚"
      title="No Decks Yet"
      message="Create your first deck to start learning"
      actionText="Create Deck"
      onAction={() => navigation.navigate('CreateDeck')}
      showAction={true}
    />
  );
}
```

---

## Theme Integration

All components use the app's theme system:

```tsx
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    ...SHADOWS.light,
  },
  title: {
    ...FONTS.h3,
    color: COLORS.text,
  },
});
```

This ensures consistency across the entire application and makes it easy to implement dark mode or other theme variations. 