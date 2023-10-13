import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Image, Modal, Pressable, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {AntDesign, MaterialIcons} from '@expo/vector-icons';
import {DocumentData} from 'firebase/firestore';

import {addUserToGroup, deleteGroup, getGroupById, updateGroup} from '../../../backend/group-config/group-service';
import {styles} from './GroupScreenStyles';
import {Props} from './types';
import {readUser} from '../../../backend/user-config/user-service';
import Icon from "react-native-vector-icons/FontAwesome";

const ConfirmDialog = ({visible, message, onConfirm, onCancel}) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
        >
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#1CC29F"}}>
                <View style={{backgroundColor: 'white', padding: 20, borderRadius: 10}}>
                    <Text>{message}</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 20}}>
                        <TouchableOpacity onPress={onConfirm}>
                            <Text>OK</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onCancel}>
                            <Text>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const GroupScreen = ({navigation, route}: Props) => {
    const groupId = route.params.groupId;

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    const [valorMonetario, setValorMonetario] = useState(0);
    const [simboloAtivo, setSimboloAtivo] = useState(false);
    const [groupData, setGroupData] = useState<DocumentData | null>({debtFinalDate: null});
    const [participantNames, setParticipantNames] = useState<string[]>([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [confirmDialogMessage, setConfirmDialogMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            try {
                const data = await getGroupById(groupId);
                setGroupData(data || {debtFinalDate: null});

                const names = await Promise.all((data?.members || []).map(async (participantId: string) => {
                    const userData = await readUser(participantId);
                    return userData?.name || 'Unknown';
                }));

                setParticipantNames(names);
            } catch (error) {
                console.error('Error reading the group:', error);
                setError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [groupId]);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const aumentarValor = async () => {
        try {
            if (groupData) {
                const updatedDebtAmount = groupData.debtAmount + 10;

                await updateGroup(groupId, {debtAmount: updatedDebtAmount});

                setValorMonetario(updatedDebtAmount);

                const updatedData = await getGroupById(groupId);
                setGroupData(updatedData);
            }
        } catch (error) {
            console.error('Error increasing debtAmount:', error);
        }
    };

    const diminuirValor = async () => {
        try {
            if (groupData) {
                const updatedDebtAmount = groupData.debtAmount - 10;

                await updateGroup(groupId, {debtAmount: updatedDebtAmount});

                setValorMonetario(updatedDebtAmount);

                const updatedData = await getGroupById(groupId);
                setGroupData(updatedData);
            }
        } catch (error) {
            console.error('Error decreasing debtAmount:', error);
        }
    };

    const toggleSimbolo = () => {
        setSimboloAtivo(!simboloAtivo);
    };

    const handleAddUserToGroup = () => {
        addUserToGroup(groupId, userEmail).then(r => console.log('User was added to the group.'));
        setModalVisible(false);
    }

    const handleDeleteGroup = () => {
        setConfirmDialogMessage("Tem certeza que quer apagar o grupo?");
        setShowConfirmDialog(true);
    };

    const handleConfirmDeleteGroup = () => {
        deleteGroup(groupId)
            .then(() => {
                console.log("Group deleted");
                setShowConfirmDialog(false);
                navigation.goBack(); // Navigate back to the previous screen
            });
    };

    const handleCancelDeleteGroup = () => {
        setShowConfirmDialog(false);
    };

    return (
        <View style={styles.container}>
            <AntDesign
                onPress={() => navigation.goBack()}
                name="arrowleft"
                size={30}
                color="white"
                style={styles.arrow}
            />
            {isLoading ? (
                <ActivityIndicator size={'large'} color={'#fff'}/>
            ) : error ? (
                <Text>Error loading group data</Text>
            ) : (
                <>
                    <Image
                        source={{
                            uri: 'https://picsum.photos/200/320',
                        }}
                        style={styles.image}
                    />
                    <View style={styles.groupInfo}>
                        <Pressable
                            onPress={() => console.log('GROUP PRESS')}
                            style={styles.inline}
                        >
                            <Text style={styles.textBold}>Nome do grupo</Text>
                            <View style={styles.innerGroup}>
                                <Text style={styles.text}>{groupData?.name}</Text>
                                <AntDesign name="right" size={12}/>
                            </View>
                        </Pressable>
                        <Pressable
                            style={styles.inline}
                        >
                            <Text style={styles.textBold}>Pix</Text>
                            <View style={styles.innerGroup}>
                                <Text style={styles.text}>{groupData?.adminPix}</Text>
                                <AntDesign name="key" size={12}/>
                            </View>
                        </Pressable>
                        <Pressable
                            style={styles.inline}
                        >
                            <Text style={styles.textBold}>Valor Total</Text>
                            <View style={styles.innerGroup}>
                                <Text style={styles.text}>R$: {groupData?.debtAmount}</Text>
                                <MaterialIcons name="attach-money" size={12}/>
                            </View>
                        </Pressable>
                    </View>
                    <View style={styles.groupInfo}>
                        <Pressable
                            onPress={() => console.log('PARTICIPANTS PRESS')}
                            style={styles.inline}
                        >
                            <Text style={styles.textBold}>Participantes</Text>
                            <AntDesign name="right" size={12}/>
                        </Pressable>
                        {groupData?.members &&
                            groupData.members.map((_, index: number) => (
                                <View key={index} style={styles.participantInfo}>
                                    <Image
                                        source={{
                                            uri: 'https://picsum.photos/200/310',
                                        }}
                                        style={styles.participantImage}
                                    />
                                    <Text style={styles.participantName}>
                                        {participantNames[index]}
                                    </Text>
                                </View>
                            ))}
                    </View>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={isModalVisible}
                        onRequestClose={toggleModal}
                    >
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Adicionar Usuário</Text>
                            <View style={styles.inputContainer}>
                                <Icon name="envelope" size={20} color="#1CC29F" style={styles.icon}/>
                                <TextInput
                                    value={userEmail}
                                    style={styles.input}
                                    placeholder="Email"
                                    placeholderTextColor={styles.placeholderText.color}
                                    autoCapitalize="none"
                                    onChangeText={(text) => setUserEmail(text)}
                                />
                            </View>
                            <TouchableOpacity onPress={handleAddUserToGroup} style={styles.modalButton}>
                                <Text style={styles.confirmButtonText}>Confirmar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={toggleModal}
                            >
                                <Text style={styles.buttonText}>Fechar</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    <TouchableOpacity style={styles.button} onPress={toggleModal}>
                        <Text style={styles.buttonAddText}>Adicionar Participante</Text>
                    </TouchableOpacity>
                    <Pressable
                        onPress={handleDeleteGroup}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Finalizar Grupo</Text>
                    </Pressable>

                    <ConfirmDialog
                        visible={showConfirmDialog}
                        message={confirmDialogMessage}
                        onConfirm={handleConfirmDeleteGroup}
                        onCancel={handleCancelDeleteGroup}
                    />
                </>
            )}
        </View>
    );
};

export default GroupScreen;
