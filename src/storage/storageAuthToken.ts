import AsyncStorage from '@react-native-async-storage/async-storage'

import { AUTH_TOKEN_STORAGE } from './storageConfig'

interface storageAuthTokenProps {
  token: string
  refreshToken: string
}

export async function storageAuthTokenSave({
  refreshToken,
  token,
}: storageAuthTokenProps) {
  await AsyncStorage.setItem(
    AUTH_TOKEN_STORAGE,
    JSON.stringify({ token, refreshToken }),
  )
}

export async function storageAuthTokenGet() {
  const response = await AsyncStorage.getItem(AUTH_TOKEN_STORAGE)
  const { token, refreshToken }: storageAuthTokenProps = response
    ? JSON.parse(response)
    : {}

  return { token, refreshToken }
}
export async function storageAuthTokenRemove() {
  await AsyncStorage.removeItem(AUTH_TOKEN_STORAGE)
}
