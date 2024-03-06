import React, { useState } from 'react'
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { TextInputMask } from 'react-native-masked-text'
import { useNavigation } from '@react-navigation/native'
import { AntDesign } from '@expo/vector-icons'
import { Switch } from 'react-native'

import { DateTimeInput } from '../../components/DateTimeInput'
import { createGroupWithSharedDebt } from '../../../backend/group-config/group-service'
import { styles } from './CreateGroupScreenStyles'

import * as Notifications from 'expo-notifications'
import { useLocalNotification } from '../../resources/useNotifications'
import { schedulePushNotification } from '../../utils/handleNotification'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

function CreateGroupScreen({ route }) {
  const adminUserId = route.params.uid
  const navigation = useNavigation()

  const [groupName, setGroupName] = useState('')
  const [pix, setPix] = useState('')
  const [total, setTotal] = useState('')
  const [date, setDate] = useState('')
  const [participants, setParticipants] = useState([])
  const [isRecurrent, setIsRecurrent] = useState(false)

  // New state variable to track group creation in progress
  const [creatingGroup, setCreatingGroup] = useState(false)

  // Notifications
  useLocalNotification()

  const toggleRecurrence = () => {
    setIsRecurrent(!isRecurrent)
  }

  const handleLocalPushNotification = async (
    groupName: string,
    trigger: number,
    isRecurrent: boolean
  ) => {
    await schedulePushNotification(groupName, trigger, isRecurrent)
  }

  const createGroupThenBackHome = async () => {
    // Set creatingGroup to true to show the ActivityIndicator
    setCreatingGroup(true)

    const groupId = await createGroupWithSharedDebt(
      groupName,
      adminUserId,
      pix,
      total,
      'equals',
      participants
    )

    if (groupId) {
      // Group was created, scheduling notification
      const [day, month, year] = date.split(' / ')
      const dateLimit = new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        10
      )
      const currentDate = new Date()

      const seconds = (dateLimit.getTime() - currentDate.getTime()) / 1000

      handleLocalPushNotification(groupName, seconds, isRecurrent)
    }

    route.params.refreshData()

    // Delayed navigation or any other actions

    setTimeout(() => {
      setCreatingGroup(false)
      navigation.goBack()
    }, 1500)
  }

  const getMinimumDate = () => {
    var dataAtual = new Date()

    var diaAtual = dataAtual.getDate()
    dataAtual.setDate(diaAtual + 1)

    return dataAtual
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
        <Text style={styles.headerText}>Novo Grupo</Text>
        <View style={styles.headerSpacer} />
      </View>

      <Text style={styles.label}>Nome do Grupo</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do grupo"
        value={groupName}
        onChangeText={(text) => setGroupName(text)}
      />

      <Text style={styles.label}>PIX</Text>
      <TextInput
        style={styles.input}
        placeholder="Chave PIX do grupo"
        value={pix}
        onChangeText={(text) => setPix(text)}
      />

      <Text style={styles.label}>Valor Total</Text>
      <TextInputMask
        style={styles.input}
        placeholder="Valor a ser dividido"
        type={'money'}
        options={{
          precision: 2,
          separator: ',',
          delimiter: '.',
          unit: 'R$',
          suffixUnit: '',
        }}
        value={total}
        onChangeText={(formatted, raw) => {
          setTotal(raw)
        }}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Vencimento</Text>
      <DateTimeInput
        value={date}
        setValue={(date) => setDate(date)}
        minimumDate={getMinimumDate()}
      />

      <View style={styles.toggleContainer}>
        <Text style={styles.label}>Ativar notificações recorrentes?</Text>
        <Switch value={isRecurrent} onValueChange={toggleRecurrence} />
      </View>

      <TouchableOpacity
        style={styles.createButton}
        onPress={createGroupThenBackHome}
      >
        {creatingGroup ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={styles.buttonText}>Criar Grupo</Text>
        )}
      </TouchableOpacity>
    </View>
  )
}

export default CreateGroupScreen
