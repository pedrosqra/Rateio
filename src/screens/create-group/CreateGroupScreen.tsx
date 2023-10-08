import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, FlatList, Modal, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getUsers } from '../../../backend/user-config/user-service';
import { createGroupWithSharedDebt } from '../../../backend/group-config/group-service';

function CreateGroupScreen({ route }) {
    const adminUserId = route.params.uid;
    const navigation = useNavigation();

    const [groupName, setGroupName] = useState('');
    const [pix, setPix] = useState('');
    const [total, setTotal] = useState('');
    const [participants, setParticipants] = useState([]);
    const [users, setUsers] = useState([]); // Lista de todos os usuários
    const [isModalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        const userList = await getUsers();
        setUsers(userList);
    };

    // Função para abrir ou fechar o modal
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    // Função para adicionar um participante ao grupo
    const addParticipant = (userId) => {
        setParticipants([...participants, userId]);
    };
    
    const createGroupThenBackHome = () => {
      createGroupWithSharedDebt(
                groupName,
                adminUserId,
                pix,
                total,
                "equals",
                participants);
      navigation.navigate('Home');
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text>Voltar</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Novo Grupo</Text>
                <View style={{ width: 60 }} />
            </View>

            <Text>Nome do Grupo:</Text>
            <TextInput
                placeholder="Digite o nome do grupo"
                value={groupName}
                onChangeText={text => setGroupName(text)}
            />

            <Text>Pix:</Text>
            <TextInput
                placeholder="Digite o valor PIX"
                value={pix}
                onChangeText={text => setPix(text)}
            />

            <Text>Total:</Text>
            <TextInput
                placeholder="Digite o valor total"
                value={total}
                onChangeText={text => setTotal(text)}
                keyboardType="numeric"
            />

            <Button title="Participantes" onPress={toggleModal} />

            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={toggleModal}
            >
                <View>
                    <Text>Lista de Usuários:</Text>
                    <FlatList
                        data={users}
                        keyExtractor={item => item.userId}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => addParticipant(item.userId)}>
                                <Text>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                    <Pressable onPress={toggleModal}>
                        <Text>Fechar</Text>
                    </Pressable>
                </View>
            </Modal>

            <Button title="Criar Grupo" onPress={createGroupThenBackHome} />
        </View>
    );
}

export default CreateGroupScreen;