import { motion } from 'framer-motion'

export default function MultipleChoiceQuestion({
  question,
  answer,
  onAnswer,
  submitted,
}) {
  const options = question.options || []
  const selectedAnswer = answer?.selected

  const handleSelect = (optionIndex) => {
    if (!submitted) {
      onAnswer({ selected: optionIndex })
    }
  }

  return (
    <div className="space-y-3">
      {options.map((option, index) => {
        const isSelected = selectedAnswer === index
        const isCorrect = question.correct_answer?.selected === index
        const showResult = submitted && isCorrect

        return (
          <motion.button
            key={index}
            whileHover={!submitted ? { scale: 1.02 } : {}}
            whileTap={!submitted ? { scale: 0.98 } : {}}
            onClick={() => handleSelect(index)}
            disabled={!!submitted}
            className={`w-full text-left p-4 rounded-lg border-2 transition ${
              submitted
                ? showResult
                  ? 'bg-green-100 border-green-500'
                  : isSelected && !isCorrect
                  ? 'bg-red-100 border-red-500'
                  : 'bg-gray-50 border-gray-300'
                : isSelected
                ? 'bg-blue-100 border-blue-500'
                : 'bg-white border-gray-300 hover:border-blue-300'
            } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
          >
            <div className="flex items-center">
              <div
                className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                  isSelected
                    ? submitted
                      ? showResult
                        ? 'bg-green-500 border-green-500'
                        : 'bg-red-500 border-red-500'
                      : 'bg-blue-500 border-blue-500'
                    : 'border-gray-400'
                }`}
              >
                {isSelected && (
                  <span className="text-white text-xs font-bold">✓</span>
                )}
              </div>
              <span className="text-gray-800">{option}</span>
              {submitted && showResult && (
                <span className="ml-auto text-green-600 font-semibold">
                  ✓ Benar
                </span>
              )}
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}

