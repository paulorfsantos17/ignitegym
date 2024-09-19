import { AuthContext } from '@contexts/AuthContext'
import { useContext } from 'react'

export function useAuth() {
  const authContext = useContext(AuthContext)
  return authContext
}
