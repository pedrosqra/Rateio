import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator,
    Image,
    Modal,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import * as Clipboard from 'expo-clipboard';

import {AntDesign, Feather} from '@expo/vector-icons';
import {DocumentData} from 'firebase/firestore';

import {
    addUserToGroup,
    deleteGroup,
    deleteUserFromGroup,
    getGroupById,
    getGroupDebts,
    setDebtAsPaid,
    updateGroup
} from '../../../backend/group-config/group-service';
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

const ConfirmRemoveUserDialog = ({ visible, message, onConfirm, onCancel }) => {
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#1CC29F" }}>
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
          <Text>{message}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
            <TouchableOpacity onPress={onConfirm}>
              <Text>Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onCancel}>
              <Text>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};


const GroupScreen = ({navigation, route}: Props) => {
    const groupId = route.params.groupId;
    const userAdminId = route.params.uid;

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [valorMonetario, setValorMonetario] = useState(0);
    const [simboloAtivo, setSimboloAtivo] = useState(false);
    const [groupData, setGroupData] = useState<DocumentData | null>({debtFinalDate: null});
    const [participantNames, setParticipantNames] = useState<string[]>([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [debts, setDebts] = useState<Map<string, DocumentData>>(new Map());
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [confirmDialogMessage, setConfirmDialogMessage] = useState('');
    const [showRemoveUserDialog, setShowRemoveUserDialog] = useState(false);
    const [debtProcessingMap, setDebtProcessingMap] = useState(new Map());
    const [showActivityIndicator, setShowActivityIndicator] = useState(false);
    const [userIdToRemove, setUserIdToRemove] = useState('');


    useEffect(() => {

        const fetchDebts = async () => {
            try {
                const debtData = await getGroupDebts(groupId);

                const debtMap = new Map<string, DocumentData>();

                debtData.forEach((debt) => {
                    debtMap.set(debt.debtorId, debt);
                });

                setDebts(debtMap);
                console.log(debtMap)
            } catch (error) {
                console.error('Error fetching group debts:', error);
            }
        };

        fetchDebts();

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

        console.log('leitura GRUPO')

    }, [groupId]);

    const updateGroupData = async () => {
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
        }
    };

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

    const setDebtProcessingForParticipant = (participantId, isProcessing) => {
        setDebtProcessingMap((prevState) => {
            const newState = new Map(prevState);
            newState.set(participantId, isProcessing);
            return newState;
        });
    };

    const toggleSimbolo = () => {
        setSimboloAtivo(!simboloAtivo);
    };

    const handleAddUserToGroup = () => {
        setShowActivityIndicator(true);
        addUserToGroup(groupId, userEmail)
            .then(() => {
                console.log('User was added to the group.');
                updateGroupData();
                setShowActivityIndicator(false);
            })
            .catch((error) => {
                console.error('Error adding user to the group:', error);
            });

        setModalVisible(false);
    };


    const handleDeleteGroup = () => {
        setConfirmDialogMessage("Tem certeza que quer apagar o grupo?");
        setShowConfirmDialog(true);
    };

    const handleConfirmDeleteGroup = () => {
        deleteGroup(groupId)
            .then(() => {
                console.log("Group deleted");
                setShowConfirmDialog(false);
                navigation.goBack();
            });
    };

    const handleCancelDeleteGroup = () => {
        setShowConfirmDialog(false);
    };

    const handleMarkDebtPaid = async (userId: string) => {
        if (groupData.adminId === userAdminId) {
            if (debts) {
                const userDebt = debts.get(userId);
                if (userDebt) {
                    const isPaid = !userDebt.isPaid;


                    try {
                        await setDebtAsPaid(userDebt.groupId, userDebt.debtorId, isPaid);
                        const updatedDebt = {...userDebt, isPaid};
                        debts.set(userId, updatedDebt);
                        setDebts(new Map(debts));
                    } catch (error) {
                        console.error('Error updating debt payment:', error);
                    }
                }
            }
        }
    };

    const handleRemoveMember = async (userId: string) => {   
        setUserIdToRemove(userId);
        setShowRemoveUserDialog(true);
    };

    const copyToClipboard = async (text) => {
        await Clipboard.setStringAsync(text);
    };

    const handleConfirmRemoveUser = async () => {
        console.log(userIdToRemove, groupData.adminId, userAdminId)
        if (groupData.adminId === userAdminId) {
            setShowActivityIndicator(true);
            try {
                await deleteUserFromGroup(groupId, userIdToRemove);
                updateGroupData();
            } catch (error) {
                console.error('Error removing user:', error);
            }
            setShowActivityIndicator(false);
        } 
        setShowRemoveUserDialog(false);
        navigation.goBack()
    };

    const handleCancelRemoveUser = () => {
        setShowRemoveUserDialog(false);
    };

    return (
        <ScrollView style={styles.containerScroll}>
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
                                uri: 'https://picsum.photos/500/510'
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
                                </View>
                            </Pressable>
                            <Pressable
                                style={styles.inline}
                            >
                                <Text style={styles.textBold}>Pix</Text>
                                <TouchableOpacity onPress={() => copyToClipboard(groupData?.adminPix)}>
                                    <View style={styles.innerGroup}>
                                        <Feather style={styles.copy} name="copy" size={16}/>
                                        <Text style={styles.text}>{groupData?.adminPix}</Text>
                                    </View>
                                </TouchableOpacity>
                            </Pressable>
                            <Pressable
                                style={styles.inline}
                            >
                                <Text style={styles.textBold}>Valor Total</Text>
                                <View style={styles.innerGroup}>
                                    <Text style={styles.text}>R$: {groupData?.debtAmount}</Text>
                                </View>
                            </Pressable>
                            <Pressable
                                style={styles.inline}
                            >
                                <Text style={styles.textBold}>Convite</Text>
                                <TouchableOpacity
                                    onPress={() => copyToClipboard("Bora dividir? Participe do meu rateio: " + groupData?.groupIdInvite)}>
                                    <View style={styles.innerGroup}>
                                        <Feather style={styles.copy} name="copy" size={16}/>
                                        <Text style={styles.text}> {groupData?.groupIdInvite}</Text>
                                    </View>
                                </TouchableOpacity>
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
                            {showActivityIndicator ? (
                                <ActivityIndicator size="large" color="#373B3F"/>
                            ) : (
                                groupData?.members && (
                                    <ScrollView style={styles.scrollView}>
                                        {groupData.members.map((participantId: string, index: number) => (
                                            <View key={index} style={styles.participantInfo}>
                                                <View style={styles.participantStyle}>
                                                    <Image
                                                        source={{
                                                            uri: 'https://picsum.photos/200/310',
                                                        }}
                                                        style={styles.participantImage}
                                                    />
                                                    <Text
                                                        style={styles.participantName}>{participantNames[index]}</Text>
                                                </View>
                                                <View style={styles.actionButtons}>
                                                    <TouchableOpacity
                                                        style={
                                                            debts.get(participantId)?.isPaid
                                                                ? styles.markDebtButtonPaid
                                                                : styles.markDebtButtonUnpaid
                                                        }
                                                        onPress={() => {
                                                            setDebtProcessingForParticipant(participantId, true);
                                                            handleMarkDebtPaid(participantId).then(() => {
                                                                setDebtProcessingForParticipant(participantId, false);
                                                            });
                                                        }}
                                                    >
                                                        {debtProcessingMap.get(participantId) ? (
                                                            <ActivityIndicator size="small" color="white"/>
                                                        ) : (
                                                            <Text
                                                                style={
                                                                    debts.get(participantId)?.isPaid
                                                                        ? styles.markDebtButtonTextPaid
                                                                        : styles.markDebtButtonTextUnpaid
                                                                }
                                                            >
                                                                {debtProcessingMap.get(participantId) ? '...' : debts.get(participantId)?.isPaid ? 'Pago' : 'Não Pago'}
                                                            </Text>
                                                        )}
                                                    </TouchableOpacity>
                                                    {groupData.adminId === userAdminId && (
                                                        <TouchableOpacity
                                                            style={styles.removeButton}
                                                            onPress={() => handleRemoveMember(participantId)}
                                                        >
                                                            <Icon name="trash" size={20} color="white"/>
                                                        </TouchableOpacity>
                                                    )}
                                                </View>
                                            </View>
                                        ))}
                                    </ScrollView>
                                )
                            )}
                        </View>
                        {groupData.adminId === userAdminId && (
                            <>
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
                                <ConfirmRemoveUserDialog
                                    visible={showRemoveUserDialog}
                                    message="Tem certeza que quer remover o participante?"
                                    onConfirm={handleConfirmRemoveUser}
                                    onCancel={handleCancelRemoveUser}
                                />
                            </>)}
                    </>
                )}
            </View>
        </ScrollView>
    );
};

export default GroupScreen;
