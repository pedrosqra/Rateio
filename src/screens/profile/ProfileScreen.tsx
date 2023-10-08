import * as React from 'react'
import { AntDesign } from '@expo/vector-icons'
import { StyleSheet, Text, View, Pressable, Image } from 'react-native'

const Profile = () => {
  return (
    <View style={styles.container}>
      <AntDesign
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
      <Pressable style={styles.firstName}>
        <Text style={styles.textBold}>Nome</Text>
        <Text>
          {`Seu nome`} <AntDesign name="right" size={12} />
        </Text>
      </Pressable>
      <Pressable style={styles.lastName}>
        <Text style={styles.textBold}>Sobrenome</Text>
        <Text>
          {`Seu sobrenome`} <AntDesign name="right" size={12} />
        </Text>
      </Pressable>
      <Pressable style={styles.changeEmail}>
        <Text style={styles.textBold}>Alterar E-mail</Text>
        <Text>
          {`n****@gmail.com`} <AntDesign name="right" size={12} />
        </Text>
      </Pressable>
      <Pressable style={styles.changePassword}>
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
