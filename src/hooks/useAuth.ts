import { createContext, useContext } from 'react'

interface AuthState {
  username: string | null
  signIn: (name: string, password: string, remember: boolean) => boolean
  signOut: () => void
}

export const AuthContext = createContext<AuthState | null>(null)

export function useAuth() {
  const value = useContext(AuthContext)
  if (value === null) {
    throw new Error('Chua boc AuthProvider ngoai app')
  }
  return value
}
