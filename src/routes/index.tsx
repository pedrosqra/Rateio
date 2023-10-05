import React from 'react';
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/home/HomeScreen';
import Login from "../screens/login/Login";

import {defaultScreenOptions} from './types';
import SignUp from "../screens/create-account/SignUp";
import GroupScreen from "../screens/grupo/GroupScreen";

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={"Login"} screenOptions={defaultScreenOptions}>
                <Stack.Screen name="Login" component={Login}/>
                <Stack.Screen name="Home" component={HomeScreen}/>
                <Stack.Screen name="GroupScreen" component={GroupScreen}/>
                <Stack.Screen name="SignUp" component={SignUp}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

