import React, {useState} from 'react'
import {AntDesign} from '@expo/vector-icons'
import {Alert, Image, Pressable, Text, View} from 'react-native'
import {useFocusEffect, useNavigation} from '@react-navigation/native'
import {deleteUser, readUser, signOut,} from '../../../backend/user-config/user-service'
import styles from './ProfileScreenStyles'

const Profile = ({route}) => {
    const [name, setname] = useState('')
    const [userEmail, setUserEmail] = useState('')

    const navigation = useNavigation()
    const {userId} = route.params

    useFocusEffect(
        React.useCallback(() => {
            readUser(userId)
                .then((userData) => {
                    if (userData && userData.name) {
                        const name = userData.name
                        setname(name)
                    }
                    if (userData && userData.email) {
                        setUserEmail(userData.email) // Atualize o estado com o e-mail do usuário
                    }
                })
                .catch((error) => {
                    console.error('Erro ao obter dados do usuário', error)
                })
        }, [userId])
    )

    const onPressExpenseHistory = () => {
        navigation.navigate('History', {userId: userId})
        console.log('Abrir Histórico de Despesas')
    }

    const onPressChangeName = () => {
        navigation.navigate('ChangeNameScreen', {
            userId: userId,
            currentName: name,
        })
        console.log('Abrir Editar Nome')
    }

    const onPressChangeEmail = () => {
        navigation.navigate('ChangeEmail', {
            userId: userId,
            currentEmail: userEmail,
        })
        console.log('Abrir Editar Email')
    }

    const onPressChangePassword = () => {
        navigation.navigate('ChangePassword', {userId: userId})
        console.log('Abrir Editar Senha')
    }

    const formatEmailForDisplay = (email) => {
        if (email.includes('@') && email.length > 26) {
            const atIndex = email.indexOf('@') // Encontre a posição do "@"
            const prefix = email.substring(0, atIndex)
            const suffix = email.substring(atIndex) // Mantenha o "@" e o restante do e-mail
            const displayedEmail = `${prefix.substring(0, 13)}...${suffix}`
            return displayedEmail
        } else {
            return email
        }
    }

    const onPressLogout = async () => {
        const success = await signOut()
        if (success) {
            console.log('Logout realizado com sucesso')
            navigation.navigate('Login') // Navegue para a tela de login após o logout
        } else {
            console.error('Erro ao fazer logout')
        }
    }

    const onPressDeleteAccount = () => {
        Alert.alert('Confirmação', 'Você realmente deseja deletar sua conta?', [
            {
                text: 'Não',
                style: 'cancel',
            },
            {
                text: 'Sim',
                onPress: async () => {
                    try {
                        await deleteUser(userId)
                        console.log('Conta deletada com sucesso')
                        alert('Conta deletada com sucesso.')
                        navigation.navigate('Login')
                    } catch (error) {
                        console.error('Erro ao deletar a conta', error)
                    }
                },
            },
        ])
    }

    return (
        <View style={styles.container}>
            <AntDesign
                onPress={() => navigation.goBack()}
                name="arrowleft"
                size={30}
                color="white"
                style={styles.arrow}
            />
            <View style={styles.logoutContainer}>
                <AntDesign
                    onPress={onPressLogout}
                    name="logout"
                    size={30}
                    color="white"
                />
                <Text style={styles.logoutText}>Sair</Text>
            </View>
            <Image
                source={{
                    uri: 'https://picsum.photos/300/310',
                }}
                style={styles.profileImage}
            />
            <Pressable style={styles.expenseHistory} onPress={onPressExpenseHistory}>
                <Text style={styles.textBold}>Meu histórico de despesas</Text>
                <AntDesign name="right" size={12}/>
            </Pressable>
            <Pressable style={styles.name} onPress={onPressChangeName}>
                <Text style={styles.textBold}>Nome</Text>
                <Text style={styles.infoText} ellipsizeMode={"tail"}
                      numberOfLines={1}>
                    {name}
                </Text>
                <AntDesign name="right" size={12}/>
            </Pressable>
            <Pressable style={styles.changeEmail} onPress={onPressChangeEmail}>
                <Text style={styles.textBold}>Alterar E-mail</Text>
                <Text style={styles.infoText} ellipsizeMode={"tail"}
                      numberOfLines={1}>
                    {"formatEmailForDisplay(userEmail)@gmail.com"}
                </Text>
                <AntDesign name="right" size={12}/>
            </Pressable>
            <Pressable style={styles.changePassword} onPress={onPressChangePassword}>
                <Text style={[styles.textBold]}>Alterar Senha</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={onPressDeleteAccount}>
                <Text style={styles.buttonText}>Deletar minha conta</Text>
            </Pressable>
        </View>
    )
}


export default Profile;