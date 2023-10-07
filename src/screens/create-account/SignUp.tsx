import React, {useState} from 'react';
import {ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View} from 'react-native';
import styles from './SignUpStyles'; // Create separate styles for SignUp screen
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import {signup} from '../../../backend/user-config/user-service'

const SignUp = () => {
    const navigation = useNavigation();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pix, setPix] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);


    const signUp = async () => {
        setLoading(true)
        try {
            const response = await signup(email, password, name, pix)
            if (response) {
                alert("Conta criada com sucesso. Verifique  seu email.")

            } else {
                alert("Ocorreu um erro ao criar a conta. Verifique email e senha.")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={styles.container}>
            <Image source={require('../../../assets/logo.png')} style={styles.logo}/>
            <Text style={styles.welcome}>Criar conta</Text>
            <View style={styles.inputContainer}>
                <Icon name="user" size={20} color="#1CC29F" style={styles.icon}/>
                <TextInput
                    value={name}
                    style={styles.input}
                    placeholder="Nome"
                    placeholderTextColor={styles.placeholderText.color}
                    onChangeText={(text) => setName(text)}
                />
            </View>
            <View style={styles.inputContainer}>
                <Icon name="envelope" size={20} color="#1CC29F" style={styles.icon}/>
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
                <Icon name="money" size={20} color="#1CC29F" style={styles.icon}/>
                <TextInput
                    value={pix}
                    style={styles.input}
                    placeholder="Pix"
                    placeholderTextColor={styles.placeholderText.color}
                    onChangeText={(text) => setPix(text)}
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
                    onChangeText={(text) => setPassword(text)}
                />
            </View>
            {loading ? (
                <ActivityIndicator size={'large'} color="#1CC29F"/>
            ) : (
                <TouchableOpacity onPress={signUp} style={styles.button}>
                    <Text style={styles.buttonText}>Confirmar</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default SignUp;
