import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { api } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuestionManagement() {
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [formData, setFormData] = useState({
    subject_id: '',
    question_type: 'multiple_choice',
    question_text: '',
    options: ['', '', '', ''],
    correct_answer: { selected: 0 },
    explanation: '',
    points: 10,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [questionsRes, subjectsRes] = await Promise.all([
        api.getQuestions(),
        api.getSubjects(),
      ]);
      setQuestions(questionsRes.data);
      setSubjects(subjectsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (question = null) => {
    if (question) {
      setEditingQuestion(question);
      let initialOptions = ['', '', '', ''];
      let initialCorrectAnswer = question.correct_answer;

      if (question.question_type === 'multiple_choice') {
        initialOptions = question.options || ['', '', '', ''];
        initialCorrectAnswer = question.correct_answer || { selected: 0 };
      } else if (question.question_type === 'drag_drop') {
        initialOptions = question.options || ['', '', '', ''];
        initialCorrectAnswer = question.correct_answer || { order: [] };
      } else if (question.question_type === 'fill_blank') {
        initialOptions = null;
        initialCorrectAnswer = question.correct_answer || { fills: {} };
      } else if (question.question_type === 'true_false') {
        initialOptions = null;
        initialCorrectAnswer = question.correct_answer || { answer: true };
      }

      setFormData({
        subject_id: question.subject_id,
        question_type: question.question_type,
        question_text: question.question_text,
        options: initialOptions,
        correct_answer: initialCorrectAnswer,
        explanation: question.explanation || '',
        points: question.points,
      });
    } else {
      setEditingQuestion(null);
      setFormData({
        subject_id: '',
        question_type: 'multiple_choice',
        question_text: '',
        options: ['', '', '', ''],
        correct_answer: { selected: 0 },
        explanation: '',
        points: 10,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingQuestion(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = {
        ...formData,
        options:
          formData.question_type === 'multiple_choice' ||
          formData.question_type === 'drag_drop'
            ? formData.options
            : null,
      };

      if (editingQuestion) {
        await api.updateQuestion(editingQuestion.id, data);
      } else {
        await api.createQuestion(data);
      }

      await loadData();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving question:', error);
      alert('Terjadi kesalahan saat menyimpan pertanyaan');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pertanyaan ini?')) {
      return;
    }

    try {
      await api.deleteQuestion(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Terjadi kesalahan saat menghapus pertanyaan');
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="text-xl">Memuat pertanyaan...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Kelola Pertanyaan
          </h1>
          <p className="text-gray-600">Buat, edit, dan hapus pertanyaan</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          + Tambah Pertanyaan
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Pertanyaan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tipe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Poin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {questions.map((question) => (
              <tr key={question.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {question.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-md truncate">
                  {question.question_text}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {question.question_type === 'multiple_choice'
                    ? 'Pilihan Ganda'
                    : question.question_type === 'drag_drop'
                    ? 'Drag & Drop'
                    : question.question_type === 'true_false'
                    ? 'Benar/Salah'
                    : 'Isian'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {question.points}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleOpenModal(question)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(question.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {editingQuestion ? 'Edit Pertanyaan' : 'Tambah Pertanyaan'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mata Pelajaran
                  </label>
                  <select
                    value={formData.subject_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subject_id: parseInt(e.target.value),
                      })
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih Mata Pelajaran</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipe Pertanyaan
                  </label>
                  <select
                    value={formData.question_type}
                    onChange={(e) => {
                      const newType = e.target.value;
                      let newFormData = { ...formData, question_type: newType };

                      // Reset correct_answer based on question type
                      if (newType === 'multiple_choice') {
                        newFormData.correct_answer = { selected: 0 };
                        newFormData.options = ['', '', '', ''];
                      } else if (newType === 'drag_drop') {
                        newFormData.correct_answer = { order: [] };
                        newFormData.options = ['', '', '', ''];
                      } else if (newType === 'fill_blank') {
                        newFormData.correct_answer = { fills: {} };
                        newFormData.options = null;
                      } else if (newType === 'true_false') {
                        newFormData.correct_answer = { answer: true };
                        newFormData.options = null;
                      }

                      setFormData(newFormData);
                    }}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="multiple_choice">Pilihan Ganda</option>
                    <option value="drag_drop">Drag & Drop</option>
                    <option value="fill_blank">Isian</option>
                    <option value="true_false">Benar/Salah</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teks Pertanyaan
                  </label>
                  <textarea
                    value={formData.question_text}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        question_text: e.target.value,
                      })
                    }
                    required
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan pertanyaan"
                  />
                </div>

                {formData.question_type === 'multiple_choice' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Opsi Jawaban
                    </label>
                    {formData.options.map((option, index) => (
                      <div key={index} className="mb-2 flex items-center">
                        <input
                          type="radio"
                          name="correct_option"
                          checked={formData.correct_answer.selected === index}
                          onChange={() =>
                            setFormData({
                              ...formData,
                              correct_answer: { selected: index },
                            })
                          }
                          className="mr-2"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(index, e.target.value)
                          }
                          required
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`Opsi ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {formData.question_type === 'drag_drop' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Opsi (pisahkan dengan koma untuk urutan yang benar)
                    </label>
                    <input
                      type="text"
                      value={formData.options.join(', ')}
                      onChange={(e) => {
                        const options = e.target.value
                          .split(',')
                          .map((s) => s.trim());
                        setFormData({
                          ...formData,
                          options: options,
                          correct_answer: {
                            order: [...Array(options.length).keys()],
                          },
                        });
                      }}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Opsi 1, Opsi 2, Opsi 3"
                    />
                  </div>
                )}

                {formData.question_type === 'fill_blank' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jawaban Benar (format JSON:{' '}
                      {"{blank1: 'jawaban1', blank2: 'jawaban2'}"})
                    </label>
                    <textarea
                      value={JSON.stringify(
                        formData.correct_answer.fills || {}
                      )}
                      onChange={(e) => {
                        try {
                          const fills = JSON.parse(e.target.value);
                          setFormData({
                            ...formData,
                            correct_answer: { fills },
                          });
                        } catch (err) {
                          // Invalid JSON, ignore
                        }
                      }}
                      required
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      placeholder='{"blank1": "jawaban1", "blank2": "jawaban2"}'
                    />
                  </div>
                )}

                {formData.question_type === 'true_false' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jawaban Benar
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="true_false_answer"
                          checked={formData.correct_answer.answer === true}
                          onChange={() =>
                            setFormData({
                              ...formData,
                              correct_answer: { answer: true },
                            })
                          }
                          className="mr-2"
                        />
                        <span className="text-lg font-semibold text-green-600">
                          ✓ Benar
                        </span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="true_false_answer"
                          checked={formData.correct_answer.answer === false}
                          onChange={() =>
                            setFormData({
                              ...formData,
                              correct_answer: { answer: false },
                            })
                          }
                          className="mr-2"
                        />
                        <span className="text-lg font-semibold text-red-600">
                          ✗ Salah
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Penjelasan (opsional)
                  </label>
                  <textarea
                    value={formData.explanation}
                    onChange={(e) =>
                      setFormData({ ...formData, explanation: e.target.value })
                    }
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Penjelasan jawaban yang benar"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Poin
                  </label>
                  <input
                    type="number"
                    value={formData.points}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        points: parseInt(e.target.value),
                      })
                    }
                    required
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    {editingQuestion ? 'Update' : 'Simpan'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
