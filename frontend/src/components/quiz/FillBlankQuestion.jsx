import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function FillBlankQuestion({
  question,
  answer,
  onAnswer,
  submitted,
}) {
  const questionText = question.question_text
  const correctFills = question.correct_answer?.fills || {}
  const [fills, setFills] = useState(answer?.fills || {})

  // Extract blanks from question text (format: {blank1}, {blank2}, etc.)
  const blankRegex = /\{(\w+)\}/g
  const blanks = []
  let match
  while ((match = blankRegex.exec(questionText)) !== null) {
    blanks.push(match[1])
  }

  useEffect(() => {
    if (answer?.fills) {
      setFills(answer.fills)
    }
  }, [answer])

  const handleFillChange = (blankKey, value) => {
    if (!submitted) {
      const newFills = { ...fills, [blankKey]: value }
      setFills(newFills)
      onAnswer({ fills: newFills })
    }
  }

  const renderQuestionText = () => {
    let parts = []
    let lastIndex = 0
    let blankIndex = 0

    // Create a new regex instance to avoid state issues
    const regex = /\{(\w+)\}/g
    let match
    while ((match = regex.exec(questionText)) !== null) {
      // Add text before blank
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {questionText.substring(lastIndex, match.index)}
          </span>
        )
      }

      // Add input for blank
      const blankKey = match[1]
      const isCorrect = submitted && fills[blankKey] === correctFills[blankKey]
      const isWrong = submitted && fills[blankKey] !== correctFills[blankKey]

      parts.push(
        <input
          key={`blank-${blankKey}`}
          type="text"
          value={fills[blankKey] || ''}
          onChange={(e) => handleFillChange(blankKey, e.target.value)}
          disabled={!!submitted}
          className={`inline-block mx-2 px-3 py-1 border-2 rounded ${
            submitted
              ? isCorrect
                ? 'bg-green-100 border-green-500'
                : isWrong
                ? 'bg-red-100 border-red-500'
                : 'bg-gray-100 border-gray-300'
              : 'bg-white border-blue-300 focus:border-blue-500 focus:outline-none'
          } min-w-[120px]`}
          placeholder="..."
        />
      )

      lastIndex = match.index + match[0].length
      blankIndex++
    }

    // Add remaining text
    if (lastIndex < questionText.length) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {questionText.substring(lastIndex)}
        </span>
      )
    }

    return parts
  }

  return (
    <div className="space-y-4">
      <div className="text-lg text-gray-800 leading-relaxed">
        {renderQuestionText()}
      </div>

      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-blue-50 border border-blue-200"
        >
          <p className="font-semibold mb-2">Jawaban yang benar:</p>
          <div className="space-y-2">
            {Object.entries(correctFills).map(([key, value]) => (
              <div key={key} className="flex items-center">
                <span className="font-medium text-gray-700 mr-2">
                  {key}:
                </span>
                <span className="text-gray-800">{value}</span>
                {fills[key] === value && (
                  <span className="ml-2 text-green-600 font-semibold">✓</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

