import {StyleSheet} from 'react-native';
import Constants from 'expo-constants'


const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#373B3F',
        height: '100%',
        paddingTop: Constants.statusBarHeight * 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: 10,
    },
    profileContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 19,
        color: '#1CC29F',
        flex: 1,
    },
    profileName: {
        flex: 1,
        fontSize: 20,
        color: '#1CC29F',
        fontWeight: 'bold',
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2, // Border width in pixels
        borderColor: '#1CC29F', // Border color
        marginRight: 8,
    },
    notificationContent: {
        marginRight: 20,
        marginTop: 10,
    },
    searchBarContainer: {
        backgroundColor: '#D2D2D2',
        padding: 10,
        borderRadius: 25,
        margin: 10,
        width: '91%',
        marginTop: 28,
        flexDirection: 'row',
        alignItems: 'flex-start',
        color: 'white',

    },
    loadingContainerStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchInput: {
        fontSize: 16,
        marginLeft: 15,
        width: '100%',
        color: 'black',
    },
    inputContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '70%',
        height: 60,
        backgroundColor: '#373B3F',
        padding: 10,
        borderRadius: 8,
        borderColor: '#373B3F',
        borderWidth: 1,
        marginBottom: 60,
        color: 'white',
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#373B3F',
        padding: 10,
        borderRadius: 8,
        borderColor: 'transparent',
        borderWidth: 1,
        color: 'white',
        fontSize: 20,
        paddingHorizontal: 24,
        textAlign: 'center',
    },
    groupListHeaderView: {
        backgroundColor: '#373B3F',
        flexDirection: 'row',
        justifyContent: 'space-between',

        marginLeft: 19,
        color: '#1CC29F',
        width: '100%',
    },
    refreshButtonContainer: {
        width: '20%',
    },
    groupListTitleView: {
        backgroundColor: '#373B3F',
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row', // Para ocupar toda a largura
        alignItems: 'flex-start', // Alinhar ao início da tela (à esquerda)
        justifyContent: 'flex-start',
        marginRight: '70%',
    },
    groupsListTitle: {
        fontSize: 23,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 10,
        minWidth: 80,
        marginLeft: 11,
    },
    groupImageContainer: {
        marginRight: 10,
    },
    groupDescription: {
        color: 'white',
    },
    groupName: {
        fontSize: 18,
        color: '#1CC29F',
        fontWeight: 'bold',
    },
    groupInfo: {
        flex: 1, // Para o nome do grupo ocupar o espaço restante
        flexDirection: 'column', // Layout de coluna para nome e descrição
    },
    list: {
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    listItem: {
        backgroundColor: '#373B3F', // Set background color to match the container background
        borderRadius: 10, // Add rounded corners
        padding: 24, // Add padding to create space within the border
        marginBottom: 14, // Add margin between list items
        borderWidth: 1, // Add a white border
        borderColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
    },

    title: {
        fontSize: 30,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    card: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 18,
        color: '#333',
        fontWeight: 'bold',
        marginBottom: 8,
    },
    cardText: {
        fontSize: 16,
        color: '#666',
    },
    addGroupButtonView: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '95%',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    addGroupButton: {
        flexDirection: 'row',
        backgroundColor: '#1CC29F',
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addIcon: {
        marginRight: 10, // Espaço entre o ícone e o texto
    },
    addText: {
        fontSize: 18,
        color: '#373B3F',
        fontWeight: 'bold',
    },
    buttonText: {
        fontSize: 16,
        color: "#d73018",
        fontWeight: 'bold'
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#1CC29F', // Fundo escuro semi-transparente
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
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#FFF', // Cor do texto claro
    },
    modalItem: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 5,
        color: '#FFF', // Cor do texto claro
    },
    modalButton: {
        backgroundColor: '#FFF',
        padding: 10,
        borderRadius: 8,
        width: '90%',
        height: 45,
        alignItems: 'center',
        marginBottom: 10,
    },
    refreshButton: {
        backgroundColor: '#373B3F',
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

});

export default styles;
