import { create } from 'zustand'

import {
  State,
  User
} from './types'

const initialState: User = {
  email: '',
  apiKey: '',
  stkManager: {
    accessToken: '',
    refreshToken: ''
  },
  uuid: ''
}

export const useUserStore = create<State>((set) => ({
  ...initialState,
  setPersonalData: (data) => set(() => ({
    ...data
  })),
  clearPersonalData: () => set(() => ({
    ...initialState
  }))
}))
