import React, { useState } from 'react'
import { AntDesign } from '@expo/vector-icons'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { updateUserPassword } from '../../../backend/user-config/user-service'

const ChangePassword = ({ route }) => {
  const navigation = useNavigation()
  const { userId } = route.params

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const isButtonDisabled = !oldPassword || !newPassword
  const handleChangePassword = async () => {
    try {
      await updateUserPassword(userId, oldPassword, newPassword)
      navigation.goBack()
    } catch (error) {
      console.error('Erro ao alterar a senha:', error)
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

      <Text style={[styles.title]}>Alterar senha</Text>
      <View style={styles.oldPass}>
        <TextInput
          value={oldPassword}
          onChangeText={setOldPassword}
          style={styles.input}
          secureTextEntry
          placeholderTextColor={styles.placeholderText.color}
          placeholder="Antiga senha"
        />
      </View>
      <View style={styles.newPass}>
        <TextInput
          value={newPassword}
          onChangeText={setNewPassword}
          style={styles.input}
          secureTextEntry
          placeholderTextColor={styles.placeholderText.color}
          placeholder="Nova senha"
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, isButtonDisabled && styles.disabledButton]}
          onPress={handleChangePassword}
          disabled={isButtonDisabled}
        >
          <Text style={styles.buttonText}>Confirmar</Text>
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
  oldPass: {
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
  newPass: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    padding: 10,
    borderRadius: 8,
    borderColor: '#1CC29F',
    color: 'white',
    paddingVertical: 12,
    top: 212,
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
    top: 300,
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
  placeholderText: {
    color: 'white',
  },
  disabledButton: {
    backgroundColor: 'gray',
  },
})

export default ChangePassword
