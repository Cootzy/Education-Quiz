import axios from 'axios'

const API_BASE_URL = '/api'

export const api = {
  // Auth
  login: (username, password) => {
    const formData = new FormData()
    formData.append('username', username)
    formData.append('password', password)
    return axios.post(`${API_BASE_URL}/auth/login`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  register: (data) => axios.post(`${API_BASE_URL}/auth/register`, data),

  // Subjects (for students)
  getSubjects: () => axios.get(`${API_BASE_URL}/quizzes/subjects`),

  // Questions
  getQuestions: (subjectId) =>
    axios.get(`${API_BASE_URL}/questions/`, { params: { subject_id: subjectId } }),

  getQuestionsBySubject: (subjectId) =>
    axios.get(`${API_BASE_URL}/quizzes/subjects/${subjectId}/questions`),

  createQuestion: (data) => axios.post(`${API_BASE_URL}/questions/`, data),

  updateQuestion: (id, data) => axios.put(`${API_BASE_URL}/questions/${id}`, data),

  deleteQuestion: (id) => axios.delete(`${API_BASE_URL}/questions/${id}`),

  // Quiz
  submitAnswer: (data) => axios.post(`${API_BASE_URL}/quizzes/submit`, data),

  getSubmissions: () => axios.get(`${API_BASE_URL}/quizzes/submissions`),

  // Progress
  getProgress: () => axios.get(`${API_BASE_URL}/students/progress`),

  // Admin
  getStudents: () => axios.get(`${API_BASE_URL}/admin/students`),

  getScores: () => axios.get(`${API_BASE_URL}/admin/scores`),

  // Admin Subjects
  getAdminSubjects: () => axios.get(`${API_BASE_URL}/admin/subjects`),

  getAdminSubject: (id) => axios.get(`${API_BASE_URL}/admin/subjects/${id}`),

  createSubject: (data) => axios.post(`${API_BASE_URL}/admin/subjects`, data),

  updateSubject: (id, data) => axios.put(`${API_BASE_URL}/admin/subjects/${id}`, data),

  deleteSubject: (id) => axios.delete(`${API_BASE_URL}/admin/subjects/${id}`),

  createFeedback: (data) => axios.post(`${API_BASE_URL}/admin/feedback`, data),

  getFeedback: () => axios.get(`${API_BASE_URL}/students/feedback`),

  // Level and Achievements
  getMyLevel: () => axios.get(`${API_BASE_URL}/students/level`),
  getMyAchievements: () => axios.get(`${API_BASE_URL}/students/achievements`),
  getAvailableAchievements: () => axios.get(`${API_BASE_URL}/students/achievements/available`),
}

