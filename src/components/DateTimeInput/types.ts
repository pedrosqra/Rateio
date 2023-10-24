import { StyleProp, ViewStyle } from 'react-native'

export type Props = {
  value: string
  setValue: (value: string) => void
  maximumDate?: Date
  minimumDate?: Date
}
