import React, {useEffect, useRef, useState} from 'react';
import {Image, ScrollView, Text, TextInput, TouchableOpacity, View} from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import * as Notifications from 'expo-notifications';
import {DocumentData} from 'firebase/firestore';
import {useNavigation} from '@react-navigation/native';

import {registerForPushNotificationsAsync,} from '../../resources/notifications';

import {readUser} from '../../../backend/user-config/user-service';
import {getDebtsForUser, getGroups} from '../../../backend/group-config/group-service';

import styles from './HomeScreenStyles';
import {Props} from './types';

const SearchBar = ({
                       placeholder,
                       onChangeText
                   }: {
    placeholder: string,
    onChangeText: (text: string) => void
}) => {
    return (
        <View style={styles.searchBarContainer}>
            <TextInput
                style={styles.searchInput}
                placeholder={placeholder}
                onChangeText={onChangeText}
            />
        </View>
    );
};

const HomeScreen = ({
                        route
                    }: Props) => {
    const {uid} = route.params;
    const [userName, setUserName] = useState('');
    const [groups, setGroups] = useState<DocumentData[]>([]);
    const navigation = useNavigation();
    const [expoPushToken, setExpoPushToken] = useState<any>('');
    const [notification, setNotification] = useState<any>();
    const notificationListener = useRef<any>();
    const responseListener = useRef<any>();
    const [userDebts, setUserDebts] = useState<Map<string, number>>(new Map());
    const [searchText, setSearchText] = useState('');

    const filteredGroups = groups.filter(group =>
        group.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const onPressAdicionarGrupo = () => {
        navigation.navigate('CreateGroup', {uid});
        console.log('Criando grupo');
    };

    const navigateToGroup = (groupId: string) => {
        console.log('Navegar para o grupo: ', groupId);
        navigation.navigate('GroupScreen', {groupId});
    };

    const fetchUserDataAndGroups = async () => {
        try {
            const userData = await readUser(uid);
            if (userData && userData.name) {
                setUserName(userData.name);
            }

            // Fetch the list of groups
            const allGroupsData: DocumentData[] = await getGroups();

            // Filter the groups to only include those in the user's groups array
            const userGroupsData = allGroupsData.filter((group) =>
                userData?.groups ? userData.groups.includes(group.groupId) : []
            );

            setGroups(userGroupsData);
        } catch (error) {
            console.error('Error fetching user data and groups:', error);
        }
    };

    // Função para obter e definir o nome do usuário
    const fetchUserName = async () => {
        try {
            const userData = await readUser(uid);

            if (userData && userData.name) {
                setUserName(userData.name);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        // Quando o componente montar, carregue o nome do usuário
        fetchUserName();
        fetchUserDataAndGroups();

        const fetchUserDebts = async () => {
            try {
                const userDebts = await getDebtsForUser(uid)

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

        registerForPushNotificationsAsync()
            .then((token) => setExpoPushToken(token))
            .catch(() => {
            });

        notificationListener.current = Notifications.addNotificationReceivedListener(
            (notification) => {
                setNotification(notification);
            }
        );

        responseListener.current = Notifications.addNotificationResponseReceivedListener(
            (response) => {
                console.log(response);
            }
        );

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.profileContent}>
                    <Image
                        source={{
                            uri:
                                'https://picsum.photos/300/310',
                        }}
                        style={styles.profileImage}
                    />
                    <Text style={styles.profileName}>{userName}</Text>
                </View>
                <View style={styles.notificationContent}>
                    <Ionicons name="notifications-outline" size={28} color="white"/>
                </View>
            </View>
            <View style={styles.searchBarContainer}>
                <Ionicons name="search-outline" size={24} color="black"/>
                <TextInput
                    style={styles.searchInput}
                    placeholder={'Pesquisar'}
                    onChangeText={(text) => setSearchText(text)}
                />
            </View>
            <View style={styles.groupListTitleView}>
                <Text style={styles.groupsListTitle}>Grupos</Text>
            </View>
            <ScrollView style={styles.list}>
                {filteredGroups.map((group) => (
                    <TouchableOpacity
                        key={group.groupId}
                        onPress={() => navigateToGroup(group.groupId)}
                    >
                        <View style={styles.listItem} key={group.groupId}>
                            <View style={styles.groupImageContainer}>
                                <Ionicons name="people-outline" size={28} color="white"/>
                            </View>
                            <View style={styles.groupInfo}>
                                <Text style={styles.groupName}>{group.name}</Text>
                                <Text style={styles.groupDescription}>
                                    {group.debtDescription}
                                </Text>
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
    );
};

export default HomeScreen;
