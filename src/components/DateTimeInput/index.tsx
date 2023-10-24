import React, { useState } from 'react'
import { Pressable, Text } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'

import DateTimePickerModal from 'react-native-modal-datetime-picker'

import { styles } from './styles'
import { Props } from './types'

export const DateTimeInput = ({
  value,
  setValue,
  maximumDate,
  minimumDate
}: Props) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
  const mode = 'date'

  const hideDatePicker = () => setDatePickerVisibility(false)

  const handleConfirm = (pickedValue: Date) => {
    const day  = pickedValue.getDate().toString().padStart(2, '0')
    const month  = (pickedValue.getMonth()+1).toString().padStart(2, '0')
    const year  = pickedValue.getFullYear()

    setValue(`${day} / ${month} / ${year}`)

    hideDatePicker()
  }

  return (
    <>
      <Pressable
        onPress={() => setDatePickerVisibility(true)}
        style={styles.container}
      >
        <Text style={styles.text}>{value}</Text>
        <Ionicons name="chevron-up-outline" size={20} color="#252424" />
      </Pressable>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode={mode}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        maximumDate={maximumDate}
        minimumDate={minimumDate}
        locale='pt-BR'
      />
    </>
  )
}
