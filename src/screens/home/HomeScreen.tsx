import React, {useEffect, useRef, useState} from 'react';
import {Button, View} from 'react-native';
import * as Notifications from 'expo-notifications';
import {useUserStore} from '../../store/user';
import {registerForPushNotificationsAsync, schedulePushNotification} from '../../resources/notifications';
import styles from './HomeScreenStyles';
import firebase from 'firebase/compat';
import {getDebtsForUser} from "../../../backend/group-config/group-service";
import User = firebase.User;

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

const HomeScreen = ({route}) => {
    const {uid} = route.params;
    const {email} = useUserStore();
    const [expoPushToken, setExpoPushToken] = useState<any>('');
    const [notification, setNotification] = useState<any>();
    const notificationListener = useRef<any>();
    const responseListener = useRef<any>();
    const [userData, setUserData] = useState<User | null>(null);
    const [userDebts, setUserDebts] = useState<Map<string, number>>(new Map());

    useEffect(() => {
        const fetchUserDebts = async () => {
            try {
                const userDebts = await getDebtsForUser('s7riXqLLHwZ8nHXGaVA2k9qTipa2');

                const groupedDebts = {};

                userDebts.forEach((debt) => {
                    groupedDebts[debt.groupId] = debt.amount;
                });

                setUserDebts(groupedDebts);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        // Fetch user data and debts
        fetchUserDebts();

        // main().then((r) => console.log('Main called'));
        registerForPushNotificationsAsync()
            .then((token) => setExpoPushToken(token))
            .catch(() => {
            });

        notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
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
