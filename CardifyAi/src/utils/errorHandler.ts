import { Alert, InteractionManager } from 'react-native';
import { ERROR_MESSAGES } from '../constants';

// Error types
export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTH = 'AUTH',
  VALIDATION = 'VALIDATION',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN',
}

// Error interface
export interface AppError {
  type: ErrorType;
  message: string;
  code?: string;
  details?: any;
}

// Error handler class
class ErrorHandler {
  // Parse error from API response
  parseError(error: any): AppError {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          return {
            type: ErrorType.AUTH,
            message: data?.message || 'Sesi Anda telah berakhir. Silakan login kembali.',
            code: 'UNAUTHORIZED',
          };
        case 403:
          return {
            type: ErrorType.AUTH,
            message: data?.message || 'Anda tidak memiliki akses ke resource ini.',
            code: 'FORBIDDEN',
          };
        case 404:
          return {
            type: ErrorType.SERVER,
            message: data?.message || 'Resource tidak ditemukan.',
            code: 'NOT_FOUND',
          };
        case 422:
          return {
            type: ErrorType.VALIDATION,
            message: data?.message || 'Data yang dimasukkan tidak valid.',
            code: 'VALIDATION_ERROR',
            details: data?.errors,
          };
        case 500:
          return {
            type: ErrorType.SERVER,
            message: data?.message || 'Terjadi kesalahan pada server.',
            code: 'SERVER_ERROR',
          };
        default:
          return {
            type: ErrorType.SERVER,
            message: data?.message || 'Terjadi kesalahan pada server.',
            code: `HTTP_${status}`,
          };
      }
    } else if (error.request) {
      // Network error
      return {
        type: ErrorType.NETWORK,
        message: ERROR_MESSAGES.NETWORK_ERROR,
        code: 'NETWORK_ERROR',
      };
    } else {
      // Other errors
      return {
        type: ErrorType.UNKNOWN,
        message: error.message || ERROR_MESSAGES.GENERAL_ERROR,
        code: 'UNKNOWN_ERROR',
      };
    }
  }

  // Handle error based on type
  handleError(error: AppError, showAlert: boolean = true) {
    console.error('Error occurred:', error);

    switch (error.type) {
      case ErrorType.NETWORK:
        this.handleNetworkError(error, showAlert);
        break;
      case ErrorType.AUTH:
        this.handleAuthError(error, showAlert);
        break;
      case ErrorType.VALIDATION:
        this.handleValidationError(error, showAlert);
        break;
      case ErrorType.SERVER:
        this.handleServerError(error, showAlert);
        break;
      default:
        this.handleUnknownError(error, showAlert);
    }
  }

  // Handle network errors
  private handleNetworkError(error: AppError, showAlert: boolean) {
    if (showAlert) {
      InteractionManager.runAfterInteractions(() => {
        requestAnimationFrame(() => {
          Alert.alert(
            'Koneksi Error',
            error.message,
            [
              {
                text: 'OK',
                style: 'default',
              },
            ]
          );
        });
      });
    }
  }

  // Handle authentication errors
  private handleAuthError(error: AppError, showAlert: boolean) {
    if (showAlert) {
      InteractionManager.runAfterInteractions(() => {
        requestAnimationFrame(() => {
          Alert.alert(
            'Autentikasi Error',
            error.message,
            [
              {
                text: 'OK',
                style: 'default',
              },
            ]
          );
        });
      });
    }

    // You might want to trigger logout here
    // AuthService.logout();
  }

  // Handle validation errors
  private handleValidationError(error: AppError, showAlert: boolean) {
    if (showAlert) {
      let message = error.message;
      
      if (error.details) {
        const errorDetails = Object.values(error.details).join('\n');
        message = `${message}\n\n${errorDetails}`;
      }

      InteractionManager.runAfterInteractions(() => {
        requestAnimationFrame(() => {
          Alert.alert(
            'Validasi Error',
            message,
            [
              {
                text: 'OK',
                style: 'default',
              },
            ]
          );
        });
      });
    }
  }

  // Handle server errors
  private handleServerError(error: AppError, showAlert: boolean) {
    if (showAlert) {
      InteractionManager.runAfterInteractions(() => {
        requestAnimationFrame(() => {
          Alert.alert(
            'Server Error',
            error.message,
            [
              {
                text: 'OK',
                style: 'default',
              },
            ]
          );
        });
      });
    }
  }

  // Handle unknown errors
  private handleUnknownError(error: AppError, showAlert: boolean) {
    if (showAlert) {
      InteractionManager.runAfterInteractions(() => {
        requestAnimationFrame(() => {
          Alert.alert(
            'Error',
            error.message,
            [
              {
                text: 'OK',
                style: 'default',
              },
            ]
          );
        });
      });
    }
  }

  // Show custom error alert
  showErrorAlert(title: string, message: string, onPress?: () => void) {
    InteractionManager.runAfterInteractions(() => {
      requestAnimationFrame(() => {
        Alert.alert(
          title,
          message,
          [
            {
              text: 'OK',
              style: 'default',
              onPress,
            },
          ]
        );
      });
    });
  }

  // Show confirmation dialog
  showConfirmation(
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) {
    InteractionManager.runAfterInteractions(() => {
      requestAnimationFrame(() => {
        Alert.alert(
          title,
          message,
          [
            {
              text: 'Batal',
              style: 'cancel',
              onPress: onCancel,
            },
            {
              text: 'OK',
              style: 'destructive',
              onPress: onConfirm,
            },
          ]
        );
      });
    });
  }

  // Log error for analytics
  logError(error: AppError, context?: any) {
    // You can integrate with error tracking services here
    // Example: Sentry, Crashlytics, etc.
    console.error('Error logged:', {
      error,
      context,
      timestamp: new Date().toISOString(),
    });
  }

  // Create custom error
  createError(type: ErrorType, message: string, code?: string, details?: any): AppError {
    return {
      type,
      message,
      code,
      details,
    };
  }

  // Validate error object
  isValidError(error: any): error is AppError {
    return (
      error &&
      typeof error === 'object' &&
      'type' in error &&
      'message' in error &&
      Object.values(ErrorType).includes(error.type)
    );
  }
}

// Export singleton instance
export default new ErrorHandler();

// Export utility functions
export const createNetworkError = (message?: string): AppError => ({
  type: ErrorType.NETWORK,
  message: message || ERROR_MESSAGES.NETWORK_ERROR,
  code: 'NETWORK_ERROR',
});

export const createAuthError = (message?: string): AppError => ({
  type: ErrorType.AUTH,
  message: message || ERROR_MESSAGES.AUTH_ERROR,
  code: 'AUTH_ERROR',
});

export const createValidationError = (message: string, details?: any): AppError => ({
  type: ErrorType.VALIDATION,
  message,
  code: 'VALIDATION_ERROR',
  details,
});

export const createServerError = (message?: string): AppError => ({
  type: ErrorType.SERVER,
  message: message || ERROR_MESSAGES.GENERAL_ERROR,
  code: 'SERVER_ERROR',
});

export const createUnknownError = (message?: string): AppError => ({
  type: ErrorType.UNKNOWN,
  message: message || ERROR_MESSAGES.GENERAL_ERROR,
  code: 'UNKNOWN_ERROR',
}); 