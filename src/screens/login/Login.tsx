import React, { useEffect, useState } from 'react'
import {ActivityIndicator, Button, Text, TextInput, View} from 'react-native';
import {login, signup} from '../../../backend/user-config/user-service'
import styles from "../login/LoginStyles";
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from '../../../backend/firebase/firebase';
import { useUserStore } from '../../store/user';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
    const { setPersonalData } = useUserStore()

    const navigation = useNavigation()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const signIn = async () => {
        setLoading(true)
        try {
            const response = await login(email, password);
            if (!response) {
                alert("Ocorreu um erro ao fazer login. Verifique email e senha.")
            }
        } finally {
            setLoading(false)
        }
    }

    const signUp = async () => {
        setLoading(true)
        try {
            const response = await signup(email, password, null)
            if (response) {
                alert("Conta criada com sucesso. Verifique  seu email.")

            } else {
                alert("Ocorreu um erro ao criar a conta. Verifique email e senha.")
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        onAuthStateChanged(firebaseAuth, (user) => {
            if (user) {
                setPersonalData(user)
                navigation.navigate('Home')
            }
        })
    }, [])

    return (
        <View style={styles.container}>
            <Text>Login</Text>
            <TextInput value={email} style={styles.input} placeholder="Email" autoCapitalize="none"
                       onChangeText={(text) => setEmail(text)}></TextInput>
            <TextInput value={password} secureTextEntry={true} style={styles.input} placeholder="password"
                       autoCapitalize="none"
                       onChangeText={(password) => setPassword(password)}></TextInput>
            {loading ? (
                <ActivityIndicator size={"large"} color="#0000ff"/>
            ) : (
                <>
                    <Button title={"Login"} onPress={signIn}/>
                    <Button title={"Criar conta"} onPress={signUp}/>
                </>
            )}
        </View>
    );
}

export default Login;
