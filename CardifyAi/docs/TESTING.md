# CardifyAi Testing Guide

## Overview
This guide covers testing strategies and implementation for the CardifyAi application, including unit tests, integration tests, and end-to-end tests.

## Testing Stack

### Frontend Testing
- **Jest**: Test runner and assertion library
- **React Native Testing Library**: Component testing utilities
- **@testing-library/jest-native**: Additional matchers
- **Mock Service Worker**: API mocking

### Backend Testing
- **Jest**: Test runner
- **Supertest**: HTTP assertion library
- **MongoDB Memory Server**: In-memory database for testing

## Test Structure

```
CardifyAi/
├── __tests__/
│   ├── components/
│   ├── screens/
│   ├── services/
│   ├── utils/
│   └── integration/
├── backend/
│   └── __tests__/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       └── utils/
└── e2e/
    ├── specs/
    └── support/
```

---

## Frontend Testing

### Component Testing

#### Example: Button Component Test

```typescript
// __tests__/components/Button.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../../src/components/Button';

describe('Button Component', () => {
  it('renders correctly with title', () => {
    const { getByText } = render(
      <Button title="Test Button" onPress={() => {}} />
    );
    
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={onPressMock} />
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={onPressMock} disabled={true} />
    );
    
    const button = getByText('Test Button');
    fireEvent.press(button);
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('shows loading state', () => {
    const { getByTestId } = render(
      <Button title="Test Button" onPress={() => {}} loading={true} />
    );
    
    expect(getByTestId('loading-spinner')).toBeTruthy();
  });
});
```

#### Example: Card Component Test

```typescript
// __tests__/components/Card.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Card from '../../src/components/Card';
import { mockCard } from '../../src/utils/testUtils';

describe('Card Component', () => {
  it('renders card front by default', () => {
    const { getByText } = render(
      <Card card={mockCard} />
    );
    
    expect(getByText(mockCard.front)).toBeTruthy();
    expect(getByText(mockCard.back)).not.toBeTruthy();
  });

  it('flips card when pressed', () => {
    const onFlipMock = jest.fn();
    const { getByTestId } = render(
      <Card card={mockCard} onFlip={onFlipMock} />
    );
    
    fireEvent.press(getByTestId('card-container'));
    expect(onFlipMock).toHaveBeenCalledTimes(1);
  });

  it('shows answer when showAnswer is true', () => {
    const { getByText } = render(
      <Card card={mockCard} showAnswer={true} />
    );
    
    expect(getByText(mockCard.back)).toBeTruthy();
  });
});
```

### Screen Testing

#### Example: LoginScreen Test

```typescript
// __tests__/screens/auth/LoginScreen.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithProviders } from '../../../src/utils/testUtils';
import LoginScreen from '../../../src/screens/auth/LoginScreen';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

// Mock auth context
const mockAuthContext = {
  login: jest.fn(),
  isLoading: false,
  error: null,
};

jest.mock('../../../src/context/AuthContext', () => ({
  useAuth: () => mockAuthContext,
}));

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form', () => {
    const { getByPlaceholderText, getByText } = renderWithProviders(
      <LoginScreen navigation={mockNavigation} route={{}} />
    );
    
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
  });

  it('validates form inputs', async () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(
      <LoginScreen navigation={mockNavigation} route={{}} />
    );
    
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByText('Login');
    
    // Try to login without entering data
    fireEvent.press(loginButton);
    
    await waitFor(() => {
      expect(getByText('Email is required')).toBeTruthy();
      expect(getByText('Password is required')).toBeTruthy();
    });
  });

  it('calls login function with valid data', async () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(
      <LoginScreen navigation={mockNavigation} route={{}} />
    );
    
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByText('Login');
    
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);
    
    await waitFor(() => {
      expect(mockAuthContext.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('shows error message when login fails', () => {
    mockAuthContext.error = 'Invalid credentials';
    
    const { getByText } = renderWithProviders(
      <LoginScreen navigation={mockNavigation} route={{}} />
    );
    
    expect(getByText('Invalid credentials')).toBeTruthy();
  });

  it('shows loading state during login', () => {
    mockAuthContext.isLoading = true;
    
    const { getByTestId } = renderWithProviders(
      <LoginScreen navigation={mockNavigation} route={{}} />
    );
    
    expect(getByTestId('loading-spinner')).toBeTruthy();
  });
});
```

### Service Testing

#### Example: API Service Test

```typescript
// __tests__/services/api.test.ts
import api from '../../src/services/api';
import { mockApiResponses, mockErrorResponses } from '../../src/utils/testUtils';

// Mock fetch
global.fetch = jest.fn();

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('makes successful GET request', async () => {
    const mockResponse = mockApiResponses.getDecks;
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });
    
    const result = await api.get('/decks');
    expect(result).toEqual(mockResponse);
  });

  it('handles network errors', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    
    await expect(api.get('/decks')).rejects.toThrow('Network error');
  });

  it('handles HTTP errors', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ error: 'Not found' }),
    });
    
    await expect(api.get('/decks')).rejects.toThrow('Not found');
  });

  it('includes auth token in requests', async () => {
    const token = 'test-token';
    api.setAuthToken(token);
    
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });
    
    await api.get('/decks');
    
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer ${token}`,
        }),
      })
    );
  });
});
```

#### Example: SRS Service Test

```typescript
// __tests__/services/srs.test.ts
import SRS from '../../src/services/srs';
import { mockCard } from '../../src/utils/testUtils';

describe('SRS Service', () => {
  it('calculates next review correctly for quality 4', () => {
    const card = { ...mockCard, interval: 1, repetition: 0, efactor: 2.5 };
    const result = SRS.calculateNextReview(card, 4);
    
    expect(result.interval).toBe(2);
    expect(result.repetition).toBe(1);
    expect(result.efactor).toBeGreaterThan(2.5);
  });

  it('resets card for quality 0', () => {
    const card = { ...mockCard, interval: 5, repetition: 3, efactor: 2.5 };
    const result = SRS.calculateNextReview(card, 0);
    
    expect(result.interval).toBe(1);
    expect(result.repetition).toBe(0);
    expect(result.efactor).toBeLessThan(2.5);
  });

  it('handles edge cases', () => {
    const card = { ...mockCard, interval: 1, repetition: 0, efactor: 1.3 };
    const result = SRS.calculateNextReview(card, 1);
    
    expect(result.efactor).toBeGreaterThanOrEqual(1.3);
  });
});
```

### Hook Testing

#### Example: Custom Hook Test

```typescript
// __tests__/hooks/useNetworkStatus.test.ts
import { renderHook } from '@testing-library/react-native';
import { useNetworkStatus } from '../../src/hooks/useNetworkStatus';
import NetInfo from '@react-native-community/netinfo';

// Mock NetInfo
jest.mock('@react-native-community/netinfo');

describe('useNetworkStatus', () => {
  it('returns correct network status', () => {
    const mockNetInfo = NetInfo as jest.Mocked<typeof NetInfo>;
    mockNetInfo.addEventListener.mockImplementation((callback) => {
      callback({ isConnected: true, type: 'wifi' });
      return () => {};
    });
    
    const { result } = renderHook(() => useNetworkStatus());
    
    expect(result.current.isConnected).toBe(true);
    expect(result.current.connectionType).toBe('wifi');
    expect(result.current.isWifi).toBe(true);
  });

  it('handles network changes', () => {
    let callback: any;
    const mockNetInfo = NetInfo as jest.Mocked<typeof NetInfo>;
    mockNetInfo.addEventListener.mockImplementation((cb) => {
      callback = cb;
      return () => {};
    });
    
    const { result } = renderHook(() => useNetworkStatus());
    
    // Simulate network change
    callback({ isConnected: false, type: 'none' });
    
    expect(result.current.isConnected).toBe(false);
    expect(result.current.connectionType).toBe('none');
  });
});
```

---

## Backend Testing

### Controller Testing

#### Example: Auth Controller Test

```typescript
// backend/__tests__/controllers/auth.test.js
const request = require('supertest');
const app = require('../../server');
const User = require('../../models/User');
const { connect, disconnect } = require('../../config/db');

describe('Auth Controller', () => {
  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await disconnect();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.token).toBeDefined();
    });

    it('should not register user with existing email', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      // Create first user
      await request(app)
        .post('/api/auth/register')
        .send(userData);

      // Try to create second user with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Email already exists');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Name is required');
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };
      await request(app)
        .post('/api/auth/register')
        .send(userData);
    });

    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
    });

    it('should not login with invalid password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid credentials');
    });
  });
});
```

### Model Testing

#### Example: User Model Test

```typescript
// backend/__tests__/models/User.test.js
const mongoose = require('mongoose');
const User = require('../../models/User');
const { connect, disconnect } = require('../../config/db');

describe('User Model', () => {
  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await disconnect();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should create a user with valid data', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword',
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser.name).toBe(userData.name);
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.password).toBe(userData.password);
  });

  it('should not create user without required fields', async () => {
    const user = new User({});

    let error;
    try {
      await user.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.name).toBeDefined();
    expect(error.errors.email).toBeDefined();
  });

  it('should not create user with duplicate email', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword',
    };

    await new User(userData).save();

    const duplicateUser = new User(userData);
    let error;
    try {
      await duplicateUser.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.code).toBe(11000); // MongoDB duplicate key error
  });
});
```

### Route Testing

#### Example: Deck Routes Test

```typescript
// backend/__tests__/routes/decks.test.js
const request = require('supertest');
const app = require('../../server');
const User = require('../../models/User');
const Deck = require('../../models/Deck');
const { connect, disconnect } = require('../../config/db');
const jwt = require('jsonwebtoken');

describe('Deck Routes', () => {
  let token;
  let user;

  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await disconnect();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Deck.deleteMany({});

    // Create test user
    user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword',
    });

    token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  });

  describe('GET /decks', () => {
    it('should get user decks', async () => {
      const deckData = {
        title: 'Test Deck',
        description: 'Test description',
        userId: user._id,
      };

      await Deck.create(deckData);

      const response = await request(app)
        .get('/api/decks')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].title).toBe(deckData.title);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/decks')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /decks', () => {
    it('should create a new deck', async () => {
      const deckData = {
        title: 'New Deck',
        description: 'New description',
        tags: ['test', 'sample'],
      };

      const response = await request(app)
        .post('/api/decks')
        .set('Authorization', `Bearer ${token}`)
        .send(deckData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(deckData.title);
      expect(response.body.data.userId).toBe(user._id.toString());
    });
  });
});
```

---

## Integration Testing

### API Integration Tests

```typescript
// __tests__/integration/api.test.ts
import { renderWithProviders } from '../../src/utils/testUtils';
import { waitFor } from '@testing-library/react-native';
import HomeScreen from '../../src/screens/HomeScreen';

describe('API Integration', () => {
  it('loads and displays decks from API', async () => {
    const { getByText, queryByTestId } = renderWithProviders(<HomeScreen />);

    // Show loading initially
    expect(queryByTestId('loading-spinner')).toBeTruthy();

    // Wait for data to load
    await waitFor(() => {
      expect(queryByTestId('loading-spinner')).toBeFalsy();
    });

    // Check if decks are displayed
    expect(getByText('JavaScript Basics')).toBeTruthy();
  });

  it('handles API errors gracefully', async () => {
    // Mock API to return error
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'));

    const { getByText } = renderWithProviders(<HomeScreen />);

    await waitFor(() => {
      expect(getByText('Network error')).toBeTruthy();
    });
  });
});
```

### Navigation Integration Tests

```typescript
// __tests__/integration/navigation.test.ts
import { renderWithProviders } from '../../src/utils/testUtils';
import { fireEvent } from '@testing-library/react-native';
import HomeScreen from '../../src/screens/HomeScreen';

describe('Navigation Integration', () => {
  it('navigates to deck detail when deck is pressed', async () => {
    const mockNavigation = {
      navigate: jest.fn(),
    };

    const { getByTestId } = renderWithProviders(<HomeScreen />);

    const deckCard = getByTestId('deck-card-1');
    fireEvent.press(deckCard);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('DeckDetail', {
      deckId: 'deck_1',
    });
  });
});
```

---

## End-to-End Testing

### Detox Setup

```typescript
// e2e/firstTest.e2e.js
describe('CardifyAi E2E', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should login and navigate to home', async () => {
    await element(by.id('email-input')).typeText('test@example.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('login-button')).tap();

    await expect(element(by.text('Welcome to CardifyAi'))).toBeVisible();
  });

  it('should create a new deck', async () => {
    await element(by.id('create-deck-button')).tap();
    await element(by.id('deck-title-input')).typeText('Test Deck');
    await element(by.id('deck-description-input')).typeText('Test description');
    await element(by.id('save-deck-button')).tap();

    await expect(element(by.text('Test Deck'))).toBeVisible();
  });

  it('should add a card to deck', async () => {
    await element(by.text('Test Deck')).tap();
    await element(by.id('add-card-button')).tap();
    await element(by.id('card-front-input')).typeText('What is React Native?');
    await element(by.id('card-back-input')).typeText('A framework for mobile apps');
    await element(by.id('save-card-button')).tap();

    await expect(element(by.text('What is React Native?'))).toBeVisible();
  });
});
```

---

## Performance Testing

### Component Performance Tests

```typescript
// __tests__/performance/ComponentPerformance.test.ts
import { renderWithProviders } from '../../src/utils/testUtils';
import HomeScreen from '../../src/screens/HomeScreen';

describe('Component Performance', () => {
  it('renders HomeScreen within performance budget', () => {
    const startTime = performance.now();
    
    renderWithProviders(<HomeScreen />);
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    expect(renderTime).toBeLessThan(100); // 100ms threshold
  });

  it('handles large lists efficiently', () => {
    const largeDeckList = Array.from({ length: 100 }, (_, i) => ({
      id: `deck_${i}`,
      title: `Deck ${i}`,
      cardCount: Math.floor(Math.random() * 50),
    }));

    const startTime = performance.now();
    
    // Render component with large data
    renderWithProviders(<HomeScreen decks={largeDeckList} />);
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    expect(renderTime).toBeLessThan(200); // 200ms threshold
  });
});
```

---

## Test Configuration

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation)/)',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testMatch: [
    '<rootDir>/__tests__/**/*.test.{ts,tsx}',
    '<rootDir>/src/**/__tests__/*.{ts,tsx}',
  ],
};
```

### Jest Setup

```javascript
// jest.setup.js
import '@testing-library/jest-native/extend-expect';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock NetInfo
jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  fetch: jest.fn(),
}));

// Mock PushNotification
jest.mock('react-native-push-notification', () => ({
  configure: jest.fn(),
  createChannel: jest.fn(),
  localNotification: jest.fn(),
  localNotificationSchedule: jest.fn(),
}));

// Mock ImagePicker
jest.mock('react-native-image-picker', () => ({
  launchCamera: jest.fn(),
  launchImageLibrary: jest.fn(),
}));

// Mock SQLite
jest.mock('react-native-sqlite-storage', () => ({
  openDatabase: jest.fn(),
  closeDatabase: jest.fn(),
  executeSql: jest.fn(),
}));
```

---

## Running Tests

### Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false",
    "test:e2e": "detox test -c ios.sim.debug",
    "test:e2e:android": "detox test -c android.emu.debug"
  }
}
```

### Running Specific Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- Button.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="Button"

# Run tests in specific directory
npm test -- __tests__/components/

# Run E2E tests
npm run test:e2e
```

---

## Best Practices

### Test Organization
- Group related tests using `describe` blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Keep tests independent and isolated

### Mocking
- Mock external dependencies
- Use realistic mock data
- Avoid over-mocking
- Test error scenarios

### Coverage
- Aim for 80%+ code coverage
- Focus on critical business logic
- Don't test implementation details
- Test user interactions and edge cases

### Performance
- Keep tests fast
- Use efficient selectors
- Avoid unnecessary renders
- Mock heavy operations

### Maintenance
- Update tests when code changes
- Remove obsolete tests
- Keep test data up to date
- Regular test reviews 