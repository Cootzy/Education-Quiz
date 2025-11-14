// frontend/src/pages/StudentDashboard.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { api } from '../services/api'
import { motion } from 'framer-motion'
import { BookOpen, BarChart2, CheckCircle, Award } from 'lucide-react'

const icons = [
  <BookOpen size={24} />,
  <BarChart2 size={24} />,
  <CheckCircle size={24} />,
  <Award size={24} />,
]

const iconColors = [
  'bg-blue-100 text-blue-600',
  'bg-green-100 text-green-600',
  'bg-yellow-100 text-yellow-600',
  'bg-pink-100 text-pink-600',
  'bg-purple-100 text-purple-600',
]

export default function StudentDashboard() {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadSubjects()
  }, [])

  const loadSubjects = async () => {
    try {
      const response = await api.getSubjects()
      setSubjects(response.data)
    } catch (error) {
      console.error('Error loading subjects:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="text-xl text-gray-700 animate-pulse">
            Memuat mata pelajaran...
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500">
          Pilih Misi Belajar
        </h1>
        <p className="text-gray-600 text-lg">
          Pilih mata pelajaran yang ingin kamu taklukkan hari ini.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject, index) => (
          <motion.div
            key={subject.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.03, y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer overflow-hidden"
            onClick={() => navigate(`/quiz/${subject.id}`)}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {subject.name}
              </h2>
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center ${iconColors[index % iconColors.length]}`}
              >
                {icons[index % icons.length]}
              </div>
            </div>
            {subject.description && (
              <p className="text-gray-600 mb-6">{subject.description}</p>
            )}
            <div className="flex items-center text-blue-600 font-semibold text-lg group">
              Mulai Misi
              <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
            </div>
          </motion.div>
        ))}

        {subjects.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">
              Belum ada misi tersedia. Admin sedang mempersiapkan!
            </p>
          </div>
        )}
      </div>
    </Layout>
  )
}