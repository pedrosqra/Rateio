import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {AntDesign} from '@expo/vector-icons';

import {getUsers} from '../../../backend/user-config/user-service';
import {createGroupWithSharedDebt} from '../../../backend/group-config/group-service';
import {styles} from './CreateGroupScreenStyles';

function CreateGroupScreen({route}) {
    const adminUserId = route.params.uid;
    const navigation = useNavigation();

    const [groupName, setGroupName] = useState('----');
    const [pix, setPix] = useState('------------');
    const [total, setTotal] = useState('$ 0,00');
    const [participants, setParticipants] = useState([]);
    const [users, setUsers] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);

    // New state variable to track group creation in progress
    const [creatingGroup, setCreatingGroup] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        const userList = await getUsers();
        const userListWithoutAdmin = userList.filter((user) => user.userId !== adminUserId);
        setUsers(userListWithoutAdmin);
    };

    const createGroupThenBackHome = async () => {
        // Set creatingGroup to true to show the ActivityIndicator
        setCreatingGroup(true);

        await createGroupWithSharedDebt(groupName, adminUserId, pix, total, 'equals', participants);
        route.params.refreshData();

        // Delayed navigation or any other actions

        setTimeout(() => {
            // Set creatingGroup back to false to hide the ActivityIndicator
            setCreatingGroup(false);
            navigation.goBack();
        }, 1500);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <AntDesign
                    onPress={() => navigation.goBack()}
                    name="arrowleft"
                    size={30}
                    color="white"
                    style={styles.arrow}
                />
                <Text style={styles.headerText}>Novo Grupo</Text>
                <View style={styles.headerSpacer}/>
            </View>

            <Text style={styles.label}>Nome do Grupo</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite o nome do grupo"
                value={groupName}
                onChangeText={(text) => setGroupName(text)}
            />

            <Text style={styles.label}>PIX</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite a chave PIX do grupo"
                value={pix}
                onChangeText={(text) => setPix(text)}
            />

            <Text style={styles.label}>Valor Total</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite o valor a ser dividido"
                value={total}
                onChangeText={(text) => setTotal(text)}
                keyboardType="numeric"
            />

            <TouchableOpacity style={styles.createButton} onPress={createGroupThenBackHome}>
                {creatingGroup ? (
                    <ActivityIndicator size="small" color="white"/>
                ) : (
                    <Text style={styles.buttonText}>Criar Grupo</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

export default CreateGroupScreen;
