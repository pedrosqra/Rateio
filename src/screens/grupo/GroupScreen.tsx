import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as Clipboard from "expo-clipboard";

import { AntDesign, Feather } from "@expo/vector-icons";
import { DocumentData } from "firebase/firestore";

import {
  addUserToGroup,
  deleteGroup,
  deleteUserFromGroup,
  getGroupById,
  getGroupDebts,
  setDebtAsPaid,
  setDebtAsVerified,
  verifyDebit,
} from "../../../backend/group-config/group-service";
import { styles } from "./GroupScreenStyles";
import { Props } from "./types";
import { readUser } from "../../../backend/user-config/user-service";
import Icon from "react-native-vector-icons/FontAwesome";

const ConfirmDialog = ({ visible, message, onConfirm, onCancel }) => {
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1CC29F",
        }}
      >
        <View
          style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}
        >
          <Text>{message}</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: 20,
            }}
          >
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
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1CC29F",
        }}
      >
        <View
          style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}
        >
          <Text>{message}</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: 20,
            }}
          >
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

const GroupScreen = ({ navigation, route }: Props) => {
  const groupId = route.params.groupId;
  const userAdminId = route.params.uid;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [valorMonetario, setValorMonetario] = useState(0);
  const [simboloAtivo, setSimboloAtivo] = useState(false);
  const [groupData, setGroupData] = useState<DocumentData | null>({
    debtFinalDate: null,
  });
  const [participantNames, setParticipantNames] = useState<string[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [debts, setDebts] = useState<Map<string, DocumentData>>(new Map());
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmDialogMessage, setConfirmDialogMessage] = useState("");
  const [showRemoveUserDialog, setShowRemoveUserDialog] = useState(false);
  const [debtProcessingMap, setDebtProcessingMap] = useState(new Map());
  const [showActivityIndicator, setShowActivityIndicator] = useState(false);
  const [userIdToRemove, setUserIdToRemove] = useState("");

  useEffect(() => {
    const fetchDebts = async () => {
      try {
        const debtData = await getGroupDebts(groupId);

        const debtMap = new Map<string, DocumentData>();

        debtData.forEach((debt) => {
          debtMap.set(debt.debtorId, debt);
        });

        setDebts(debtMap);
      } catch (error) {
        console.error("Error fetching group debts:", error);
      }
    };

    fetchDebts();

    const fetchData = async () => {
      setIsLoading(true);

      try {
        const data = await getGroupById(groupId);
        setGroupData(data || { debtFinalDate: null });

        const names = await Promise.all(
          (data?.members || []).map(async (participantId: string) => {
            const userData = await readUser(participantId);
            return userData?.name || "Unknown";
          })
        );

        setParticipantNames(names);
      } catch (error) {
        console.error("Error reading the group:", error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    console.log("leitura GRUPO");
  }, [groupId]);

  const updateGroupData = async () => {
    try {
      const data = await getGroupById(groupId);
      setGroupData(data || { debtFinalDate: null });

      const names = await Promise.all(
        (data?.members || []).map(async (participantId: string) => {
          const userData = await readUser(participantId);
          return userData?.name || "Unknown";
        })
      );

      setParticipantNames(names);
    } catch (error) {
      console.error("Error reading the group:", error);
      setError(true);
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const setDebtProcessingForParticipant = (participantId, isProcessing) => {
    setDebtProcessingMap((prevState) => {
      const newState = new Map(prevState);
      newState.set(participantId, isProcessing);
      return newState;
    });
  };

  const handleAddUserToGroup = () => {
    setShowActivityIndicator(true);
    addUserToGroup(groupId, userEmail)
      .then(() => {
        console.log("User was added to the group.");
        updateGroupData();
        setShowActivityIndicator(false);
      })
      .catch((error) => {
        console.error("Error adding user to the group:", error);
      });

    setModalVisible(false);
  };

  const handleDeleteGroup = () => {
    setConfirmDialogMessage("Tem certeza que quer apagar o grupo?");
    setShowConfirmDialog(true);
  };

  const handleConfirmDeleteGroup = () => {
    deleteGroup(groupId).then(() => {
      console.log("Group deleted");
      setShowConfirmDialog(false);
      navigation.goBack();
    });
  };

  const handleCancelDeleteGroup = () => {
    setShowConfirmDialog(false);
  };

  const handleMarkDebtPaid = async (userId: string, shouldPay?: boolean) => {
    if (debts) {
      const userDebt = debts.get(userId);
      if (userDebt) {
        const isPaid = shouldPay === undefined ? !userDebt.isPaid : shouldPay

        try {
          await setDebtAsPaid(userDebt.groupId, userDebt.debtorId);
          const updatedDebt = { ...userDebt, isPaid, verified: isPaid };
          debts.set(userId, updatedDebt);
          setDebts(new Map(debts));
        } catch (error) {
          console.error("Error updating debt payment:", error);
        }
      }
    }
  };

  const handleVerifyDebit = async (userId: string, verified: boolean) => {
    if (debts) {
      const userDebt = debts.get(userId);
      if (userDebt) {
        try {
          await verifyDebit(userDebt.groupId, userDebt.debtorId, verified);
          const updatedDebt = {
            ...userDebt,
            isPaid: verified,
            verified: verified,
          };
          debts.set(userId, updatedDebt);
          setDebts(new Map(debts));
        } catch (error) {
          console.error("Error updating debt payment:", error);
        }
      }
    }
  };

  const handleMarkDebtVerified = async (userId: string) => {
    if (debts) {
      const userDebt = debts.get(userId);
      if (userDebt) {
        try {
          await setDebtAsVerified(userDebt.groupId, userDebt.debtorId);
          const updatedDebt = { ...userDebt, verified: true };
          debts.set(userId, updatedDebt);
          setDebts(new Map(debts));
        } catch (error) {
          console.error("Error verifying debt payment:", error);
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
    if (groupData.adminId === userAdminId) {
      setShowActivityIndicator(true);
      try {
        await deleteUserFromGroup(groupId, userIdToRemove);
        updateGroupData();
      } catch (error) {
        console.error("Error removing user:", error);
      }
      setShowActivityIndicator(false);
    }
    setShowRemoveUserDialog(false);
    navigation.goBack();
  };

  const handleCancelRemoveUser = () => {
    setShowRemoveUserDialog(false);
  };

  const handlePayPress = (participantId: string, isPaid: boolean) => {
    if (groupData?.adminId === userAdminId) {
      // Admin pressing
      setDebtProcessingForParticipant(participantId, true);
      handleMarkDebtPaid(participantId).then(() => {
        setDebtProcessingForParticipant(participantId, false);
      });
    } else {
      // Default user pressing
      if (participantId === userAdminId) {
        if (!isPaid) {
          setDebtProcessingForParticipant(participantId, true);
          handleMarkDebtVerified(participantId).then(() => {
            setDebtProcessingForParticipant(participantId, false);
          });
        } else {
          setDebtProcessingForParticipant(participantId, true);
          handleMarkDebtPaid(participantId, false).then(() => {
            setDebtProcessingForParticipant(participantId, false);
          });
        }
      }
    }
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
          <ActivityIndicator size={"large"} color={"#fff"} />
        ) : error ? (
          <Text>Error loading group data</Text>
        ) : (
          <>
            <Image
              source={{
                uri: "https://picsum.photos/500/510",
              }}
              style={styles.image}
            />
            <View style={styles.groupInfo}>
              <Pressable
                onPress={() => console.log("GROUP PRESS")}
                style={styles.inline}
              >
                <Text style={styles.textBold}>Nome do grupo</Text>
                <View style={styles.innerGroup}>
                  <Text
                    style={styles.text}
                    numberOfLines={2}
                    ellipsizeMode={"tail"}
                  >
                    {groupData?.name}
                  </Text>
                </View>
              </Pressable>
              <Pressable style={styles.inline}>
                <Text style={styles.textBold}>Pix</Text>
                <TouchableOpacity
                  onPress={() => copyToClipboard(groupData?.adminPix)}
                >
                  <View style={styles.innerGroup}>
                    <Feather style={styles.copy} name="copy" size={16} />
                    <Text
                      style={styles.text}
                      numberOfLines={1}
                      ellipsizeMode={"tail"}
                    >
                      {groupData?.adminPix}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Pressable>
              <Pressable style={styles.inline}>
                <Text style={styles.textBold}>Valor Total</Text>
                <View style={styles.innerGroup}>
                  <Text
                    style={styles.text}
                    numberOfLines={1}
                    ellipsizeMode={"tail"}
                  >
                    R$: {groupData?.debtAmount}
                  </Text>
                </View>
              </Pressable>
              <Pressable style={styles.inline}>
                <Text style={styles.textBold}>Convite</Text>
                <TouchableOpacity
                  onPress={() =>
                    copyToClipboard(
                      "Bora dividir? Participe do meu rateio: " +
                        groupData?.groupIdInvite
                    )
                  }
                >
                  <View style={styles.innerGroup}>
                    <Feather style={styles.copy} name="copy" size={16} />
                    <Text style={styles.text}> {groupData?.groupIdInvite}</Text>
                  </View>
                </TouchableOpacity>
              </Pressable>
            </View>
            <View style={styles.groupInfo}>
              <Pressable
                onPress={() => console.log("PARTICIPANTS PRESS")}
                style={styles.inline}
              >
                <Text style={styles.textBold}>Participantes</Text>
                <AntDesign name="right" size={12} />
              </Pressable>
              {showActivityIndicator ? (
                <ActivityIndicator size="large" color="#373B3F" />
              ) : (
                groupData?.members && (
                  <ScrollView style={styles.scrollView}>
                    {groupData.members.map(
                      (participantId: string, index: number) => {
                        const isAdmin = groupData.adminId === userAdminId;
                        const isPaid = debts.get(participantId)?.isPaid;
                        const isVerified = debts.get(participantId)?.verified;

                        const showVerifyButton =
                          isAdmin && !isPaid && isVerified;

                        const onConfirm = () => {
                          handleVerifyDebit(participantId, true);
                        };

                        const onCancel = () => {
                          handleVerifyDebit(participantId, false);
                        };

                        return (
                          <View key={index} style={styles.participantInfo}>
                            <View style={styles.participantStyle}>
                              <Image
                                source={{
                                  uri: "https://picsum.photos/200/310",
                                }}
                                style={styles.participantImage}
                              />
                              <Text
                                style={styles.participantName}
                                ellipsizeMode={"tail"}
                                numberOfLines={1}
                              >
                                {participantNames[index]}
                              </Text>
                            </View>
                            <View style={styles.actionButtons}>
                              {showVerifyButton ? (
                                <View style={styles.verifyButtonWrapper}>
                                  <TouchableWithoutFeedback onPress={onConfirm}>
                                    <Icon
                                      name="check"
                                      size={22}
                                      color="green"
                                    />
                                  </TouchableWithoutFeedback>
                                  <TouchableWithoutFeedback onPress={onCancel}>
                                    <Icon name="remove" size={22} color="red" />
                                  </TouchableWithoutFeedback>
                                </View>
                              ) : (
                                <TouchableOpacity
                                  style={
                                    isPaid
                                      ? styles.markDebtButtonPaid
                                      : isVerified
                                      ? styles.markDebtButtonVerified
                                      : styles.markDebtButtonUnpaid
                                  }
                                  onPress={() =>
                                    handlePayPress(participantId, isPaid)
                                  }
                                >
                                  {debtProcessingMap.get(participantId) ? (
                                    <ActivityIndicator
                                      size="small"
                                      color="white"
                                    />
                                  ) : (
                                    <Text style={styles.markDebtButtonText}>
                                      {isPaid
                                        ? "Pago"
                                        : isVerified
                                        ? "Pendente"
                                        : "Não Pago"}
                                    </Text>
                                  )}
                                </TouchableOpacity>
                              )}
                              {groupData.adminId === userAdminId && (
                                <TouchableOpacity
                                  style={styles.removeButton}
                                  onPress={() =>
                                    handleRemoveMember(participantId)
                                  }
                                >
                                  <Icon name="trash" size={20} color="white" />
                                </TouchableOpacity>
                              )}
                            </View>
                          </View>
                        );
                      }
                    )}
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
                      <Icon
                        name="envelope"
                        size={20}
                        color="#1CC29F"
                        style={styles.icon}
                      />
                      <TextInput
                        value={userEmail}
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor={styles.placeholderText.color}
                        autoCapitalize="none"
                        onChangeText={(text) => setUserEmail(text)}
                      />
                    </View>
                    <TouchableOpacity
                      onPress={handleAddUserToGroup}
                      style={styles.modalButton}
                    >
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
                  <Text style={styles.buttonAddText}>
                    Adicionar Participante
                  </Text>
                </TouchableOpacity>
                <Pressable onPress={handleDeleteGroup} style={styles.button}>
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
              </>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default GroupScreen;
