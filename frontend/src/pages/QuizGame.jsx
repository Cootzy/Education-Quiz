// frontend/src/pages/QuizGame.jsx
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { api } from '../services/api'
import { motion, AnimatePresence } from 'framer-motion'
import MultipleChoiceQuestion from '../components/quiz/MultipleChoiceQuestion'
import DragDropQuestion from '../components/quiz/DragDropQuestion'
import FillBlankQuestion from '../components/quiz/FillBlankQuestion'
import TrueFalseQuestion from '../components/quiz/TrueFalseQuestion'
import { Award, Flame } from 'lucide-react'

const QUESTION_TIME = 30 // Waktu per soal (detik)

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
  
  const [timer, setTimer] = useState(QUESTION_TIME)
  const [combo, setCombo] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [pointsPopup, setPointsPopup] = useState({ show: false, points: 0 })

  // --- AUDIO SFX (YANG UDAH ADA) ---
  const correctSound = useMemo(() => new Audio('/sounds/correct.mp3'), [])
  const wrongSound = useMemo(() => new Audio('/sounds/wrong.mp3'), [])
  const clickSound = useMemo(() => new Audio('/sounds/click.mp3'), [])

  // --- AUDIO SFX BARU (BGM & KEMENANGAN) ---
  const completeSound = useMemo(() => new Audio('/sounds/complete.mp3'), [])
  const bgmSound = useMemo(() => {
    const audio = new Audio('/sounds/bgm.mp3');
    audio.loop = true;
    audio.volume = 0.5; // BGM harus pelan
    return audio;
  }, []);
  // --- END ---

  useEffect(() => {
    loadQuestions()
  }, [subjectId])

  useEffect(() => {
    setTimer(QUESTION_TIME) 
  }, [currentIndex])

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setShowResults(true)
    }
  }, [currentIndex, questions.length])

  useEffect(() => {
    if (loading || questions.length === 0 || showResults) return

    const currentQuestion = questions[currentIndex]
    if (!currentQuestion) return 
    
    const isSubmitted = submitted[currentQuestion.id]

    if (isSubmitted) return
    
    if (timer <= 0) {
      handleNext()
      return
    }

    const interval = setInterval(() => {
      setTimer((t) => t - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [timer, submitted, showResults, loading, currentIndex, questions, handleNext])

  // --- useEffect BARU: Mainkan BGM ---
  useEffect(() => {
    if (!loading && questions.length > 0 && !showResults) {
      bgmSound.play().catch(e => {
        console.warn("BGM butuh interaksi user buat main.", e)
      });
    }
    
    // Cleanup: stop BGM kalo kuis selesai atau pindah halaman
    return () => {
      bgmSound.pause();
      bgmSound.currentTime = 0;
    };
  }, [loading, questions.length, showResults, bgmSound]);

  // --- useEffect BARU: Mainkan Suara Kemenangan ---
  useEffect(() => {
    if (showResults) {
      completeSound.play().catch(e => console.error("Error playing complete sound", e));
    }
  }, [showResults, completeSound]);
  // --- END ---

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
    clickSound.play().catch(e => console.error("Error playing sound", e)) 
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
        const points = response.data.points_earned
        setScore(score + points)
        setCombo(c => c + 1)
        setFeedback('correct')
        correctSound.play().catch(e => console.error("Error playing sound", e))
        setPointsPopup({ show: true, points: points })
      } else {
        setCombo(0)
        setFeedback('wrong')
        wrongSound.play().catch(e => console.error("Error playing sound", e))
      }
      
      setTimeout(() => setFeedback(null), 500)
      setTimeout(() => setPointsPopup({ show: false, points: 0 }), 1500)

      if (response.data.level_up) {
        setLevelUp(true)
        setNewLevel(response.data.new_level)
      }
    } catch (error) {
      console.error('Error submitting answer:', error)
      alert('Terjadi kesalahan saat mengirim jawaban')
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
          <div className="text-xl text-gray-700 animate-pulse">Memuat pertanyaan...</div>
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
      (sum, sub) => sum + (sub.points_earned || 0),
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
            Misi Selesai!
          </h2>
          <div className="space-y-4 mb-6">
            <div className="text-2xl">
              <span className="font-semibold">Skor Akhir: </span>
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
                {questions.length > 0 ? ((correctCount / questions.length) * 100).toFixed(1) : 0}%
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
  const timerPercentage = (timer / QUESTION_TIME) * 100

  return (
    <Layout>
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-50 pointer-events-none ${
              feedback === 'correct' ? 'bg-green-500/30' : 'bg-red-500/30'
            }`}
          />
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Pertanyaan {currentIndex + 1} dari {questions.length}
            </span>
            <div className="flex space-x-4">
              <span className="flex items-center text-sm font-medium text-yellow-600">
                <Flame size={16} className="mr-1" /> Combo: {combo}x
              </span>
              <span className="flex items-center text-sm font-medium text-blue-600">
                <Award size={16} className="mr-1" /> Skor: {score}
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <motion.div
              animate={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
              className="bg-blue-600 h-2 rounded-full"
            />
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 border border-gray-300">
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: `${timerPercentage}%` }}
              transition={{ duration: 1, ease: 'linear' }}
              className={`h-full rounded-full ${
                timerPercentage > 50 ? 'bg-green-500' : timerPercentage > 20 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white rounded-xl shadow-lg p-8 mb-6 relative"
          >
            
            <AnimatePresence>
              {pointsPopup.show && (
                <motion.div
                  initial={{ opacity: 1, y: 0, scale: 1 }}
                  animate={{ opacity: 0, y: -100, scale: 1.5 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5 }}
                  className="absolute top-4 right-8 text-2xl font-bold text-green-500"
                >
                  +{pointsPopup.points}
                </motion.div>
              )}
            </AnimatePresence>

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

          </motion.div>
        </AnimatePresence>

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

        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0 || isSubmitted}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sebelumnya
          </button>

          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={!answers[currentQuestion.id]}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
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