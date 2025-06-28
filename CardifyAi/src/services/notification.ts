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
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },

      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);
      },

      onRegistrationError: function (err) {
        console.error(err.message, err);
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
      (created) => console.log(`Channel 'reminders' created: ${created}`)
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
      (created) => console.log(`Channel 'general' created: ${created}`)
    );
  };

  // Schedule a local notification for card review
  scheduleReviewReminder = (deckId, deckTitle, date) => {
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
  cancelDeckNotifications = (deckId) => {
    PushNotification.getScheduledLocalNotifications((notifications) => {
      notifications.forEach((notification) => {
        if (notification.userInfo.deckId === deckId) {
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
  showNotification = (title, message, data = {}) => {
    PushNotification.localNotification({
      channelId: 'general',
      title,
      message,
      playSound: true,
      soundName: 'default',
      userInfo: data,
    });
  };
}

export default new NotificationService();

