import React, {useEffect, useRef, useState} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import * as Notifications from 'expo-notifications';
import {registerForPushNotificationsAsync} from '../../resources/notifications';
import styles from './HomeScreenStyles';
import Ionicons from '@expo/vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {readUser,} from '../../../backend/user-config/user-service';
import {getDebtsForUser, getGroups} from '../../../backend/group-config/group-service'

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

const HomeScreen = ({route}) => {
    const {uid} = route.params;
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(null);
    const notificationListener = useRef();
    const responseListener = useRef();
    const [userData, setUserData] = useState(null);
    const [userDebts, setUserDebts] = useState(new Map());
    const [groups, setGroups] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserDataAndGroups = async () => {
            try {
                // Fetch user data
                const userData = await readUser(uid);
                if (userData && userData.name) {
                    setUserData(userData);
                }

                // Fetch the list of groups
                const groupsData = await getGroups();
                setGroups(groupsData);

                // Fetch user debts
                const userDebtsResponse = await getDebtsForUser(uid);
                const groupedDebts = {};

                userDebtsResponse.forEach((debt) => {
                    groupedDebts[debt.groupId] = debt.amount;
                });

                setUserDebts(groupedDebts);
            } catch (error) {
                console.error('Error fetching user data and groups:', error);
            }
        };

        // Fetch user data and debts
        fetchUserDataAndGroups();

        // main().then((r) => console.log('Main called'));
        registerForPushNotificationsAsync()
            .then((token) => setExpoPushToken(token))
            .catch(() => {
                // Handle the error here if needed
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

    const onPressAdicionarGrupo = () => {
        console.log('Novo grupo adicionado!');
    };

    const navigateToGroup = (groupId) => {
        console.log('Navegar para o grupo: ', groupId);
        navigation.navigate('GroupScreen', {groupId});
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.profileContent}>
                    <Image
                        source={{
                            uri:
                                'https://s2-valor.glbimg.com/LZyCSHR22BjRuB06S60vWzmKJqQ=/0x0:5408x3355/888x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_63b422c2caee4269b8b34177e8876b93/internal_photos/bs/2020/T/A/fuvfecS5Od2cxQlrQ5Pw/kym-mackinnon-aerego3rque-unsplash.jpg',
                        }}
                        style={styles.profileImage}
                    />
                    <Text style={styles.profileName}>{userData?.name}</Text>
                </View>
                <View style={styles.notificationContent}>
                    <Ionicons name="notifications-outline" size={28} color="white"/>
                </View>

                <View style={styles.searchContainer}></View>

                <View style={styles.groupListTitleView}>
                    <Text style={styles.groupsListTitle}>Grupos</Text>
                </View>
                <ScrollView style={styles.list}>
                    {groups.map((group) => (
                        <TouchableOpacity key={group.groupId} onPress={() => navigateToGroup(group.groupId)}>
                            <View style={styles.listItem} key={group.groupId}>
                                <View style={styles.groupImageContainer}>
                                    <Ionicons name="people-outline" size={28} color="white"/>
                                </View>
                                <View style={styles.groupInfo}>
                                    <Text style={styles.groupName}>{group.name}</Text>
                                    <Text style={styles.groupDescription}>{group.debtDescription}</Text>
                                    <Text
                                        style={styles.userDebt}>{`Sua dívida: ${userDebts[group.groupId] || 0}`}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                <View style={styles.addGroupButtonView}>
                    <TouchableOpacity onPress={onPressAdicionarGrupo} style={styles.addGroupButton}>
                        <Ionicons name="add-circle-outline" size={28} color="white" style={styles.addIcon}/>
                        <Text style={styles.addText}>Adicionar novo grupo</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default HomeScreen;
