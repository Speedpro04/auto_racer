import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '../lib/supabase'
import { StoreUser } from '../types'

interface AuthContextType {
  user: StoreUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StoreUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('user')
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser))
    }
    
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    // Buscar dados do usuário da loja
    const { data: storeUser } = await supabase
      .from('store_users')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (storeUser) {
      localStorage.setItem('auth_token', data.session?.access_token || '')
      localStorage.setItem('user', JSON.stringify(storeUser))
      setUser(storeUser)
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    setUser(null)
    supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
