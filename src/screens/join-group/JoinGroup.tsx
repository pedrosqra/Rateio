import React, {useState} from 'react';
import {ActivityIndicator, Text, TextInput, TouchableOpacity, View} from 'react-native';
import styles from './JoinGroupStyles';
import {addUserToGroup, getGroupId} from "../../../backend/group-config/group-service";
import {useNavigation} from "@react-navigation/native";
import {AntDesign} from "@expo/vector-icons";

const JoinGroup = ({route}) => {
    const userEmail = route.params.userEmail;
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false) // Add a loading state
    const [invite, setInvite] = useState('');

    const onPressJoinAGroupWithCode = async () => {
        setIsLoading(true)
        console.log(userEmail)
        const code = invite.replace(/[^0-9]/g, '')
        const groupId = await getGroupId(code)
        console.log('Entrando no grupo de codigo: ', code, groupId)
        await addUserToGroup(groupId, userEmail).then(() => {
                route.params.refreshData();
                navigation.goBack();
                setIsLoading(false);
            }
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <AntDesign
                    onPress={() => navigation.goBack()}
                    name="arrowleft"
                    size={30}
                    color="white"
                    style={styles.arrow}
                />
                <Text style={styles.headerText}>Código do Grupo</Text>
                <View style={styles.headerSpacer}/>
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    value={invite}
                    style={styles.input}
                    placeholder="0000"
                    placeholderTextColor={'#ccc'}
                    autoCapitalize="none"
                    keyboardType="decimal-pad"
                    onChangeText={(text) => setInvite(text)}
                />
            </View>
            <TouchableOpacity onPress={onPressJoinAGroupWithCode} style={styles.button}>
                {isLoading ? (
                    <View style={styles.loadingContainerStyle}>
                        <ActivityIndicator size="large" color="#FFFF"/>
                    </View>
                ) : (
                    <Text style={styles.confirmButtonText}>Confirmar</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

export default JoinGroup;
