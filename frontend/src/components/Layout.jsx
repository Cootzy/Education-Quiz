import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const globalClickSound = useMemo(() => {
    const audio = new Audio('/sounds/click-global.mp3');
    audio.volume = 0.4;
    return audio;
  }, []);

  useEffect(() => {
    const playSound = (e) => {
      const target = e.target;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('button') ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        globalClickSound.currentTime = 0;
        globalClickSound
          .play()
          .catch((err) => console.error('Error playing global click', err));
      }
    };
    document.addEventListener('click', playSound);
    return () => {
      document.removeEventListener('click', playSound);
    };
  }, [globalClickSound]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const handleNav = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const logoLink = user ? (user.is_admin ? '/admin' : '/dashboard') : '/login';

  const MenuLinks = ({ isMobile = false }) => (
    <>
      <span
        className={`font-medium ${
          isMobile ? 'text-gray-800 px-3 py-2' : 'text-gray-700'
        }`}
      >
        Halo, {user.full_name}
      </span>
      {user.is_admin ? (
        <>
          <Link
            to="/admin/questions"
            onClick={() => isMobile && setIsMobileMenuOpen(false)}
            className={`transition ${
              isMobile
                ? 'text-gray-800 block px-3 py-2 rounded-md hover:bg-gray-100'
                : 'text-gray-700 hover:text-blue-600'
            }`}
          >
            Kelola Pertanyaan
          </Link>
          <Link
            to="/admin/subjects"
            onClick={() => isMobile && setIsMobileMenuOpen(false)}
            className={`transition ${
              isMobile
                ? 'text-gray-800 block px-3 py-2 rounded-md hover:bg-gray-100'
                : 'text-gray-700 hover:text-blue-600'
            }`}
          >
            Kelola Mata Pelajaran
          </Link>
          <Link
            to="/admin/scores"
            onClick={() => isMobile && setIsMobileMenuOpen(false)}
            className={`transition ${
              isMobile
                ? 'text-gray-800 block px-3 py-2 rounded-md hover:bg-gray-100'
                : 'text-gray-700 hover:text-blue-600'
            }`}
          >
            Lihat Skor
          </Link>
        </>
      ) : (
        <>
          <Link
            to="/dashboard"
            onClick={() => isMobile && setIsMobileMenuOpen(false)}
            className={`transition ${
              isMobile
                ? 'text-gray-800 block px-3 py-2 rounded-md hover:bg-gray-100'
                : 'text-gray-700 hover:text-blue-600'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/progress"
            onClick={() => isMobile && setIsMobileMenuOpen(false)}
            className={`transition ${
              isMobile
                ? 'text-gray-800 block px-3 py-2 rounded-md hover:bg-gray-100'
                : 'text-gray-700 hover:text-blue-600'
            }`}
          >
            Progress
          </Link>
        </>
      )}
      <button
        onClick={handleLogout}
        className={`transition ${
          isMobile
            ? 'bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 w-full text-left'
            : 'bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600'
        }`}
      >
        Keluar
      </button>
    </>
  );

  return (
    // Container luar untuk positioning
    <div className="relative min-h-screen">
      {/*background gambar*/}
      <div className="absolute inset-0 bg-game-pattern bg-cover bg-fixed z-0"></div>

      {/*Overlay putih*/}
      <div className="absolute inset-0 bg-white opacity-90 z-10"></div>

      {/* notes */}
      <div className="relative z-20 min-h-screen">
        <nav className="bg-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link
                  to={logoLink}
                  className="text-xl font-bold text-blue-600 hover:text-blue-700"
                >
                  YASMIN EduGame {/* Update ko */}
                </Link>
                <span className="ml-2 text-sm text-gray-500 hidden sm:inline">
                  | SMA Mutiara Insan Nusantara
                </span>
              </div>

              <div className="hidden md:flex md:items-center md:space-x-4">
                {user && <MenuLinks isMobile={false} />}
              </div>

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

        {/* Strukturnya main */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
