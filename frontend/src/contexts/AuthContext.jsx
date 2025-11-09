import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    try {
      const formData = new FormData()
      formData.append('username', username)
      formData.append('password', password)

      const response = await axios.post('/api/auth/login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const { access_token, user: userData } = response.data
      localStorage.setItem('token', access_token)
      localStorage.setItem('user', JSON.stringify(userData))
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
      setUser(userData)
      return userData
    } catch (error) {
      // Re-throw error dengan pesan yang lebih jelas
      if (error.response) {
        // Server responded with error
        throw new Error(error.response.data?.detail || 'Terjadi kesalahan saat login')
      } else if (error.request) {
        // Request made but no response
        throw new Error('Tidak dapat terhubung ke server. Pastikan backend server berjalan.')
      } else {
        // Something else happened
        throw new Error(error.message || 'Terjadi kesalahan saat login')
      }
    }
  }

  const register = async (userData) => {
    const response = await axios.post('/api/auth/register', userData)
    return response.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

