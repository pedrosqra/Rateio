export type User = {
  email: string
  apiKey: string
  stkManager: {
    accessToken: string
    refreshToken: string
  }
  uuid: string
}

export type State = User & {
  setPersonalData: (data: any) => void
  clearPersonalData: () => void
}
