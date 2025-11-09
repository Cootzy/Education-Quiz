import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { api } from '../services/api'
import { motion } from 'framer-motion'

export default function Progress() {
  const [progress, setProgress] = useState(null)
  const [feedbacks, setFeedbacks] = useState([])
  const [userLevel, setUserLevel] = useState(null)
  const [achievements, setAchievements] = useState([])
  const [availableAchievements, setAvailableAchievements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProgress()
    loadFeedbacks()
    loadLevel()
    loadAchievements()
  }, [])

  const loadProgress = async () => {
    try {
      const response = await api.getProgress()
      setProgress(response.data)
    } catch (error) {
      console.error('Error loading progress:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadFeedbacks = async () => {
    try {
      const response = await api.getFeedback()
      setFeedbacks(response.data)
    } catch (error) {
      console.error('Error loading feedbacks:', error)
    }
  }

  const loadLevel = async () => {
    try {
      const response = await api.getMyLevel()
      setUserLevel(response.data)
    } catch (error) {
      console.error('Error loading level:', error)
    }
  }

  const loadAchievements = async () => {
    try {
      const [myAchievements, allAchievements] = await Promise.all([
        api.getMyAchievements(),
        api.getAvailableAchievements()
      ])
      setAchievements(myAchievements.data)
      setAvailableAchievements(allAchievements.data)
    } catch (error) {
      console.error('Error loading achievements:', error)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="text-xl">Memuat progress...</div>
        </div>
      </Layout>
    )
  }

  if (!progress) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500">Tidak ada data progress</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Progress Belajar
        </h1>
        <p className="text-gray-600">
          Lihat kemajuan belajar Anda di sini
        </p>
      </div>

      {/* Level Display */}
      {userLevel && (
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-8 text-white"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">Level {userLevel.level}</h2>
                <p className="text-blue-100 mb-4">
                  Total Experience: {userLevel.total_experience} XP
                </p>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress ke Level {userLevel.level + 1}</span>
                    <span>
                      {userLevel.total_experience} / {((userLevel.level) ** 2) * 100} XP
                    </span>
                  </div>
                  <div className="w-full bg-blue-300 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${Math.min(100, (userLevel.total_experience / (((userLevel.level) ** 2) * 100)) * 100)}%` 
                      }}
                      className="bg-yellow-300 h-3 rounded-full"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                  <div>
                    <div className="text-yellow-300 font-bold text-lg">🔥</div>
                    <div>Streak: {userLevel.current_streak}</div>
                    <div className="text-blue-200">Max: {userLevel.max_streak}</div>
                  </div>
                  <div>
                    <div className="text-green-300 font-bold text-lg">✓</div>
                    <div>Benar: {userLevel.total_correct}</div>
                    <div className="text-blue-200">Total: {userLevel.total_questions}</div>
                  </div>
                  <div>
                    <div className="text-purple-300 font-bold text-lg">⭐</div>
                    <div>Akurasi</div>
                    <div className="text-blue-200">
                      {userLevel.total_questions > 0 
                        ? ((userLevel.total_correct / userLevel.total_questions) * 100).toFixed(1) 
                        : 0}%
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-6xl ml-4">🎯</div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {progress.total_questions_attempted}
          </div>
          <div className="text-gray-600">Total Pertanyaan</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="text-3xl font-bold text-green-600 mb-2">
            {progress.total_correct}
          </div>
          <div className="text-gray-600">Jawaban Benar</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {progress.total_points}
          </div>
          <div className="text-gray-600">Total Poin</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {progress.accuracy.toFixed(1)}%
          </div>
          <div className="text-gray-600">Akurasi</div>
        </motion.div>
      </div>

      {/* Subject Progress */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Progress per Mata Pelajaran
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {progress.subjects.map((subject, index) => (
            <motion.div
              key={subject.subject_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {subject.subject_name}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Pertanyaan Dijawab:</span>
                  <span className="font-semibold">{subject.total_questions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Jawaban Benar:</span>
                  <span className="font-semibold text-green-600">
                    {subject.correct_answers}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Poin:</span>
                  <span className="font-semibold text-blue-600">
                    {subject.total_points}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Akurasi:</span>
                    <span className="font-semibold">
                      {subject.accuracy.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${subject.accuracy}%` }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="bg-blue-600 h-2 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Achievements Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Achievement & Badge
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableAchievements.map((achievement, index) => {
            const unlocked = achievements.some(a => a.achievement.id === achievement.id)
            const unlockedAchievement = achievements.find(a => a.achievement.id === achievement.id)
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-xl p-6 border-2 ${
                  unlocked
                    ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-400 shadow-lg'
                    : 'bg-gray-100 border-gray-300 opacity-60'
                }`}
              >
                <div className="text-4xl mb-3">{achievement.icon}</div>
                <h3 className={`text-lg font-bold mb-2 ${unlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                  {achievement.name}
                </h3>
                <p className={`text-sm mb-3 ${unlocked ? 'text-gray-700' : 'text-gray-500'}`}>
                  {achievement.description}
                </p>
                {unlocked && unlockedAchievement && (
                  <div className="text-xs text-gray-600">
                    Unlocked: {new Date(unlockedAchievement.unlocked_at).toLocaleDateString('id-ID')}
                  </div>
                )}
                {!unlocked && (
                  <div className="text-xs text-gray-500 italic">
                    Belum di-unlock
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Feedback Section */}
      {feedbacks.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Feedback dari Guru
          </h2>
          <div className="space-y-4">
            {feedbacks.map((feedback, index) => (
              <motion.div
                key={feedback.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-yellow-50 border border-yellow-200 rounded-xl p-6"
              >
                <div className="flex items-start">
                  <div className="text-2xl mr-4">💬</div>
                  <div className="flex-1">
                    <p className="text-gray-800 mb-2">{feedback.message}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(feedback.created_at).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  )
}

