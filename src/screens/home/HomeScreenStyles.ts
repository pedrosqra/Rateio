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
        
    },
    profileContent: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '46%',
        marginLeft: 15,
        color: '#1CC29F',
    },
    profileName: {
        fontSize: 25,
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
    },
    notificationContent: {
        marginRight: 20,
    },
    groupSearch: {
        backgroundColor: '#373B3F',
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

});

export default styles;
