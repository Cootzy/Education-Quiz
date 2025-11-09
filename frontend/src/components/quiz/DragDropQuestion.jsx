import { useState, useEffect } from 'react'
import { motion, Reorder } from 'framer-motion'

export default function DragDropQuestion({
  question,
  answer,
  onAnswer,
  submitted,
}) {
  const options = question.options || []
  const [items, setItems] = useState(
    answer?.order || [...Array(options.length).keys()]
  )

  useEffect(() => {
    if (answer?.order) {
      setItems(answer.order)
    }
  }, [answer])

  const handleReorder = (newOrder) => {
    if (!submitted) {
      setItems(newOrder)
      onAnswer({ order: newOrder })
    }
  }

  const correctOrder = question.correct_answer?.order || []
  const isCorrect = JSON.stringify(items) === JSON.stringify(correctOrder)

  return (
    <div className="space-y-4">
      <p className="text-gray-600 mb-4">
        Urutkan item di bawah ini dengan cara drag dan drop:
      </p>

      <Reorder.Group
        axis="y"
        values={items}
        onReorder={handleReorder}
        className="space-y-2"
      >
        {items.map((index) => {
          const option = options[index]
          const correctPosition = correctOrder.indexOf(index)
          const currentPosition = items.indexOf(index)
          const showResult = submitted && correctPosition === currentPosition

          return (
            <Reorder.Item
              key={index}
              value={index}
              drag={!submitted}
              className={`p-4 rounded-lg border-2 ${
                submitted
                  ? showResult
                    ? 'bg-green-100 border-green-500'
                    : 'bg-red-100 border-red-500'
                  : 'bg-white border-gray-300 cursor-move hover:border-blue-300'
              }`}
            >
              <motion.div
                whileHover={!submitted ? { scale: 1.02 } : {}}
                className="flex items-center"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3 font-semibold">
                  {currentPosition + 1}
                </div>
                <span className="text-gray-800 flex-1">{option}</span>
                {submitted && showResult && (
                  <span className="text-green-600 font-semibold">✓</span>
                )}
                {!submitted && (
                  <span className="text-gray-400 ml-2">☰</span>
                )}
              </motion.div>
            </Reorder.Item>
          )
        })}
      </Reorder.Group>

      {submitted && (
        <div
          className={`p-4 rounded-lg ${
            isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}
        >
          <p className="font-semibold">
            {isCorrect
              ? '✓ Urutan benar!'
              : '✗ Urutan salah. Urutan yang benar adalah:'}
          </p>
          {!isCorrect && (
            <ol className="list-decimal list-inside mt-2 space-y-1">
              {correctOrder.map((index, pos) => (
                <li key={index}>{options[index]}</li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  )
}

