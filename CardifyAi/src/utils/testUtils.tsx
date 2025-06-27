import React from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '../context/AuthContext';
import { AppProvider } from '../context/AppContext';

// Custom render function that includes providers
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <NavigationContainer>
      <AuthProvider>
        <AppProvider>
          {children}
        </AppProvider>
      </AuthProvider>
    </NavigationContainer>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Mock data for testing
export const mockUser = {
  id: 'user_1',
  name: 'Test User',
  email: 'test@example.com',
  avatar: null,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockDeck = {
  id: 'deck_1',
  title: 'Test Deck',
  description: 'Test deck description',
  coverImage: null,
  cardCount: 5,
  userId: 'user_1',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  lastReviewed: new Date('2024-01-01'),
  tags: ['test', 'sample'],
};

export const mockCard = {
  id: 'card_1',
  deckId: 'deck_1',
  front: 'What is React Native?',
  back: 'A framework for building mobile apps',
  notes: 'Test notes',
  images: [],
  tags: ['react', 'mobile'],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  nextReview: new Date('2024-01-02'),
  interval: 1,
  repetition: 0,
  efactor: 2.5,
  status: 'new' as const,
};

export const mockReviewSession = {
  id: 'session_1',
  deckId: 'deck_1',
  cards: [mockCard],
  startTime: new Date('2024-01-01T10:00:00'),
  endTime: new Date('2024-01-01T10:30:00'),
  cardsReviewed: 5,
  cardsCorrect: 4,
};

// Mock API responses
export const mockApiResponses = {
  login: {
    success: true,
    data: {
      user: mockUser,
      token: 'mock_token_123',
    },
  },
  register: {
    success: true,
    data: {
      user: mockUser,
      token: 'mock_token_123',
    },
  },
  getDecks: {
    success: true,
    data: [mockDeck],
    count: 1,
  },
  getCards: {
    success: true,
    data: [mockCard],
    count: 1,
  },
  createDeck: {
    success: true,
    data: mockDeck,
  },
  createCard: {
    success: true,
    data: mockCard,
  },
  ocrResult: {
    success: true,
    data: {
      text: 'Extracted text from image',
      confidence: 0.95,
    },
  },
};

// Mock error responses
export const mockErrorResponses = {
  networkError: {
    success: false,
    error: 'Network error',
  },
  authError: {
    success: false,
    error: 'Authentication failed',
  },
  validationError: {
    success: false,
    error: 'Validation failed',
    details: {
      email: 'Invalid email format',
      password: 'Password too short',
    },
  },
  serverError: {
    success: false,
    error: 'Internal server error',
  },
};

// Test utilities
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const createMockNavigation = () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  push: jest.fn(),
  pop: jest.fn(),
  replace: jest.fn(),
  reset: jest.fn(),
  setOptions: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
  isFocused: jest.fn(() => true),
  canGoBack: jest.fn(() => true),
  getParent: jest.fn(),
  getState: jest.fn(),
  dispatch: jest.fn(),
});

export const createMockRoute = (params: any = {}) => ({
  key: 'test-route',
  name: 'TestScreen',
  params,
});

// Mock AsyncStorage
export const mockAsyncStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
};

// Mock NetInfo
export const mockNetInfo = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  fetch: jest.fn(),
  refresh: jest.fn(),
};

// Mock PushNotification
export const mockPushNotification = {
  configure: jest.fn(),
  createChannel: jest.fn(),
  localNotification: jest.fn(),
  localNotificationSchedule: jest.fn(),
  cancelLocalNotification: jest.fn(),
  cancelAllLocalNotifications: jest.fn(),
  getScheduledLocalNotifications: jest.fn(),
  getDeliveredNotifications: jest.fn(),
  removeDeliveredNotifications: jest.fn(),
  removeAllDeliveredNotifications: jest.fn(),
  setApplicationIconBadgeNumber: jest.fn(),
  getApplicationIconBadgeNumber: jest.fn(),
  requestPermissions: jest.fn(),
  abandonPermissions: jest.fn(),
  checkPermissions: jest.fn(),
  getInitialNotification: jest.fn(),
  getScheduledLocalNotifications: jest.fn(),
  getDeliveredNotifications: jest.fn(),
  removeDeliveredNotifications: jest.fn(),
  removeAllDeliveredNotifications: jest.fn(),
  setApplicationIconBadgeNumber: jest.fn(),
  getApplicationIconBadgeNumber: jest.fn(),
  requestPermissions: jest.fn(),
  abandonPermissions: jest.fn(),
  checkPermissions: jest.fn(),
  getInitialNotification: jest.fn(),
};

// Mock ImagePicker
export const mockImagePicker = {
  launchCamera: jest.fn(),
  launchImageLibrary: jest.fn(),
  showImagePicker: jest.fn(),
};

// Mock FileSystem
export const mockFileSystem = {
  readAsStringAsync: jest.fn(),
  writeAsStringAsync: jest.fn(),
  deleteAsync: jest.fn(),
  moveAsync: jest.fn(),
  copyAsync: jest.fn(),
  makeDirectoryAsync: jest.fn(),
  readDirectoryAsync: jest.fn(),
  getInfoAsync: jest.fn(),
  downloadAsync: jest.fn(),
  uploadAsync: jest.fn(),
  createDownloadResumable: jest.fn(),
};

// Mock SQLite
export const mockSQLite = {
  openDatabase: jest.fn(),
  closeDatabase: jest.fn(),
  executeSql: jest.fn(),
  transaction: jest.fn(),
};

// Test helpers
export const renderWithProviders = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => customRender(ui, options);

export const createTestProps = (props: any = {}) => ({
  navigation: createMockNavigation(),
  route: createMockRoute(),
  ...props,
});

export const mockApiCall = (response: any, delay: number = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(response), delay);
  });
};

export const mockApiCallWithError = (error: any, delay: number = 0) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(error), delay);
  });
};

// Snapshot testing helpers
export const createSnapshotTest = (Component: React.ComponentType<any>, props: any = {}) => {
  it('should render correctly', () => {
    const { toJSON } = renderWithProviders(<Component {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });
};

// Integration test helpers
export const createIntegrationTest = (
  Component: React.ComponentType<any>,
  props: any = {},
  testName: string = 'should work correctly'
) => {
  it(testName, async () => {
    const { getByTestId, getByText, queryByText } = renderWithProviders(
      <Component {...props} />
    );
    
    // Add your integration test logic here
    expect(getByTestId).toBeDefined();
    expect(getByText).toBeDefined();
    expect(queryByText).toBeDefined();
  });
};

// Performance test helpers
export const createPerformanceTest = (
  Component: React.ComponentType<any>,
  props: any = {},
  testName: string = 'should render within performance budget'
) => {
  it(testName, () => {
    const startTime = performance.now();
    
    renderWithProviders(<Component {...props} />);
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Adjust this threshold based on your performance requirements
    expect(renderTime).toBeLessThan(100); // 100ms threshold
  });
};

// Accessibility test helpers
export const createAccessibilityTest = (
  Component: React.ComponentType<any>,
  props: any = {},
  testName: string = 'should be accessible'
) => {
  it(testName, () => {
    const { getByLabelText, getByRole, getByTestId } = renderWithProviders(
      <Component {...props} />
    );
    
    // Add your accessibility test logic here
    expect(getByLabelText).toBeDefined();
    expect(getByRole).toBeDefined();
    expect(getByTestId).toBeDefined();
  });
};

// Export everything
export * from '@testing-library/react-native';
export { customRender as render }; 