import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { motion } from 'framer-motion'

export default function AdminDashboard() {
  const features = [
    {
      title: 'Kelola Pertanyaan',
      description: 'Buat, edit, dan hapus pertanyaan kuis',
      link: '/admin/questions',
      icon: '📝',
      color: 'blue',
    },
    {
      title: 'Lihat Skor Siswa',
      description: 'Lihat semua skor dan progress siswa',
      link: '/admin/scores',
      icon: '📊',
      color: 'green',
    },
    {
      title: 'Kelola Mata Pelajaran',
      description: 'Tambah dan kelola mata pelajaran',
      link: '/admin/subjects',
      icon: '📚',
      color: 'purple',
    },
  ]

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Dashboard Admin
        </h1>
        <p className="text-gray-600">
          Kelola platform kuis edukatif dari sini
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to={feature.link}>
              <div className="bg-white rounded-xl shadow-lg p-6 h-full cursor-pointer hover:shadow-xl transition">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {feature.title}
                </h2>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </Layout>
  )
}

