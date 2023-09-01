import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3498db',
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
