import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, FlatList, Modal, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';

import { getUsers } from '../../../backend/user-config/user-service';
import { createGroupWithSharedDebt } from '../../../backend/group-config/group-service';
import { styles } from './CreateGroupScreenStyles';

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
        const userListWithoutAdmin = userList.filter(user => user.userId !== adminUserId);
        setUsers(userListWithoutAdmin);
    };

    // Função para abrir ou fechar o modal
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    // Função para adicionar um participante ao grupo
    const addParticipant = (userId) => {
      if (!participants.includes(userId)) {
        setParticipants([...participants, userId]); // Se o ID não estiver na lista, adicione-o
      } else {
        console.log('Este usuário já está na lista de participantes');
      }
    };
    
    const createGroupThenBackHome = () => {
      createGroupWithSharedDebt(
                groupName,
                adminUserId,
                pix,
                total,
                "equals",
                participants);
      navigation.goBack();
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
          <View style={styles.headerSpacer} />
        </View>
    
        <Text style={styles.label}>Nome do Grupo</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome do grupo"
          value={groupName}
          onChangeText={text => setGroupName(text)}
        />

        <Text style={styles.label}>PIX</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite a chave PIX do grupo"
          value={pix}
          onChangeText={text => setPix(text)}
        />

        <Text style={styles.label}>Valor Total</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o valor a ser dividido"
          value={total}
          onChangeText={text => setTotal(text)}
          keyboardType="numeric"
        />
    
        <TouchableOpacity style={styles.participantsButton} onPress={toggleModal}>
          <Text style={styles.buttonText}>Adicionar Participante</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={toggleModal}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Lista de Usuários</Text>
            <FlatList
              data={users}
              keyExtractor={item => item.userId}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalContent}
                  onPress={() => addParticipant(item.userId)}
                >
                  <Text style={styles.modalItem}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={toggleModal}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </Modal>
    
        <TouchableOpacity style={styles.createButton} onPress={createGroupThenBackHome}>
          <Text style={styles.buttonText}>Criar Grupo</Text>
        </TouchableOpacity>
      </View>
    );

}

export default CreateGroupScreen;