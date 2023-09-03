import React from 'react';
import {Button, Text, View} from 'react-native';
import styles from './HomeScreenStyles';
import {RouteProp} from "@react-navigation/native";
import {firebaseAuth} from "../../../backend/firebase/firebase";
import {User} from "../../interfaces/user";
import {StackNavigationProp} from "@react-navigation/stack";

type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type RootStackParamList = {
    Home: { user: User };
};

interface RouterProps {
    route: HomeScreenRouteProp;
    navigation: HomeScreenNavigationProp;
}

const HomeScreen = ({route, navigation}: RouterProps) => {
    const user = route.params.user;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Rateio</Text>
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Bem vindo ao app Rateio {user.email}!</Text>
                <Text style={styles.cardText}>Divida seus gastos de forma inteligente.</Text>
                <Button title={"Sair"} onPress={() => firebaseAuth.signOut()}>Sair</Button>
            </View>
        </View>
    );
};

export default HomeScreen;
