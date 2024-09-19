import { createContext, type ReactNode } from 'react'

import { UserDTO } from '../dtos/UserDTO'
export interface AuthContextDataProps {
  user: UserDTO
}
interface AuthContextProviderProps {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextDataProps)

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  return (
    <AuthContext.Provider value={{ user: {} }}>{children}</AuthContext.Provider>
  )
}
