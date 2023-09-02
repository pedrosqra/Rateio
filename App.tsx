import {StatusBar} from 'expo-status-bar';
import {StyleSheet, View} from 'react-native';
import React from "react";
import Navigation from "./src/navigation/Navigation";


export default function App() {
    return (
        <View style={styles.container}>
            <Navigation/>
            <StatusBar style="auto"/>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
