// Analytics service for tracking user events and app usage

// Event types
export enum EventType {
  // User events
  USER_REGISTER = 'user_register',
  USER_LOGIN = 'user_login',
  USER_LOGOUT = 'user_logout',
  
  // Deck events
  DECK_CREATED = 'deck_created',
  DECK_UPDATED = 'deck_updated',
  DECK_DELETED = 'deck_deleted',
  DECK_VIEWED = 'deck_viewed',
  
  // Card events
  CARD_CREATED = 'card_created',
  CARD_UPDATED = 'card_updated',
  CARD_DELETED = 'card_deleted',
  CARD_VIEWED = 'card_viewed',
  
  // Review events
  REVIEW_STARTED = 'review_started',
  REVIEW_COMPLETED = 'review_completed',
  CARD_ANSWERED = 'card_answered',
  
  // OCR events
  OCR_USED = 'ocr_used',
  OCR_SUCCESS = 'ocr_success',
  OCR_FAILED = 'ocr_failed',
  
  // Navigation events
  SCREEN_VIEWED = 'screen_viewed',
  BUTTON_PRESSED = 'button_pressed',
  
  // App events
  APP_OPENED = 'app_opened',
  APP_BACKGROUNDED = 'app_backgrounded',
  APP_FOREGROUNDED = 'app_foregrounded',
  
  // Error events
  ERROR_OCCURRED = 'error_occurred',
  
  // Performance events
  API_CALL = 'api_call',
  API_SUCCESS = 'api_success',
  API_FAILED = 'api_failed',
}

// Event properties interface
export interface EventProperties {
  [key: string]: any;
}

// Analytics service class
class AnalyticsService {
  private isEnabled: boolean = true;
  private userId: string | null = null;
  private sessionId: string | null = null;

  // Initialize analytics
  init(userId?: string) {
    this.userId = userId || null;
    this.sessionId = this.generateSessionId();
    
    // Track app opened event
    this.track(EventType.APP_OPENED, {
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
    });
  }

  // Set user ID
  setUserId(userId: string) {
    this.userId = userId;
  }

  // Clear user ID
  clearUserId() {
    this.userId = null;
  }

  // Enable/disable analytics
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  // Track event
  track(event: EventType, properties: EventProperties = {}) {
    if (!this.isEnabled) return;

    const eventData = {
      event,
      properties: {
        ...properties,
        userId: this.userId,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
      },
    };

    // Log to console in development
    if (__DEV__) {
      console.log('Analytics Event:', eventData);
    }

    // Send to analytics service
    this.sendToAnalytics(eventData);
  }

  // Track screen view
  trackScreen(screenName: string, properties: EventProperties = {}) {
    this.track(EventType.SCREEN_VIEWED, {
      screen_name: screenName,
      ...properties,
    });
  }

  // Track button press
  trackButton(buttonName: string, properties: EventProperties = {}) {
    this.track(EventType.BUTTON_PRESSED, {
      button_name: buttonName,
      ...properties,
    });
  }

  // Track API call
  trackApiCall(endpoint: string, method: string, duration: number, success: boolean) {
    this.track(success ? EventType.API_SUCCESS : EventType.API_FAILED, {
      endpoint,
      method,
      duration,
      success,
    });
  }

  // Track error
  trackError(error: any, context?: string) {
    this.track(EventType.ERROR_OCCURRED, {
      error_message: error.message || 'Unknown error',
      error_type: error.type || 'unknown',
      context,
      stack_trace: error.stack,
    });
  }

  // Track user registration
  trackUserRegister(method: string = 'email') {
    this.track(EventType.USER_REGISTER, {
      method,
    });
  }

  // Track user login
  trackUserLogin(method: string = 'email') {
    this.track(EventType.USER_LOGIN, {
      method,
    });
  }

  // Track user logout
  trackUserLogout() {
    this.track(EventType.USER_LOGOUT);
  }

  // Track deck creation
  trackDeckCreated(deckId: string, title: string, cardCount: number = 0) {
    this.track(EventType.DECK_CREATED, {
      deck_id: deckId,
      title,
      card_count: cardCount,
    });
  }

  // Track deck update
  trackDeckUpdated(deckId: string, title: string, cardCount: number) {
    this.track(EventType.DECK_UPDATED, {
      deck_id: deckId,
      title,
      card_count: cardCount,
    });
  }

  // Track deck deletion
  trackDeckDeleted(deckId: string, title: string, cardCount: number) {
    this.track(EventType.DECK_DELETED, {
      deck_id: deckId,
      title,
      card_count: cardCount,
    });
  }

  // Track deck view
  trackDeckViewed(deckId: string, title: string, cardCount: number) {
    this.track(EventType.DECK_VIEWED, {
      deck_id: deckId,
      title,
      card_count: cardCount,
    });
  }

  // Track card creation
  trackCardCreated(cardId: string, deckId: string, hasImages: boolean = false) {
    this.track(EventType.CARD_CREATED, {
      card_id: cardId,
      deck_id: deckId,
      has_images: hasImages,
    });
  }

  // Track card update
  trackCardUpdated(cardId: string, deckId: string) {
    this.track(EventType.CARD_UPDATED, {
      card_id: cardId,
      deck_id: deckId,
    });
  }

  // Track card deletion
  trackCardDeleted(cardId: string, deckId: string) {
    this.track(EventType.CARD_DELETED, {
      card_id: cardId,
      deck_id: deckId,
    });
  }

  // Track card view
  trackCardViewed(cardId: string, deckId: string) {
    this.track(EventType.CARD_VIEWED, {
      card_id: cardId,
      deck_id: deckId,
    });
  }

  // Track review session start
  trackReviewStarted(deckId: string, cardCount: number) {
    this.track(EventType.REVIEW_STARTED, {
      deck_id: deckId,
      card_count: cardCount,
    });
  }

  // Track review session completion
  trackReviewCompleted(deckId: string, totalCards: number, correctCards: number, duration: number) {
    this.track(EventType.REVIEW_COMPLETED, {
      deck_id: deckId,
      total_cards: totalCards,
      correct_cards: correctCards,
      accuracy: totalCards > 0 ? (correctCards / totalCards) * 100 : 0,
      duration,
    });
  }

  // Track card answer
  trackCardAnswered(cardId: string, deckId: string, quality: number, timeSpent: number) {
    this.track(EventType.CARD_ANSWERED, {
      card_id: cardId,
      deck_id: deckId,
      quality,
      time_spent: timeSpent,
    });
  }

  // Track OCR usage
  trackOcrUsed(source: string = 'camera') {
    this.track(EventType.OCR_USED, {
      source,
    });
  }

  // Track OCR success
  trackOcrSuccess(source: string, textLength: number, confidence: number) {
    this.track(EventType.OCR_SUCCESS, {
      source,
      text_length: textLength,
      confidence,
    });
  }

  // Track OCR failure
  trackOcrFailed(source: string, error: string) {
    this.track(EventType.OCR_FAILED, {
      source,
      error,
    });
  }

  // Track app background
  trackAppBackgrounded() {
    this.track(EventType.APP_BACKGROUNDED);
  }

  // Track app foreground
  trackAppForegrounded() {
    this.track(EventType.APP_FOREGROUNDED);
  }

  // Generate session ID
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Send data to analytics service
  private sendToAnalytics(eventData: any) {
    // Here you can integrate with analytics services like:
    // - Firebase Analytics
    // - Mixpanel
    // - Amplitude
    // - Google Analytics
    // - Custom analytics endpoint

    // For now, we'll just store in local storage for debugging
    this.storeEventLocally(eventData);
  }

  // Store event locally for debugging
  private async storeEventLocally(eventData: any) {
    try {
      // You can implement local storage here if needed
      // const events = await AsyncStorage.getItem('analytics_events') || '[]';
      // const parsedEvents = JSON.parse(events);
      // parsedEvents.push(eventData);
      // await AsyncStorage.setItem('analytics_events', JSON.stringify(parsedEvents));
    } catch (error) {
      console.error('Error storing analytics event:', error);
    }
  }

  // Get analytics data (for debugging)
  async getAnalyticsData() {
    try {
      // const events = await AsyncStorage.getItem('analytics_events');
      // return events ? JSON.parse(events) : [];
      return [];
    } catch (error) {
      console.error('Error getting analytics data:', error);
      return [];
    }
  }

  // Clear analytics data
  async clearAnalyticsData() {
    try {
      // await AsyncStorage.removeItem('analytics_events');
    } catch (error) {
      console.error('Error clearing analytics data:', error);
    }
  }
}

// Export singleton instance
export default new AnalyticsService();

// Export utility functions for easy tracking
export const trackEvent = (event: EventType, properties?: EventProperties) => {
  AnalyticsService.track(event, properties);
};

export const trackScreen = (screenName: string, properties?: EventProperties) => {
  AnalyticsService.trackScreen(screenName, properties);
};

export const trackButton = (buttonName: string, properties?: EventProperties) => {
  AnalyticsService.trackButton(buttonName, properties);
};

export const trackError = (error: any, context?: string) => {
  AnalyticsService.trackError(error, context);
}; 