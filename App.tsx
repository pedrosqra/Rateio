import {StatusBar} from 'expo-status-bar';
import {StyleSheet, View} from 'react-native';
import HomeScreen from './src/screens/home/HomeScreen';
import React from "react";


export default function App() {
    return (
        <View style={styles.container}>
            <HomeScreen/>
            <StatusBar style="auto"/>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
