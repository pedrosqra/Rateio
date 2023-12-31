import React, { useState } from 'react' // Importe o useState e useEffect
import { AntDesign } from '@expo/vector-icons'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { updateUserEmail } from '../../../backend/user-config/user-service'

const ChangeEmail = ({ route }) => {
  const navigation = useNavigation()
  const { userId } = route.params
  const currentEmail = route.params?.currentEmail || ''

  const [newEmail, setNewEmail] = useState(currentEmail)

  const handleUpdateEmail = async () => {
    try {
      if (newEmail === '') {
        console.log('O novo e-mail não pode estar vazio')
        return
      }

      await updateUserEmail(userId, newEmail) // Substitua userId pelo valor apropriado

      console.log('E-mail atualizado com sucesso')
      navigation.goBack()
    } catch (error) {
      console.error('Erro ao atualizar o e-mail:', error)
    }
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

      <Text style={[styles.title]}>Alterar e-mail</Text>

      <View style={styles.inputContainer}>
        <TextInput
          value={newEmail}
          onChangeText={(text) => setNewEmail(text)}
          style={styles.input}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleUpdateEmail}>
          <Text style={styles.buttonText}>Atualizar e-mail</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#373B3F',
    height: '100%',
  },
  arrow: {
    position: 'absolute',
    left: 30,
    top: 50,
  },
  title: {
    top: 90,
    left: '8.72%',
    fontSize: 24,
    lineHeight: 32,
    textAlign: 'left',
    position: 'absolute',
    color: '#fff',
    fontWeight: '700',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    padding: 10,
    borderRadius: 8,
    borderColor: '#1CC29F',
    color: 'white',
    paddingVertical: 12,
    top: 152,
    right: '6.15%',
    left: '6.15%',
    position: 'absolute',
    borderStyle: 'solid',
    borderBottomWidth: 2,
  },
  input: {
    width: '95%',
    backgroundColor: '#373B3F',
    borderColor: 'transparent',
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: 60,
  },
  button: {
    top: 260,

    width: '90%',
    height: 55,
    backgroundColor: '#1CC29F',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
})

export default ChangeEmail
