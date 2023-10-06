import React, {useEffect, useRef, useState} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View, TextInput} from 'react-native';
import styles from './HomeScreenStyles';
import Ionicons from '@expo/vector-icons/Ionicons';
import {readUser} from '../../../backend/user-config/user-service';
import {getDebtsForUser, getGroups} from '../../../backend/group-config/group-service';
import {DocumentData} from 'firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {useUserStore} from '../../store/user';
import {registerForPushNotificationsAsync,} from '../../resources/notifications';
import firebase from 'firebase/compat';
import * as Notifications from 'expo-notifications';

type RootStackParamList = {
    Home: undefined;
    GroupScreen: { groupId: string };
};

const SearchBar = ({ placeholder, onChangeText }) => {
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



const HomeScreen = ({route}) => {
    const {uid} = route.params;
    const [userName, setUserName] = useState('');
    const [groups, setGroups] = useState<DocumentData[]>([]);
    const navigation = useNavigation();
    const {email} = useUserStore();
    const [expoPushToken, setExpoPushToken] = useState<any>('');
    const [notification, setNotification] = useState<any>();
    const notificationListener = useRef<any>();
    const responseListener = useRef<any>();
    const [userData, setUserData] = useState<firebase.User | null>(null);
    const [userDebts, setUserDebts] = useState<Map<string, number>>(new Map());
    const [searchText, setSearchText] = useState('');
    
    const filteredGroups = groups.filter(group =>
        group.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const onPressAdicionarGrupo = () => {
        // Lógica para adicionar novo grupo
        console.log('Novo grupo adicionado!');
        // Adicione sua lógica aqui, como abrir um modal ou navegar para outra tela
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
                userData.groups.includes(group.groupId)
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
                                'https://s2-valor.glbimg.com/LZyCSHR22BjRuB06S60vWzmKJqQ=/0x0:5408x3355/888x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_63b422c2caee4269b8b34177e8876b93/internal_photos/bs/2020/T/A/fuvfecS5Od2cxQlrQ5Pw/kym-mackinnon-aerego3rque-unsplash.jpg',
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
            {/*<Button*/}
            {/*    title="Press to schedule a notification"*/}
            {/*    onPress={() => schedulePushNotification()}*/}
            {/*/>*/}
        </View>
    );
};

export default HomeScreen;
