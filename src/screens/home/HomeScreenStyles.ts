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
        borderStyle: 'solid',
        marginRight: 8,
    },
    notificationContent: {
        marginRight: 20,
        marginTop: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },

    searchInput: {
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
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
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    addGroupButton: {
        flexDirection: 'row',
        backgroundColor: '#1CC29F',
        padding: 12,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 10,
        width: '100%',
    },
    addIcon: {
        marginRight: 10, // Espaço entre o ícone e o texto
    },
    addText: {
        fontSize: 18,
        color: '#373B3F',
        fontWeight: 'bold',
    },

});

export default styles;