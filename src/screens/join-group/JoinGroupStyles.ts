import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#373B3F', // Cor de fundo azul escuro
        paddingHorizontal: 25,
        paddingTop: 10,
    },
    inputContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        backgroundColor: '#373B3F',
        borderRadius: 8,
        borderColor: '#373B3F',
        borderWidth: 1,
        color: 'white',
    },
    input: {
        backgroundColor: '#FFF', // Cor de fundo branca
        borderRadius: 8,
        height: 50,
        padding: 10,
        marginBottom: 15,
        marginTop: 10,
        color: '#333', // Cor do texto escuro,
        width: "100%"
    },
    loadingContainerStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 30,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    confirmButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333', // Cor do texto escuro
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
        marginTop: 200,
        marginBottom: 20,
    },
    headerSpacer: {
        width: 60,
    },
    button: {
        backgroundColor: '#1CC29F', // Cor de fundo verde
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        height: 54,
        marginBottom: 10,
    }
});

export default styles;
