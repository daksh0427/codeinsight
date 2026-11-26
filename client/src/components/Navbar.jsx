import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Code2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = ({ transparent = false }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [visible, setVisible] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      if (currentY > lastScrollY && currentY > 200) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      setLastScrollY(currentY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMobileOpen(false);
    }
  };

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: visible ? 0 : -100 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !transparent
          ? 'glass border-b border-white/5 shadow-lg shadow-black/10'
          : 'bg-transparent'
      }`}
      id="main-navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" id="navbar-logo">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-purple-500/20 transition-shadow">
              <Code2 size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">CodeInsight AI</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {location.pathname === '/' && (
              <>
                <button
                  onClick={() => scrollToSection('features')}
                  className="text-sm text-dark-200 hover:text-white transition-colors"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-sm text-dark-200 hover:text-white transition-colors"
                >
                  How It Works
                </button>
              </>
            )}

            {isAuthenticated ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-primary text-sm py-2 px-5"
              >
                Dashboard
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/login')}
                  className="btn-ghost text-sm py-2 px-5"
                  id="navbar-login"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="btn-primary text-sm py-2 px-5"
                  id="navbar-get-started"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-dark-200 hover:text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/5"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {location.pathname === '/' && (
                <>
                  <button onClick={() => scrollToSection('features')} className="text-sm text-dark-200 hover:text-white text-left py-2">Features</button>
                  <button onClick={() => scrollToSection('how-it-works')} className="text-sm text-dark-200 hover:text-white text-left py-2">How It Works</button>
                </>
              )}
              {isAuthenticated ? (
                <button onClick={() => { navigate('/dashboard'); setMobileOpen(false); }} className="btn-primary text-sm py-2">Dashboard</button>
              ) : (
                <>
                  <button onClick={() => { navigate('/login'); setMobileOpen(false); }} className="btn-ghost text-sm py-2">Login</button>
                  <button onClick={() => { navigate('/register'); setMobileOpen(false); }} className="btn-primary text-sm py-2">Get Started</button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
