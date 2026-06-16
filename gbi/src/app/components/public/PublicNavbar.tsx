import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import gbiLogo from '../../../imports/pngegg__1_-1.png';

const navLinks = [
  { to: '/jemaat', label: 'Beranda' },
  { to: '/tentang', label: 'Tentang' },
  { to: '/galeri', label: 'Galeri' },
  { to: '/lokasi', label: 'Lokasi' },
];

export default function PublicNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    setScrolled(window.scrollY > 40);
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const isHome = location.pathname === '/jemaat' || location.pathname === '/';
  const solid = scrolled || !isHome;

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${solid ? 'bg-white shadow-md' : 'bg-transparent'}`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/jemaat" className="flex items-center gap-3 group flex-shrink-0">
          <div className={`w-10 h-10 rounded-full overflow-hidden shadow-md transition-all ${solid ? 'ring-2 ring-blue-100' : ''}`}>
            <img src={gbiLogo} alt="GBI Logo" className="w-full h-full object-cover" />
          </div>
          <div className="leading-tight">
            <span className={`block text-sm font-bold transition-colors ${solid ? 'text-gray-900' : 'text-white'}`}>GBI Jelambar Timur</span>
            <span className={`block text-xs transition-colors ${solid ? 'text-blue-600' : 'text-blue-200'}`}>Jakarta Barat</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  active
                    ? solid ? 'bg-blue-50 text-blue-700' : 'bg-white/20 text-white'
                    : solid ? 'text-gray-600 hover:text-blue-700 hover:bg-blue-50' : 'text-white/85 hover:text-white hover:bg-white/15'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-2 md:gap-3">
          <Link
            to="/lokasi"
            className={`hidden md:inline-flex items-center gap-1.5 text-sm font-semibold px-5 py-2 rounded-full transition-all duration-200 ${
              solid
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                : 'bg-white/20 text-white hover:bg-white/30 border border-white/30 backdrop-blur-sm'
            }`}
          >
            Hubungi Kami
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden p-2 rounded-xl transition-colors ${solid ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/15'}`}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="md:hidden bg-white border-t border-gray-100 shadow-xl px-4 py-3"
          >
            {navLinks.map(link => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center px-4 py-3 rounded-xl font-medium transition-colors ${
                    active ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link to="/lokasi" className="flex items-center justify-center mt-2 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm">
              Hubungi Kami
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
