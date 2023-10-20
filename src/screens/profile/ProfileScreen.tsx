import React, { useState, useEffect } from 'react'; // Importe o useState e useEffect
import { AntDesign } from '@expo/vector-icons'
import { StyleSheet, Text, View, Pressable, Image } from 'react-native'
import {useNavigation} from '@react-navigation/native';
import {readUser} from '../../../backend/user-config/user-service';

const Profile = ({route}) => {
  const [userName] = useState('');
  const [firstName, setFirstName] = useState(''); 
  const [lastName, setLastName] = useState(''); 
  const [userEmail, setUserEmail] = useState('');

  const navigation = useNavigation();
  const { userId } = route.params; 

  useEffect(() => {
    // Use o userId para buscar as informações do usuário
    readUser(userId).then((userData) => {
      if (userData && userData.name) {  
        const nameParts = userData.name.split(' ');
        const firstName = nameParts[0]; 
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
  
        setFirstName(firstName);
        setLastName(lastName);
      }
      if (userData && userData.email) {
        setUserEmail(userData.email); // Atualize o estado com o e-mail do usuário
      }
    }).catch((error) => {
      console.error('Erro ao obter dados do usuário', error);
    });
  }, []);

  const onPressChangeFirstName = () => {
    navigation.navigate('ChangeFirstNameScreen');
    console.log('Abrir Editar Nome');
    console.log()
  };

  const onPressChangeLastName = () => {
    navigation.navigate('ChangeLastNameScreen');
    console.log('Abrir Editar Nome');
  };
  
  const onPressChangeEmail = () => {
    navigation.navigate('ChangeEmail');
    console.log('Abrir Editar Email');
  };

  const onPressChangePassword = () => {
    navigation.navigate('ChangePassword');
    console.log('Abrir Editar Senha');
  };

  return (
    <View style={styles.container}>
      <AntDesign
        onPress={() => navigation.goBack()}
        name="arrowleft"
        size={30}
        color="white"
        style={styles.arrow}
      />
      <Image
        source={{
          uri: 'https://picsum.photos/200/320',
        }}
        style={styles.profileImage}
      />
      <Pressable style={styles.expenseHistory}>
        <Text style={styles.textBold}>Meu histórico de despesas</Text>
        <AntDesign name="right" size={12} />
      </Pressable>
      <Pressable style={styles.firstName} onPress={onPressChangeFirstName}>
        <Text style={styles.textBold}>Nome</Text>
        <Text>
          {firstName} <AntDesign name="right" size={12} />
        </Text>
      </Pressable>
      <Pressable style={styles.lastName} onPress={onPressChangeLastName}>
        <Text style={styles.textBold}>Sobrenome</Text>
        <Text>
          {lastName} <AntDesign name="right" size={12} />
        </Text>
      </Pressable>
      <Pressable style={styles.changeEmail} onPress={onPressChangeEmail}>
        <Text style={styles.textBold}>Alterar E-mail</Text>
        <Text>
          {userEmail} <AntDesign name="right" size={12} />
        </Text>
      </Pressable>
      <Pressable style={styles.changePassword} onPress={onPressChangePassword}>
        <Text style={[styles.textBold]}>Alterar Senha</Text>
      </Pressable>
      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Deletar minha conta</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#373b3f',
    flex: 1,
    width: '100%',
    height: 844,
    overflow: 'hidden',
    borderRadius: 8,
  },
  profileImage: {
    alignSelf: 'center',
    top: 83,
    width: 100,
    height: 100,
    position: 'absolute',
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#1CC29F',
  },
  expenseHistory: {
    top: 210,
    padding: 16,
    justifyContent: 'space-between',
    right: '6.41%',
    width: '87.69%',
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    left: '5.9%',
    position: 'absolute',
  },
  firstName: {
    top: 285,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    padding: 16,
    justifyContent: 'space-between',
    right: '6.41%',
    width: '87.69%',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    left: '5.9%',
    position: 'absolute',
  },
  lastName: {
    top: 338,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    left: '5.9%',
    right: '6.41%',
    width: '87.69%',
    position: 'absolute',
  },
  arrow: {
    position: 'absolute',
    left: 30,
    top: 50,
  },
  button: {
    width: '87.44%',
    top: 541,
    right: '6.67%',
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    left: '5.9%',
    position: 'absolute',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    color: '#d73018',
    fontWeight: 'bold',
  },
  textBold: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  changeEmail: {
    top: 413,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    padding: 16,
    justifyContent: 'space-between',
    right: '6.41%',
    width: '87.69%',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    left: '5.9%',
    position: 'absolute',
  },
  changePassword: {
    top: 466,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    left: '5.9%',
    right: '6.41%',
    width: '87.69%',
    position: 'absolute',
  },
})

export default Profile
