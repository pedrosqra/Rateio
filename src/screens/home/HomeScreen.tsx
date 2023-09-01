import React from 'react';
import {Text, View} from 'react-native';
import {createUser, generateUserId, readUser} from '../../../backend/user-config/user-service';
import styles from './HomeScreenStyles';

const HomeScreen = () => {
    async function write(): Promise<void> {
        const docData = {
            debts: {},
            email: 'bomdia@local.com',
            groups: [],
            name: 'mal dia',
            pix: '434324234',
            userId: generateUserId(),
        };
        try {
            await createUser(docData);
            console.log('promise completed');
        } catch (error) {
            console.log('error while executing promise');
        }
    }

    async function read(): Promise<void> {
        let id = 'ydfqLBcbvEzvllEu3JCU';
        try {
            const res = await readUser(id);
            console.log(res);
        } catch (error) {
            console.error('Error getting document: ', error);
        }
    }

    // useEffect(() => {
    //     write().then(() => console.log('write chamado'));
    //     read().then(() => console.log('read chamado'));
    // }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Rateio</Text>
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Bem vindo ao app Rateio!</Text>
                <Text style={styles.cardText}>Divida seus gastos de forma inteligente.</Text>
            </View>
        </View>
    );
};

export default HomeScreen;
