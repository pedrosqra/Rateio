import React from 'react';
import {Text, View} from 'react-native';
import styles from './HomeScreenStyles';

const HomeScreen = () => {

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
