import {ActivityIndicator, Button, Text, TextInput, View} from 'react-native';
import {useState} from "react";
import {login, signup} from '../../../backend/user-config/user-service'
import styles from "../login/LoginStyles";

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const signIn = async () => {
        setLoading(true)
        try {
            const response = await login(email, password);
            console.log('Check your email\n\n' + response)
        } catch (error: any) {
            console.log(error)
            alert("Ocorreu um erro ao fazer login. Crie sua conta primeiro.")
        } finally {
            setLoading(false)
        }
    }

    const signUp = async () => {
        setLoading(true)
        try {
            const response = await signup(email, password, null)
            console.log('Check your email\n\n' + response)
        } catch (error: any) {
            console.log(error)
            alert("Conta não foi criada.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={styles.container}>
            <Text>Login</Text>
            {}
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
