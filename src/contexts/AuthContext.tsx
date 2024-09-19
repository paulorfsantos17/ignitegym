import { api } from '@services/api'
import { createContext, type ReactNode, useState } from 'react'

import { UserDTO } from '../dtos/UserDTO'
export interface AuthContextDataProps {
  user: UserDTO
  signIn: (email: string, password: string) => Promise<void>
}
interface AuthContextProviderProps {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextDataProps)

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO)

  async function signIn(email: string, password: string) {
    const { data } = await api.post('/sessions', { email, password })
    if (data.user) {
      setUser(data.user)
    }
  }

  return (
    <AuthContext.Provider value={{ user, signIn }}>
      {children}
    </AuthContext.Provider>
  )
}
