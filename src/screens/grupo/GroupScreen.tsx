import React, {useEffect, useState} from 'react';
import {Text, View, ActivityIndicator, Image, Pressable} from 'react-native';

import { AntDesign } from '@expo/vector-icons';

import {DocumentData} from 'firebase/firestore';

import {getGroupById, updateGroup} from '../../../backend/group-config/group-service' // Substitua com o caminho correto

import {styles} from './GroupScreenStyles';
import { Props } from './types';

const GroupScreen = ({
    navigation,
    route
}: Props) => {
    const groupId = route.params.groupId;

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    const [valorMonetario, setValorMonetario] = useState(0);
    const [simboloAtivo, setSimboloAtivo] = useState(false);
    const [groupData, setGroupData] = useState<DocumentData | null>({debtFinalDate: null});

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)

            try {
                const data = await getGroupById(groupId);
                setGroupData(data || {debtFinalDate: null});
            } catch (error) {
                console.error('Error reading the group:', error);
            } finally {
                setIsLoading(false)
            }
        };

        fetchData();
    }, [groupId]);


    const aumentarValor = async () => {
        try {
            if (groupData) {
                // Increase the debtAmount by 10
                const updatedDebtAmount = groupData.debtAmount + 10;

                // Update the debtAmount in Firestore
                await updateGroup(groupId, {debtAmount: updatedDebtAmount}); // Replace with the actual group ID

                // Update the state to reflect the change
                setValorMonetario(updatedDebtAmount);

                // Fetch the latest group data again to ensure it's up-to-date
                const updatedData = await getGroupById(groupId); // Fetch the latest data
                setGroupData(updatedData);
            }
        } catch (error) {
            console.error('Error increasing debtAmount:', error);
        }
    };


    const diminuirValor = async () => {
        try {
            if (groupData) {
                // Increase the debtAmount by 10
                const updatedDebtAmount = groupData.debtAmount - 10;
                console.log(updatedDebtAmount);
                // Update the debtAmount in Firestore
                await updateGroup(groupId, {debtAmount: updatedDebtAmount}); // Replace with the actual group ID

                // Update the state to reflect the change
                setValorMonetario(updatedDebtAmount);

                // Fetch the latest group data again to ensure it's up-to-date
                const updatedData = await getGroupById(groupId); // Fetch the latest data
                setGroupData(updatedData);
            }
        } catch (error) {
            console.error('Error increasing debtAmount:', error);
        }
    };

    const toggleSimbolo = () => {
        setSimboloAtivo(!simboloAtivo);
    };

    // const nomes = ['Nome 1', 'Nome 2', 'Nome 3'];

    // // Calcular a divisão
    // const division = groupData ? groupData.debtAmount / nomes.length : 0;
    // const description = groupData ? groupData.debtDescription : '';
    // const adminPix = groupData ? groupData.adminPix : 'Pix não está disponível';

    return (
        <View style={styles.container}>
            <AntDesign
                onPress={() => navigation.goBack()}
                name="arrowleft"
                size={30}
                color="white"
                style={styles.arrow}
            />
            { isLoading ? (
                <ActivityIndicator size={'large'} color={"#fff"}/>
            ) : (
                <>
                    <Image
                        source={{
                            uri: 'https://s2-valor.glbimg.com/LZyCSHR22BjRuB06S60vWzmKJqQ=/0x0:5408x3355/888x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_63b422c2caee4269b8b34177e8876b93/internal_photos/bs/2020/T/A/fuvfecS5Od2cxQlrQ5Pw/kym-mackinnon-aerego3rque-unsplash.jpg',
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
                                <AntDesign
                                    name="right"
                                    size={12}
                                />
                            </View>
                        </Pressable>
                        <Pressable
                            onPress={() => console.log('HISTORIC PRESS')}
                            style={styles.inline}
                        >
                            <Text style={styles.textBold}>Histórico</Text>
                            <AntDesign
                                name="right"
                                size={12}
                            />
                        </Pressable>
                    </View>
                    <View style={styles.groupInfo}>
                        <Pressable
                            onPress={() => console.log('PARTICIPANTS PRESS')}
                            style={styles.inline}
                        >
                            <Text style={styles.textBold}>Participantes</Text>
                            <AntDesign
                                name="right"
                                size={12}
                            />
                        </Pressable>
                        {groupData?.members && groupData.members.map((participantId: string, index: number) => (
                            <View key={index} style={styles.participantInfo}>
                                <Image
                                    source={{
                                        uri:'https://s2-valor.glbimg.com/LZyCSHR22BjRuB06S60vWzmKJqQ=/0x0:5408x3355/888x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_63b422c2caee4269b8b34177e8876b93/internal_photos/bs/2020/T/A/fuvfecS5Od2cxQlrQ5Pw/kym-mackinnon-aerego3rque-unsplash.jpg',
                                    }}
                                    style={styles.participantImage}
                                />
                                <Text style={styles.participantName}>{participantId}</Text>
                            </View>
                        ))}
                    </View>
                    <Pressable
                        onPress={() => console.log('FINALIZAR GRUPO')}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Finalizar Grupo</Text>
                    </Pressable>
                </>
            )}
        </View>
    );
}

export default GroupScreen;
