import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { api } from '../services/api'
import { motion } from 'framer-motion'

export default function ScoresView() {
  const [scores, setScores] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [feedbackMessage, setFeedbackMessage] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [scoresRes, studentsRes] = await Promise.all([
        api.getScores(),
        api.getStudents(),
      ])
      setScores(scoresRes.data)
      setStudents(studentsRes.data)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendFeedback = async (studentId) => {
    if (!feedbackMessage.trim()) {
      alert('Silakan masukkan pesan feedback')
      return
    }

    try {
      await api.createFeedback({
        student_id: studentId,
        message: feedbackMessage,
      })
      alert('Feedback berhasil dikirim')
      setFeedbackMessage('')
      setSelectedStudent(null)
    } catch (error) {
      console.error('Error sending feedback:', error)
      alert('Terjadi kesalahan saat mengirim feedback')
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="text-xl">Memuat data skor...</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Skor Siswa
        </h1>
        <p className="text-gray-600">
          Lihat semua skor dan progress siswa
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Nama Siswa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Total Pertanyaan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Jawaban Benar
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Total Poin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Akurasi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {scores.map((score, index) => (
              <motion.tr
                key={score.student_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {score.student_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {score.total_questions}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                  {score.correct_answers}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-semibold">
                  {score.total_points}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center">
                    <span className="font-semibold mr-2">
                      {score.accuracy.toFixed(1)}%
                    </span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          score.accuracy >= 80
                            ? 'bg-green-500'
                            : score.accuracy >= 60
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${score.accuracy}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => setSelectedStudent(score.student_id)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Beri Feedback
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedStudent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => {
            setSelectedStudent(null)
            setFeedbackMessage('')
          }}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Beri Feedback
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pesan Feedback
              </label>
              <textarea
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tulis feedback untuk siswa..."
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setSelectedStudent(null)
                  setFeedbackMessage('')
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button
                onClick={() => handleSendFeedback(selectedStudent)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Kirim
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </Layout>
  )
}

