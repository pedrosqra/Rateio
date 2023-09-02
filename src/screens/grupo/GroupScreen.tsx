import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { styles } from './GroupScreenStyles';

export default function GroupScreen() {
  const [valorMonetario, setValorMonetario] = useState(100.0);
  const [simboloAtivo, setSimboloAtivo] = useState(false);

  const aumentarValor = () => {
    setValorMonetario(valorMonetario + 10.0);
  };

  const diminuirValor = () => {
    if (valorMonetario > 0) {
      setValorMonetario(valorMonetario - 10.0);
    }
  };

  const toggleSimbolo = () => {
    setSimboloAtivo(!simboloAtivo);
  };

  const nomes = ['Nome 1', 'Nome 2', 'Nome 3'];

  // Calcular a divisão
  const divisao = valorMonetario / nomes.length;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.valorMonetario}>R$ {valorMonetario.toFixed(2)}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.divisao}>Divisão: R$ {divisao.toFixed(2)}</Text>
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
