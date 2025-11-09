import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import StudentDashboard from './pages/StudentDashboard'
import AdminDashboard from './pages/AdminDashboard'
import QuizGame from './pages/QuizGame'
import Progress from './pages/Progress'
import QuestionManagement from './pages/QuestionManagement'
import ScoresView from './pages/ScoresView'
import SubjectManagement from './pages/SubjectManagement'

function PrivateRoute({ children, requireAdmin = false }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Memuat...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && !user.is_admin) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <StudentDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <PrivateRoute requireAdmin={true}>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/quiz/:subjectId"
        element={
          <PrivateRoute>
            <QuizGame />
          </PrivateRoute>
        }
      />
      <Route
        path="/progress"
        element={
          <PrivateRoute>
            <Progress />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/questions"
        element={
          <PrivateRoute requireAdmin={true}>
            <QuestionManagement />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/scores"
        element={
          <PrivateRoute requireAdmin={true}>
            <ScoresView />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/subjects"
        element={
          <PrivateRoute requireAdmin={true}>
            <SubjectManagement />
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}

export default App

