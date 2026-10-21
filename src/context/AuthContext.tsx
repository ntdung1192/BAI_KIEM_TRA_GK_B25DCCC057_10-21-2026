import { useState, type ReactNode } from 'react'
import { AuthContext } from '../hooks/useAuth'

const USER_KEY = 'miniblog.user'

function readSavedUser() {
  return localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(readSavedUser)

  const signIn = (name: string, password: string, remember: boolean) => {
    if (name !== 'admin' || password !== '123456') return false

    // ghi nho -> localStorage, khong thi chi luu trong phien (dong tab la mat)
    const storage = remember ? localStorage : sessionStorage
    storage.setItem(USER_KEY, name)
    setUsername(name)
    return true
  }

  const signOut = () => {
    localStorage.removeItem(USER_KEY)
    sessionStorage.removeItem(USER_KEY)
    setUsername(null)
  }

  return <AuthContext.Provider value={{ username, signIn, signOut }}>{children}</AuthContext.Provider>
}
