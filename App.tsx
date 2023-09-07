import {StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './src/screens/home/HomeScreen';
import React, {useEffect, useState} from "react";
import Login from "./src/screens/login/Login";
import {onAuthStateChanged, User} from 'firebase/auth'
import {firebaseAuth} from './backend/firebase/firebase'

const Stack = createStackNavigator();

export default function App() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        onAuthStateChanged(firebaseAuth, (user) => {
            console.log('user', user);
            setUser(user)
        })
    })

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={"Login"}>
                {user ?
                    (<Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}} user={user}
                                   initialParams={{user}}/>)
                    : (
                        <Stack.Screen name="Login" component={Login}/>

                    )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
