import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function TrueFalseQuestion({
  question,
  answer,
  onAnswer,
  submitted,
}) {
  const [selectedAnswer, setSelectedAnswer] = useState(answer?.answer)
  const correctAnswer = question.correct_answer?.answer

  useEffect(() => {
    if (answer?.answer !== undefined) {
      setSelectedAnswer(answer.answer)
    }
  }, [answer])

  const handleSelect = (value) => {
    if (!submitted) {
      setSelectedAnswer(value)
      onAnswer({ answer: value })
    }
  }

  const isCorrect = selectedAnswer === correctAnswer
  const showResult = submitted && isCorrect
  const showWrong = submitted && selectedAnswer !== correctAnswer && selectedAnswer !== undefined

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <motion.button
          whileHover={!submitted ? { scale: 1.05 } : {}}
          whileTap={!submitted ? { scale: 0.95 } : {}}
          onClick={() => handleSelect(true)}
          disabled={!!submitted}
          className={`
            p-8 rounded-xl border-4 transition-all font-bold text-2xl
            ${submitted
              ? showResult && selectedAnswer === true
                ? 'bg-green-500 border-green-600 text-white'
                : showWrong && selectedAnswer === true
                ? 'bg-red-500 border-red-600 text-white'
                : 'bg-gray-200 border-gray-300 text-gray-500'
              : selectedAnswer === true
              ? 'bg-blue-500 border-blue-600 text-white shadow-lg'
              : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400 hover:shadow-md'
            }
            ${submitted ? 'cursor-default' : 'cursor-pointer'}
          `}
        >
          ✓ Benar
        </motion.button>

        <motion.button
          whileHover={!submitted ? { scale: 1.05 } : {}}
          whileTap={!submitted ? { scale: 0.95 } : {}}
          onClick={() => handleSelect(false)}
          disabled={!!submitted}
          className={`
            p-8 rounded-xl border-4 transition-all font-bold text-2xl
            ${submitted
              ? showResult && selectedAnswer === false
                ? 'bg-green-500 border-green-600 text-white'
                : showWrong && selectedAnswer === false
                ? 'bg-red-500 border-red-600 text-white'
                : 'bg-gray-200 border-gray-300 text-gray-500'
              : selectedAnswer === false
              ? 'bg-blue-500 border-blue-600 text-white shadow-lg'
              : 'bg-white border-gray-300 text-gray-700 hover:border-red-400 hover:shadow-md'
            }
            ${submitted ? 'cursor-default' : 'cursor-pointer'}
          `}
        >
          ✗ Salah
        </motion.button>
      </div>

      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg ${
            isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}
        >
          <p className="font-semibold text-lg mb-2">
            {isCorrect ? '✓ Jawaban Anda Benar!' : '✗ Jawaban Anda Salah'}
          </p>
          <p className="text-gray-700">
            Jawaban yang benar adalah: <strong>{correctAnswer ? 'Benar' : 'Salah'}</strong>
          </p>
        </motion.div>
      )}
    </div>
  )
}

