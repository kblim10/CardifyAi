import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Platform } from 'react-native';

class NotificationService {
  constructor() {
    this.configure();
    this.createChannels();
  }

  configure = () => {
    PushNotification.configure({
      onRegister: function (_token) {
        // Token registered
      },

      onNotification: function (notification) {
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      onAction: function (_notification) {
        // Handle notification action
      },

      onRegistrationError: function (err) {
        if (__DEV__) {
          console.error('Push notification registration error:', err.message);
        }
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });
  };

  createChannels = () => {
    PushNotification.createChannel(
      {
        channelId: 'reminders',
        channelName: 'Reminder Notifications',
        channelDescription: 'Reminder notifications for card reviews',
        playSound: true,
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      (_created) => {} // Channel created callback
    );

    PushNotification.createChannel(
      {
        channelId: 'general',
        channelName: 'General Notifications',
        channelDescription: 'General notifications for the app',
        playSound: true,
        soundName: 'default',
        importance: 3,
        vibrate: true,
      },
      (_created) => {} // Channel created callback
    );
  };

  // Schedule a local notification for card review
  scheduleReviewReminder = (deckId: string, deckTitle: string, date: Date) => {
    PushNotification.localNotificationSchedule({
      channelId: 'reminders',
      title: 'Review Reminder',
      message: `Time to review your "${deckTitle}" deck!`,
      date: date,
      allowWhileIdle: true,
      playSound: true,
      soundName: 'default',
      userInfo: { deckId },
    });
  };

  // Cancel all notifications for a specific deck
  cancelDeckNotifications = (deckId: string) => {
    PushNotification.getScheduledLocalNotifications((notifications) => {
      notifications.forEach((notification) => {
        if (notification.userInfo?.deckId === deckId) {
          PushNotification.cancelLocalNotification(notification.id);
        }
      });
    });
  };

  // Cancel all notifications
  cancelAllNotifications = () => {
    PushNotification.cancelAllLocalNotifications();
  };

  // Show immediate notification
  showNotification = (title: string, message: string, data: any = {}) => {
    PushNotification.localNotification({
      channelId: 'general',
      title,
      message,
      playSound: true,
      soundName: 'default',
      userInfo: data,
    });
  };

  // Schedule daily reminder
  scheduleDailyReminder = (hour: number, minute: number) => {
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hour, minute, 0, 0);

    // If time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    PushNotification.localNotificationSchedule({
      channelId: 'reminders',
      title: 'Daily Learning Reminder',
      message: 'Time for your daily learning session!',
      date: scheduledTime,
      repeatType: 'day',
      allowWhileIdle: true,
      playSound: true,
      soundName: 'default',
    });
  };

  // Get badge count
  getBadgeCount = () => {
    return PushNotification.getApplicationIconBadgeNumber();
  };

  // Set badge count
  setBadgeCount = (count: number) => {
    PushNotification.setApplicationIconBadgeNumber(count);
  };

  // Clear badge count
  clearBadgeCount = () => {
    PushNotification.setApplicationIconBadgeNumber(0);
  };
}

export default new NotificationService(); 