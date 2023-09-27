import React, { useState, useEffect  } from 'react';
import { View, Text, Button } from 'react-native';
import { styles } from './GroupScreenStyles';
import { updateGroup,readGroup } from '../../../backend/group-config/group-service' // Substitua com o caminho correto
import { DocumentData } from 'firebase/firestore';
import { format } from 'date-fns';


export default function GroupScreen() {
  const [valorMonetario, setValorMonetario] = useState(0);
  const [simboloAtivo, setSimboloAtivo] = useState(false);
  const [groupData, setGroupData] = useState<DocumentData | null>({ debtFinalDate: null });


  useEffect(() => {
    // Call the read function when the component mounts
    const groupId = 'NzShXWT03JEjlksZS9Yo'; // Replace with the desired group ID

    const fetchData = async () => {
      try {
        const data = await readGroup(groupId);
        setGroupData(data); // Define um valor padrão se os dados do grupo não forem encontrados
      } catch (error) {
        console.error('Error reading the group:', error);
      }
    };
    

    fetchData(); // Fetch the initial data
  }, []);


  const aumentarValor = async () => {
    try {
      if (groupData) {
        // Increase the debtAmount by 10
        const updatedDebtAmount = groupData.debtAmount + 10;

        // Update the debtAmount in Firestore
        await updateGroup('NzShXWT03JEjlksZS9Yo', { debtAmount: updatedDebtAmount }); // Replace with the actual group ID

        // Update the state to reflect the change
        setValorMonetario(updatedDebtAmount);

        // Fetch the latest group data again to ensure it's up-to-date
        const updatedData = await readGroup('NzShXWT03JEjlksZS9Yo'); // Fetch the latest data
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

        // Update the debtAmount in Firestore
        await updateGroup('NzShXWT03JEjlksZS9Yo', { debtAmount: updatedDebtAmount }); // Replace with the actual group ID

        // Update the state to reflect the change
        setValorMonetario(updatedDebtAmount);

        // Fetch the latest group data again to ensure it's up-to-date
        const updatedData = await readGroup('NzShXWT03JEjlksZS9Yo'); // Fetch the latest data
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
        <Button title="Diminuir" onPress={diminuirValor} />
        <Button title="Aumentar" onPress={aumentarValor} />
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
