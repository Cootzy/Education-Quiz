// frontend/src/components/Layout.jsx
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useEffect, useMemo, useState } from 'react' // TAMBAH useState
import { motion, AnimatePresence } from 'framer-motion' // TAMBAH framer-motion
import { Menu, X } from 'lucide-react' // TAMBAH icon Menu & X

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // --- STATE BARU UNTUK MENU MOBILE ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const globalClickSound = useMemo(() => {
    const audio = new Audio('/sounds/click-global.mp3');
    audio.volume = 0.4;
    return audio;
  }, []);

  useEffect(() => {
    const playSound = (e) => {
      const target = e.target
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('button') ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        globalClickSound.currentTime = 0 
        globalClickSound.play().catch(err => console.error("Error playing global click", err));
      }
    };
    document.addEventListener('click', playSound);
    return () => {
      document.removeEventListener('click', playSound);
    };
  }, [globalClickSound]);

  const handleLogout = () => {
    logout()
    navigate('/login')
    setIsMobileMenuOpen(false) // Tutup menu pas logout
  }
  
  const handleNav = (path) => {
    navigate(path)
    setIsMobileMenuOpen(false) // Tutup menu pas pindah halaman
  }

  const logoLink = user ? (user.is_admin ? '/admin' : '/dashboard') : '/login'

  // --- KITA BIKIN KOMPONEN MENU BIAR GAK DUPLIKAT KODE ---
  const MenuLinks = ({ isMobile = false }) => (
    <>
      <span className={`font-medium ${isMobile ? "text-gray-800 px-3 py-2" : "text-gray-700"}`}>
        Halo, {user.full_name}
      </span>
      {user.is_admin ? (
        <>
          <Link
            to="/admin/questions"
            onClick={() => isMobile && setIsMobileMenuOpen(false)}
            className={`transition ${isMobile ? "text-gray-800 block px-3 py-2 rounded-md hover:bg-gray-100" : "text-gray-700 hover:text-blue-600"}`}
          >
            Kelola Pertanyaan
          </Link>
          <Link
            to="/admin/subjects"
            onClick={() => isMobile && setIsMobileMenuOpen(false)}
            className={`transition ${isMobile ? "text-gray-800 block px-3 py-2 rounded-md hover:bg-gray-100" : "text-gray-700 hover:text-blue-600"}`}
          >
            Kelola Mata Pelajaran
          </Link>
          <Link
            to="/admin/scores"
            onClick={() => isMobile && setIsMobileMenuOpen(false)}
            className={`transition ${isMobile ? "text-gray-800 block px-3 py-2 rounded-md hover:bg-gray-100" : "text-gray-700 hover:text-blue-600"}`}
          >
            Lihat Skor
          </Link>
        </>
      ) : (
        <>
          <Link
            to="/dashboard"
            onClick={() => isMobile && setIsMobileMenuOpen(false)}
            className={`transition ${isMobile ? "text-gray-800 block px-3 py-2 rounded-md hover:bg-gray-100" : "text-gray-700 hover:text-blue-600"}`}
          >
            Dashboard
          </Link>
          <Link
            to="/progress"
            onClick={() => isMobile && setIsMobileMenuOpen(false)}
            className={`transition ${isMobile ? "text-gray-800 block px-3 py-2 rounded-md hover:bg-gray-100" : "text-gray-700 hover:text-blue-600"}`}
          >
            Progress
          </Link>
        </>
      )}
      <button
        onClick={handleLogout}
        className={`transition ${isMobile ? "bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 w-full text-left" : "bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"}`}
      >
        Keluar
      </button>
    </>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar dibikin 'sticky' biar nempel di atas pas scroll */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* --- INI DIV BARU: RAPIH & SELALU HORIZONTAL --- */}
          <div className="flex justify-between items-center h-16">
            
            {/* 1. Logo (Selalu Keliatan) */}
            <div className="flex items-center">
              <Link to={logoLink} className="text-xl font-bold text-blue-600 hover:text-blue-700">
                YASMIN EduGame
              </Link>
              {/* Nama sekolah tetep ada di desktop/tablet */}
              <span className="ml-2 text-sm text-gray-500 hidden sm:inline">
                | SMA Mutiara Insan Nusantara
              </span>
            </div>

            {/* 2. Menu Desktop (Sembunyi di HP) */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              {user && <MenuLinks isMobile={false} />}
            </div>

            {/* 3. Tombol Hamburger (Cuma Muncul di HP) */}
            <div className="md:hidden flex items-center">
              {user && (
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-gray-700 p-2 rounded-md hover:bg-gray-100"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              )}
            </div>

          </div>
        </div>

        {/* --- MENU DROPDOWN MOBILE (Pake Framer Motion) --- */}
        <AnimatePresence>
          {isMobileMenuOpen && user && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white shadow-inner overflow-hidden"
            >
              <div className="flex flex-col space-y-2 p-4">
                <MenuLinks isMobile={true} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Konten Halaman (Gak Diubah) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}