import React, { useState, useRef, useEffect } from 'react';
import {View, Button} from 'react-native';
import * as Notifications from "expo-notifications"

import { useUserStore } from '../../store/user';

import { registerForPushNotificationsAsync, schedulePushNotification } from '../../resources/notifications'

import styles from './HomeScreenStyles';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
});

const HomeScreen = () => {
    const { email } = useUserStore()

    const [expoPushToken, setExpoPushToken] = useState<any>('');
    const [notification, setNotification] = useState<any>();
    const notificationListener = useRef<any>();
    const responseListener = useRef<any>();

    useEffect(() => {
        registerForPushNotificationsAsync()
          .then(token => setExpoPushToken(token))
          .catch(() => {})

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
          setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          console.log(response);
        });

        return () => {
          Notifications.removeNotificationSubscription(notificationListener.current);
          Notifications.removeNotificationSubscription(responseListener.current);
        };
      }, []);

    return (
        <View style={styles.container}>
            <Button
                title="Press to schedule a notification"
                onPress={() => schedulePushNotification()}
            />
        </View>
    );
};

export default HomeScreen;
