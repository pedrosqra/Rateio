import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/home/HomeScreen'; // Importe a tela HomeScreen
import GrupoScreen from '../screens/grupo/GroupScreen'; // Importe a tela GrupoScreen

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="GroupScreen" component={GrupoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
