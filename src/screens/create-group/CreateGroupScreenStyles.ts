import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#373B3F', // Cor de fundo azul escuro
    paddingHorizontal: 25,
    paddingTop: 10,
  },
  arrow: {
    position: 'absolute',
    left: 10,
    top: 50
  },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF', // Cor do texto branco,
    marginTop: 100,
    marginBottom: 20,
  },
  headerSpacer: {
    width: 60,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF', // Cor do texto branco
    marginTop: 10,
  },
  input: {
    backgroundColor: '#FFF', // Cor de fundo branca
    borderRadius: 5,
    height: 40,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#333', // Cor do texto escuro
  },
  participantsButton: {
    backgroundColor: '#FFF', // Cor de fundo branca
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333', // Cor do texto escuro
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#rgba(0, 0, 0, 0.6)', // Fundo escuro semi-transparente
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#333', // Cor de fundo escura
    padding: 20,
    borderRadius: 5,
    width: '100%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#FFF', // Cor do texto claro
  },
  modalItem: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
    color: '#FFF', // Cor do texto claro
  },
  closeButton: {
    backgroundColor: '#FFF',
    paddingVertical: 10,
    borderRadius: 5,
    width: '68%',
    alignItems: 'center',
    marginBottom: 30,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1CC29F', // Cor do texto verde
  },
  createButton: {
    backgroundColor: '#1CC29F', // Cor de fundo verde
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 340,
  },
});