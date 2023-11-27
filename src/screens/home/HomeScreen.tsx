import React, {useState} from 'react'
import {ActivityIndicator, Image, ScrollView, Text, TextInput, TouchableOpacity, View,} from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import {CommonActions, useFocusEffect, useNavigation,} from '@react-navigation/native'
import {DocumentData} from 'firebase/firestore'
import {readUser, signOut} from '../../../backend/user-config/user-service'
import {getDebtsForUser, getGroups,} from '../../../backend/group-config/group-service'

import styles from './HomeScreenStyles'
import {Props} from './types'

const HomeScreen = ({route}: Props) => {
    const {uid} = route.params
    const [userName, setUserName] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [groups, setGroups] = useState<DocumentData[]>([])
    const navigation = useNavigation()
    const [userDebts, setUserDebts] = useState<Map<string, number>>(new Map())
    const [searchText, setSearchText] = useState('')
    const [isLoading, setIsLoading] = useState(true) // Add a loading state
    const [refreshKey, setRefreshKey] = useState(0)
    const [invite, setInvite] = useState('')
    const [isModalVisible, setModalVisible] = useState(false)

    const refreshData = () => {
        setRefreshKey((prevKey) => prevKey + 1)
    }

    const filteredGroups = groups.filter((group) =>
        group.name.toLowerCase().includes(searchText.toLowerCase())
    )

    const toggleModal = () => {
        setModalVisible(!isModalVisible)
    }

    const onPressAdicionarGrupo = () => {
        navigation.navigate('CreateGroup', {uid, refreshData})
        console.log('Criando grupo')
    }

    const onPressJoinGroupPage = () => {
        navigation.navigate('JoinGroup', {userEmail, refreshData})
        console.log('Entrando em grupo: ', userEmail)
    }

    const onPressProfile = () => {
        navigation.navigate('Profile', {userId: uid})
        console.log('Abrir Perfil')
    }

    const navigateToGroup = (groupId: string) => {
        navigation.navigate('GroupScreen', {groupId, uid})
    }

    const fetchUserDataAndGroups = async () => {
        try {
            const userData = await readUser(uid)
            if (userData && userData.name && userData.email) {
                setUserName(userData.name)
                setUserEmail(userData.email)
            }

            // Fetch the list of groups
            const allGroupsData: DocumentData[] = await getGroups()

            // Filter the groups to only include those in the user's groups array
            const userGroupsData = allGroupsData.filter((group) =>
                userData?.groups ? userData.groups.includes(group.groupId) : []
            )

            setGroups(userGroupsData)
        } catch (error) {
            console.error('Error fetching user data and groups:', error)
        } finally {
            setIsLoading(false) // Ensure loading state is set to false
        }
    }

    const fetchUserDebts = async () => {
        try {
            const userDebts = await getDebtsForUser(uid)
            const debtMap = new Map()

            userDebts.forEach((debt) => {
                debtMap.set(debt.groupId, debt.amount)
            })

            setUserDebts(debtMap)
        } catch (error) {
            console.error('Error fetching user debts:', error)
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            // Fetch user debts and groups
            Promise.all([fetchUserDebts(), fetchUserDataAndGroups()])
            console.log('leitura HOME')
        }, [route.params, refreshKey]) // Remova groups daqui
    )

    const handleLogout = async () => {
        try {
            await signOut() // Sign the user out
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{name: 'Login'}], // Navigate to the Login screen
                })
            )
        } catch (error) {
            console.error('Error logging out:', error)
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.profileContent}
                    onPress={onPressProfile}
                >
                    <Image
                        source={{
                            uri: 'https://picsum.photos/300/310',
                        }}
                        style={styles.profileImage}
                    />
                    {isLoading ? (
                        <View style={styles.loadingContainerStyle}>
                            <ActivityIndicator size="large" color="#1CC29F"/>
                        </View>
                    ) : (
                        <Text style={styles.profileName}>{userName}</Text>
                    )}
                </TouchableOpacity>
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

            <View style={styles.groupListHeaderView}>
                <Text style={styles.groupsListTitle}>Grupos</Text>
            </View>

            {isLoading ? (
                <View style={styles.loadingContainerStyle}>
                    <ActivityIndicator size="large" color="#1CC29F"/>
                </View>
            ) : (
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
                                    {userDebts && (
                                        <Text style={styles.groupDescription}>
                                            Sua parte: R${userDebts.get(group.groupId)}
                                        </Text>
                                    )}
                                    <Text style={styles.groupDescription}>
                                        {group.debtDescription}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
            <View style={styles.addGroupButtonView}>
                <TouchableOpacity onPress={onPressJoinGroupPage} style={styles.addGroupButton}>
                    <Ionicons
                        name="people"
                        size={28}
                        color="white"
                        style={styles.addIcon}
                    />
                    <Text style={styles.addText}>Entrar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onPressAdicionarGrupo}
                    style={styles.addGroupButton}
                >
                    <Ionicons
                        name="add-circle-outline"
                        size={28}
                        color="white"
                        style={styles.addIcon}
                    />
                    <Text style={styles.addText}>Criar</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default HomeScreen
