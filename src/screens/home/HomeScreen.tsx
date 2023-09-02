import React from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import styles from './HomeScreenStyles'

type RootStackParamList = {
  Home: undefined;
  GroupScreen: undefined;
};

type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const navigateToGroup = () => {
        navigation.navigate('GroupScreen'); // Navegar para a tela Grupo
      };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rateio</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Bem vindo ao app Rateio!</Text>
        <Text style={styles.cardText}>Divida seus gastos de forma inteligente.</Text>
        <Button title="Ir para grupo" onPress={navigateToGroup} />
      </View>
    </View>
  );
};


export default HomeScreen;
