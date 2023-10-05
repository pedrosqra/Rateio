import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#373B3F',
    },
    welcome: {
        color: 'white',
        marginBottom: 50,
        fontSize: 25,
        fontWeight: "bold",
    },
    title: {
        fontSize: 30,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    greenSeparator: {
        width: '80%',
        height: 2,
        margin: 10,
        backgroundColor: '#1CC29F',
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
    buttonsContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        height: 60,
    },
    icon: {
        marginRight: 10,
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
    button: {
        width: '90%',
        height: 55,
        backgroundColor: '#1CC29F',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    buttonTwo: {
        width: '90%',
        height: 55,
        marginTop: 15,
        backgroundColor: '#1CC29F',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: 10,
    },
});

export default styles;
