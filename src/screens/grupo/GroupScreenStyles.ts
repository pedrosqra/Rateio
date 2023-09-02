import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3498db', // Define a cor de fundo azul
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  valorMonetario: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20, // Espaçamento entre o card e os botões
  },
  button: {
    padding: 10,
  },
  nomeText: {
    fontSize: 18,               // Tamanho da fonte
    fontWeight: 'bold',        // Texto em negrito
    marginVertical: 5,         // Espaçamento vertical entre os nomes
    color: '#333',             // Cor do texto
  },
  divisao: {
    // Estilos para a divisão
    fontSize: 18, // Tamanho da fonte
    fontWeight: 'bold', // Peso da fonte
    marginTop: 10, // Espaçamento superior
    color: 'blue', // Cor do texto (pode ser ajustada conforme necessário)
  },
});
