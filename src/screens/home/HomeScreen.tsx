import React from 'react';
import {Button, Text, View} from 'react-native';
import styles from './HomeScreenStyles';
import {firebaseAuth} from "../../../backend/firebase/firebase";
import { useUserStore } from '../../store/user';

const HomeScreen = () => {
    const { email } = useUserStore()

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Rateio</Text>
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Bem vindo ao app Rateio {email}!</Text>
                <Text style={styles.cardText}>Divida seus gastos de forma inteligente.</Text>
                <Button title={"Sair"} onPress={() => firebaseAuth.signOut()} />
            </View>
        </View>
    );
};

export default HomeScreen;
