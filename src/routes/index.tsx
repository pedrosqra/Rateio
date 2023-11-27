import React from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import HomeScreen from '../screens/home/HomeScreen'
import Login from '../screens/login/Login'

import {defaultScreenOptions} from './types'
import SignUp from '../screens/create-account/SignUp'
import GroupScreen from '../screens/grupo/GroupScreen'
import CreateGroupScreen from '../screens/create-group/CreateGroupScreen'
import History from '../screens/history/History'
import ChangeNameScreen from '../screens/change-name/ChangeNameScreen'
import Profile from '../screens/profile/ProfileScreen'
import ChangeEmail from '../screens/change-email/ChangeEmail'
import ChangePassword from '../screens/change-password/ChangePassword'
import JoinGroup from "../screens/join-group/JoinGroup";

const Stack = createStackNavigator()

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={'Login'}
                screenOptions={defaultScreenOptions}
            >
                <Stack.Screen name="Login" component={Login}/>
                <Stack.Screen name="Home" component={HomeScreen}/>
                <Stack.Screen name="CreateGroup" component={CreateGroupScreen}/>
                <Stack.Screen name="GroupScreen" component={GroupScreen}/>
                <Stack.Screen name="SignUp" component={SignUp}/>
                <Stack.Screen name="History" component={History}/>
                <Stack.Screen name="Profile" component={Profile}/>
                <Stack.Screen name="ChangeNameScreen" component={ChangeNameScreen}/>
                <Stack.Screen name="ChangeEmail" component={ChangeEmail}/>
                <Stack.Screen name="ChangePassword" component={ChangePassword}/>
                <Stack.Screen name="JoinGroup" component={JoinGroup}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}
