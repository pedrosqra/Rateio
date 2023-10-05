import React, {useEffect, useState} from 'react';
import {Button, Text, View} from 'react-native';
import {styles} from './GroupScreenStyles';
import {getGroupById, updateGroup} from '../../../backend/group-config/group-service' // Substitua com o caminho correto
import {DocumentData} from 'firebase/firestore';
import {RouteProp, useRoute} from '@react-navigation/native';

type RootStackParamList = {
    Home: undefined;
    GroupScreen: { groupId: string };
};

const GroupScreen = () => {
    type GroupScreenRouteProp = RouteProp<RootStackParamList, 'GroupScreen'>;
    const route = useRoute<GroupScreenRouteProp>();
    const groupId = route.params?.groupId;

    const [valorMonetario, setValorMonetario] = useState(0);
    const [simboloAtivo, setSimboloAtivo] = useState(false);
    const [groupData, setGroupData] = useState<DocumentData | null>({debtFinalDate: null});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getGroupById(groupId);
                setGroupData(data || {debtFinalDate: null});
            } catch (error) {
                console.error('Error reading the group:', error);
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

    const nomes = ['Nome 1', 'Nome 2', 'Nome 3'];

    // Calcular a divisão
    const division = groupData ? groupData.debtAmount / nomes.length : 0;
    const description = groupData ? groupData.debtDescription : '';
    const adminPix = groupData ? groupData.adminPix : 'Pix não está disponível';


    return (
        <View style={styles.container}>
            {groupData ? (
                <View style={styles.card}>
                    <Text style={styles.nomeText}>{groupData.name}</Text>
                    <Text style={styles.valorMonetario}>R$ {groupData.debtAmount}</Text>
                    {/* Outros dados do grupo que você deseja renderizar */}
                </View>
            ) : (
                <Text>Carregando dados do grupo...</Text>
            )}

            <View style={styles.card}>
                <Text style={styles.valorMonetario}>{description}</Text>
                <Text style={styles.valorMonetario}>Divisão: R$ {division.toFixed(2)}</Text>
                <Text style={styles.valorMonetario}>Pix: {adminPix}</Text>
            </View>
            <View style={styles.buttonContainer}>
                <Button title="Diminuir" onPress={diminuirValor}/>
                <Button title="Aumentar" onPress={aumentarValor}/>
            </View>
            <View>
                {nomes.map((nome, index) => (
                    <Text key={index} style={styles.nomeText}>
                        {nome}{simboloAtivo ? '✔️ ' : '❌ '}
                    </Text>
                ))}
            </View>
            <Button
                title={simboloAtivo ? 'Desativar Símbolo' : 'Ativar Símbolo'}
                onPress={toggleSimbolo}
            />
        </View>
    );
}

export default GroupScreen;
