// frontend/src/pages/Login.jsx
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      await login(username, password)
      navigate('/dashboard') 
    } catch (err) {
      setError('Username atau password salah. Coba lagi.')
    }
  }

  return (
    <div className="login-container min-h-screen p-4"> 
      
      <div className="formula-bg" aria-hidden="true">
        <span>E=mc²</span>
        <span>H₂O</span>
        <span>&Sigma;F = ma</span>
        <span>C₆H₁₂O₆</span>
        <span>&int;f(x)dx</span>
        <span>&pi;r²</span>
        <span>a²+b²=c²</span>
        <span>&Delta;G = &Delta;H - T&Delta;S</span>
        <span>PV=nRT</span>
        <span>&lambda; = h/p</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="w-full max-w-md p-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl z-30" 
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500">
            YASMIN EduGame
          </h1>
          <p className="text-gray-600 text-sm">
            SMA Mutiara Insan Nusantara
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label 
              htmlFor="username" 
              className="block text-sm font-medium text-gray-800 mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/70 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Masukkan username"
            />
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-800 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/70 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Masukkan password"
            />
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-bold text-lg transition duration-300 shadow-lg"
          >
            Masuk
          </motion.button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-8">
          Belum punya akun?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            Daftar di sini
          </Link>
        </p>

      </motion.div>
    </div>
  )
}