import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/home/HomeScreen'; // Importe a tela HomeScreen
import GroupScreen from '../screens/grupo/GroupScreen'; // Importe a tela GrupoScreen

import { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false
        }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="GroupScreen" component={GroupScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
