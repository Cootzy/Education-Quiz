import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { api } from '../services/api'
import { motion } from 'framer-motion'

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
          <div className="text-xl">Memuat mata pelajaran...</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Pilih Mata Pelajaran
        </h1>
        <p className="text-gray-600">
          Pilih mata pelajaran yang ingin Anda pelajari
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject, index) => (
          <motion.div
            key={subject.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition"
            onClick={() => navigate(`/quiz/${subject.id}`)}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {subject.name}
              </h2>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
            </div>
            {subject.description && (
              <p className="text-gray-600 mb-4">{subject.description}</p>
            )}
            <div className="flex items-center text-blue-600 font-semibold">
              Mulai Kuis
              <span className="ml-2">→</span>
            </div>
          </motion.div>
        ))}

        {subjects.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">
              Belum ada mata pelajaran tersedia
            </p>
          </div>
        )}
      </div>
    </Layout>
  )
}

