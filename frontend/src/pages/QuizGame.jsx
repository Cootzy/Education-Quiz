import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { api } from '../services/api'
import { motion, AnimatePresence } from 'framer-motion'
import MultipleChoiceQuestion from '../components/quiz/MultipleChoiceQuestion'
import DragDropQuestion from '../components/quiz/DragDropQuestion'
import FillBlankQuestion from '../components/quiz/FillBlankQuestion'
import TrueFalseQuestion from '../components/quiz/TrueFalseQuestion'

export default function QuizGame() {
  const { subjectId } = useParams()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState({})
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showResults, setShowResults] = useState(false)
  const [levelUp, setLevelUp] = useState(false)
  const [newLevel, setNewLevel] = useState(null)

  useEffect(() => {
    loadQuestions()
  }, [subjectId])

  const loadQuestions = async () => {
    try {
      const response = await api.getQuestionsBySubject(subjectId)
      setQuestions(response.data)
    } catch (error) {
      console.error('Error loading questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer })
  }

  const handleSubmit = async () => {
    const currentQuestion = questions[currentIndex]
    if (!answers[currentQuestion.id]) {
      alert('Silakan pilih jawaban terlebih dahulu')
      return
    }

    try {
      const response = await api.submitAnswer({
        question_id: currentQuestion.id,
        answer: answers[currentQuestion.id],
      })

      setSubmitted({ ...submitted, [currentQuestion.id]: response.data })
      if (response.data.is_correct) {
        setScore(score + response.data.points_earned)
      }

      // Check for level up
      if (response.data.level_up) {
        setLevelUp(true)
        setNewLevel(response.data.new_level)
        // Load achievements to check for new ones
        try {
          const achievementsResponse = await api.getMyAchievements()
          setNewAchievements(achievementsResponse.data)
        } catch (err) {
          console.error('Error loading achievements:', err)
        }
      }
    } catch (error) {
      console.error('Error submitting answer:', error)
      alert('Terjadi kesalahan saat mengirim jawaban')
    }
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setShowResults(true)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="text-xl">Memuat pertanyaan...</div>
        </div>
      </Layout>
    )
  }

  if (questions.length === 0) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">
            Belum ada pertanyaan untuk mata pelajaran ini
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </Layout>
    )
  }

  if (showResults) {
    const totalPoints = Object.values(submitted).reduce(
      (sum, sub) => sum + sub.points_earned,
      0
    )
    const correctCount = Object.values(submitted).filter(
      (sub) => sub.is_correct
    ).length

    return (
      <Layout>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="text-6xl mb-4"
          >
            🎉
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Kuis Selesai!
          </h2>
          <div className="space-y-4 mb-6">
            <div className="text-2xl">
              <span className="font-semibold">Skor: </span>
              <span className="text-blue-600 font-bold">{totalPoints}</span>
            </div>
            <div className="text-xl">
              <span className="font-semibold">Benar: </span>
              <span className="text-green-600">
                {correctCount} / {questions.length}
              </span>
            </div>
            <div className="text-xl">
              <span className="font-semibold">Akurasi: </span>
              <span className="text-purple-600">
                {((correctCount / questions.length) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Kembali ke Dashboard
            </button>
            <button
              onClick={() => navigate('/progress')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              Lihat Progress
            </button>
          </div>
        </motion.div>
      </Layout>
    )
  }

  const currentQuestion = questions[currentIndex]
  const isSubmitted = submitted[currentQuestion.id]

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Pertanyaan {currentIndex + 1} dari {questions.length}
            </span>
            <span className="text-sm font-medium text-gray-700">
              Skor: {score}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
              className="bg-blue-600 h-2 rounded-full"
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white rounded-xl shadow-lg p-8 mb-6"
          >
            <div className="mb-6">
              <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                {currentQuestion.question_type === 'multiple_choice'
                  ? 'Pilihan Ganda'
                  : currentQuestion.question_type === 'drag_drop'
                  ? 'Drag & Drop'
                  : currentQuestion.question_type === 'true_false'
                  ? 'Benar/Salah'
                  : 'Isian'}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {currentQuestion.question_text}
              </h2>
            </div>

            {currentQuestion.question_type === 'multiple_choice' && (
              <MultipleChoiceQuestion
                question={currentQuestion}
                answer={answers[currentQuestion.id]}
                onAnswer={(answer) => handleAnswer(currentQuestion.id, answer)}
                submitted={isSubmitted}
              />
            )}

            {currentQuestion.question_type === 'drag_drop' && (
              <DragDropQuestion
                question={currentQuestion}
                answer={answers[currentQuestion.id]}
                onAnswer={(answer) => handleAnswer(currentQuestion.id, answer)}
                submitted={isSubmitted}
              />
            )}

            {currentQuestion.question_type === 'fill_blank' && (
              <FillBlankQuestion
                question={currentQuestion}
                answer={answers[currentQuestion.id]}
                onAnswer={(answer) => handleAnswer(currentQuestion.id, answer)}
                submitted={isSubmitted}
              />
            )}

            {currentQuestion.question_type === 'true_false' && (
              <TrueFalseQuestion
                question={currentQuestion}
                answer={answers[currentQuestion.id]}
                onAnswer={(answer) => handleAnswer(currentQuestion.id, answer)}
                submitted={isSubmitted}
              />
            )}

            {isSubmitted && currentQuestion.explanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-4 rounded-lg ${
                  isSubmitted.is_correct
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                <p className="font-semibold mb-2">
                  {isSubmitted.is_correct ? '✓ Benar!' : '✗ Salah'}
                </p>
                <p className="text-gray-700">{currentQuestion.explanation}</p>
              </motion.div>
            )}

            {isSubmitted && currentQuestion.explanation && currentQuestion.question_type === 'true_false' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200"
              >
                <p className="text-gray-700">{currentQuestion.explanation}</p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Level Up Notification */}
        <AnimatePresence>
          {levelUp && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -50 }}
              onClick={() => setLevelUp(false)}
              className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-xl shadow-2xl border-4 border-yellow-300 cursor-pointer"
            >
              <div className="text-center">
                <div className="text-5xl mb-2">🎉</div>
                <div className="text-2xl font-bold mb-1">Level Up!</div>
                <div className="text-xl">Anda sekarang Level {newLevel}!</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sebelumnya
          </button>

          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Kirim Jawaban
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              {currentIndex < questions.length - 1 ? 'Selanjutnya' : 'Selesai'}
            </button>
          )}
        </div>
      </div>
    </Layout>
  )
}

