import React from 'react';
import { View, Text } from 'react-native';
import { createUser, readUser, generateUserId } from '../../../backend/user-config/user-service'
import {useEffect} from "react";

const HomeScreen = () => {

    async function write(): Promise<void> {
        const docData = {
            debts: {},
            email: "bomdia@local.com",
            groups: [],
            name: "mal dia",
            pix: "434324234",
            userId: generateUserId()
        };
        try {
            await createUser(docData);
            console.log("promise completed");
        } catch (error) {
            console.log("error while executing promise");
        }
    }

    async function read(): Promise<void> {
        let id = "ydfqLBcbvEzvllEu3JCU";
        try {
            const res = await readUser(id);
            console.log(res);
        } catch (error) {
            console.error("Error getting document: ", error);
        }
    }

    useEffect(() => {
        write().then(r => console.log("write chamado"));
        read().then(r => console.log("read chamado"));
    }, []);

    return (
        <View className="flex flex-col h-full justify-center items-center bg-blue-500">
            <Text className="text-4xl text-white font-bold mb-4">Rateio</Text>
            <View className="bg-white p-4 rounded-lg shadow-md">
                <Text className="text-gray-800 text-lg">Welcome to the Rateio app!</Text>
                <Text className="text-gray-600 mt-2">Explore and enjoy our features.</Text>
            </View>
        </View>
    );
};

export default HomeScreen;
