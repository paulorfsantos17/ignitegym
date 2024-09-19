import { api } from '@services/api'
import { storageUserGet, storageUserSave } from '@storage/storageUser'
import { AppError } from '@utils/AppError'
import { createContext, type ReactNode, useEffect, useState } from 'react'

import { UserDTO } from '../dtos/UserDTO'
export interface AuthContextDataProps {
  user: UserDTO
  signIn: (email: string, password: string) => Promise<void>
  isLoadingUserStorageData: boolean
}
interface AuthContextProviderProps {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextDataProps)

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO)
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true)

  async function signIn(email: string, password: string) {
    const { data } = await api.post('/sessions', { email, password })
    if (data.user) {
      setUser(data.user)
      storageUserSave(data.user)
    }
  }

  async function loadUserData() {
    try {
      const userLogged = await storageUserGet()
      if (userLogged.id) {
        setIsLoadingUserStorageData(false)
        setUser(userLogged)
      }
    } catch (error) {
      throw new AppError(
        'Erro ao carregar usuário. tente novamente mais tarde.',
      )
    }
  }

  useEffect(() => {
    loadUserData()
  }, [])

  return (
    <AuthContext.Provider value={{ user, signIn, isLoadingUserStorageData }}>
      {children}
    </AuthContext.Provider>
  )
}
