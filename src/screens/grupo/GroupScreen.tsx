import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Image, Pressable, Text, View} from 'react-native';
import {AntDesign} from '@expo/vector-icons';
import {DocumentData} from 'firebase/firestore';

import {deleteGroup, getGroupById, updateGroup} from '../../../backend/group-config/group-service';
import {styles} from './GroupScreenStyles';
import {Props} from './types';
import {readUser} from '../../../backend/user-config/user-service';

const GroupScreen = ({navigation, route}: Props) => {
    const groupId = route.params.groupId;

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    const [valorMonetario, setValorMonetario] = useState(0);
    const [simboloAtivo, setSimboloAtivo] = useState(false);
    const [groupData, setGroupData] = useState<DocumentData | null>({debtFinalDate: null});
    const [participantNames, setParticipantNames] = useState<string[]>([]);

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

    const handleDeleteGroup = () => {
        deleteGroup(groupId).then(r => console.log("Group deleted"));
    }

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
                            onPress={() => console.log('HISTORIC PRESS')}
                            style={styles.inline}
                        >
                            <Text style={styles.textBold}>Histórico</Text>
                            <AntDesign name="right" size={12}/>
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
                    <Pressable
                        onPress={handleDeleteGroup}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Finalizar Grupo</Text>
                    </Pressable>
                </>
            )}
        </View>
    );
};

export default GroupScreen;
