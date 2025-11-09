import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to={user?.is_admin ? '/admin' : '/dashboard'} className="text-xl font-bold text-blue-600">
                Platform Kuis Edukatif
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <>
                  <span className="text-gray-700">Halo, {user.full_name}</span>
                  {user.is_admin ? (
                    <>
                      <Link
                        to="/admin/questions"
                        className="text-gray-700 hover:text-blue-600 transition"
                      >
                        Kelola Pertanyaan
                      </Link>
                      <Link
                        to="/admin/subjects"
                        className="text-gray-700 hover:text-blue-600 transition"
                      >
                        Kelola Mata Pelajaran
                      </Link>
                      <Link
                        to="/admin/scores"
                        className="text-gray-700 hover:text-blue-600 transition"
                      >
                        Lihat Skor
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/dashboard"
                        className="text-gray-700 hover:text-blue-600 transition"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/progress"
                        className="text-gray-700 hover:text-blue-600 transition"
                      >
                        Progress
                      </Link>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Keluar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

