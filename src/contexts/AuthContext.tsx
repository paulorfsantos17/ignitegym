import { api } from '@services/api'
import {
  storageAuthTokenGet,
  storageAuthTokenRemove,
  storageAuthTokenSave,
} from '@storage/storageAuthToken'
import {
  storageUserGet,
  storageUserRemove,
  storageUserSave,
} from '@storage/storageUser'
import { AppError } from '@utils/AppError'
import { createContext, type ReactNode, useEffect, useState } from 'react'

import { UserDTO } from '../dtos/UserDTO'
export interface AuthContextDataProps {
  user: UserDTO
  signIn: (email: string, password: string) => Promise<void>
  isLoadingUserStorageData: boolean
  signOut: () => Promise<void>
  updateUserProfile: (userUpdate: UserDTO) => Promise<void>
}
interface AuthContextProviderProps {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextDataProps)

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO)
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true)

  async function userAndTokenUpdate(userData: UserDTO, token: string) {
    setUser(userData)
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  }
  async function storageUserAndTokenSave(
    userData: UserDTO,
    token: string,
    refreshToken: string,
  ) {
    try {
      setIsLoadingUserStorageData(true)
      await storageUserSave(userData)
      await storageAuthTokenSave({ token, refreshToken })
    } catch (error) {
      throw new AppError(
        'Error ao salvar dados do usuário. Tente novamente mais tarde.',
      )
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  async function signIn(email: string, password: string) {
    const { data } = await api.post('/sessions', { email, password })
    if (data.user && data.token && data.refresh_token) {
      await storageUserAndTokenSave(data.user, data.token, data.refresh_token)
      userAndTokenUpdate(data.user, data.token)
    }
    setIsLoadingUserStorageData(false)
  }

  async function signOut() {
    try {
      setIsLoadingUserStorageData(true)
      await storageAuthTokenRemove()
      setUser({} as UserDTO)
      await storageUserRemove()
    } catch (error) {
      throw new AppError('Error ao sair da conta. Tente novamente mais tarde.')
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  async function updateUserProfile(userUpdate: UserDTO) {
    try {
      setUser(userUpdate)
      await storageUserSave(userUpdate)
    } catch (error) {
      throw new AppError('Error ao atualizar o usuário.')
    }
  }

  async function loadUserData() {
    try {
      const userLogged = await storageUserGet()

      const { token } = await storageAuthTokenGet()

      if (token && userLogged.id) {
        userAndTokenUpdate(userLogged, token)
      }
    } catch (error) {
      throw new AppError(
        'Erro ao carregar usuário. tente novamente mais tarde.',
      )
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  useEffect(() => {
    loadUserData()
  }, [])
  useEffect(() => {
    const subscribe = api.registerInterceptTokenManager(signOut)

    return () => {
      subscribe()
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        isLoadingUserStorageData,
        signOut,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
