import {StyleSheet} from 'react-native';

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
        fontSize: 30,
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
        borderRadius: 8,
        height: 54,
        paddingHorizontal: 10,
        marginBottom: 15,
        marginTop: 10,
        color: '#333', // Cor do texto escuro
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333', // Cor do texto escuro
    },
    createButton: {
        backgroundColor: '#1CC29F', // Cor de fundo verde
        paddingVertical: 2,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        height: 54,
        marginTop: 30,
    },
});