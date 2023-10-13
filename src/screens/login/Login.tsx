import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {login} from '../../../backend/user-config/user-service';
import styles from '../login/LoginStyles';
import {onAuthStateChanged} from 'firebase/auth';
import {firebaseAuth} from '../../../backend/firebase/firebase';
import {useUserStore} from '../../store/user';
import {CommonActions, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Login = () => {
    const {setPersonalData} = useUserStore();
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const signIn = async () => {
        setLoading(true);
        try {
            const response = await login(email, password);
            if (!response) {
                alert('Ocorreu um erro ao fazer login. Verifique email e senha.');
            } else {
                setPersonalData(response.user);
                navigation.dispatch(
                    CommonActions.reset({
                        index: 1,
                        routes: [
                            {name: 'Home', params: {uid: response.user.uid}},
                        ],
                    })
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSignUpPress = () => {
        navigation.navigate('SignUp'); // Navigate to SignUp screen
    };

    useEffect(() => {
        onAuthStateChanged(firebaseAuth, (user) => {
            if (user) {
                setPersonalData(user);
                navigation.dispatch(
                    CommonActions.reset({
                        index: 1,
                        routes: [
                            {name: 'Home', params: {uid: user.uid}},
                        ],
                    })
                );
            }
        });
    }, []);

    return (
        <View style={styles.container}>
            <Image source={require('../../../assets/logo.png')} style={styles.logo}/>
            <Text style={styles.welcome}>O melhor app para dividir gastos com seus amigos.</Text>
            <View style={styles.inputContainer}>
                <Icon name="user" size={20} color="#1CC29F" style={styles.icon}/>
                <TextInput
                    value={email}
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor={styles.placeholderText.color}
                    autoCapitalize="none"
                    onChangeText={(text) => setEmail(text)}
                />
            </View>

            <View style={styles.inputContainer}>
                <Icon name="lock" size={20} color="#1CC29F" style={styles.icon}/>
                <TextInput
                    value={password}
                    secureTextEntry={true}
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={styles.placeholderText.color}
                    autoCapitalize="none"
                    onChangeText={(password) => setPassword(password)}
                />
            </View>

            {loading ? (
                <ActivityIndicator size={'large'} color="#1CC29F"/>
            ) : (
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity onPress={signIn} style={styles.button}>
                        <Text style={styles.buttonText}>Entrar</Text>
                    </TouchableOpacity>
                    <View style={styles.greenSeparator}/>
                    <TouchableOpacity onPress={handleSignUpPress} style={styles.buttonTwo}>
                        <Text style={styles.buttonText}>Criar Conta</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default Login;
