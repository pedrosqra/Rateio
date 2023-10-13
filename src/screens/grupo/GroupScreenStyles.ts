import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#373B3F', // Define a cor de fundo azul
        paddingHorizontal: 25
    },
    participantsButton: {
        backgroundColor: '#FFF', // Cor de fundo branca
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 30,
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
    icon: {
        marginRight: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
        height: 60,
        backgroundColor: '#373B3F',
        padding: 10,
        borderRadius: 8,
        borderColor: '#1CC29F',
        borderWidth: 1,
        marginBottom: 10,
        color: 'white',
    },
    input: {
        width: '90%',
        height: 45,
        backgroundColor: '#373B3F',
        padding: 10,
        borderRadius: 8,
        borderColor: 'transparent',
        borderWidth: 1,
        color: 'white',
    },
    placeholderText: {
        color: 'white',
    },
    modalButton: {
        backgroundColor: '#FFF',
        padding: 10,
        borderRadius: 8,
        width: '90%',
        height: 45,
        alignItems: 'center',
        marginBottom: 30,
    },
    confirmButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1CC29F', // Cor do texto verde
    },
    arrow: {
        position: 'absolute',
        left: 30,
        top: 50
    },
    image: {
        backgroundColor: '#fff',
        width: 96,
        height: 96,
        marginBottom: 8,
        borderWidth: 2, // Border width in pixels
        borderColor: '#1CC29F', // Border color
    },
    groupInfo: {
        backgroundColor: "#fff",
        borderRadius: 10,
        width: "100%",
        marginTop: 25,
        paddingVertical: 18,
        paddingHorizontal: 15,
        gap: 15
    },
    inline: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    innerGroup: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    textBold: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "#333",
    },
    text: {
        fontSize: 16,
        color: "#333",
        marginRight: 5
    },
    participantInfo: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    participantImage: {
        width: 47,
        height: 47,
        backgroundColor: "#fff",
        borderRadius: 30
    },
    participantName: {
        fontSize: 14,
        color: "#333",
        marginLeft: 15
    },
    button: {
        width: "100%",
        height: 45,
        backgroundColor: "#fff",
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25,
        borderRadius: 10
    },
    buttonText: {
        fontSize: 16,
        color: "#d73018",
        fontWeight: 'bold'
    },
    buttonAddText: {
        fontSize: 16,
        color: '#1CC29F', // Cor do texto verde
        fontWeight: 'bold'
    }
});
