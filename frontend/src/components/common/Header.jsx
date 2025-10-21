import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, LogOut } from 'lucide-react';
const logo = '/image.png';
const Header = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };
  const preAuthNavItems = [
    { to: '/about', label: 'About' },
    { to: '/support', label: 'Support' },
    { to: '/contact', label: 'Contact' }
  ];
  const postAuthNavItems = [
    { to: '/', label: 'Home' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/events', label: 'Events' },
    { to: '/networking', label: 'Networking' },
    { to: '/resources', label: 'Resources' },
    { to: '/profile', label: 'Profile' }
  ];
  const currentNavItems = user ? postAuthNavItems : preAuthNavItems;
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-gradient-to-r from-[#0b0f1a] to-[#0e1424] border-b border-white/10 transition-all duration-300 ${isScrolled ? 'shadow-2xl shadow-black/50' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 hover:scale-105 transition-transform duration-300">
            <img src={logo} alt="Campus Connect" className="h-10 w-auto rounded-xl" />
            <span className="text-xl font-bold bg-gradient-to-r from-[#6B9FFF] to-[#7F40FF] bg-clip-text text-transparent">
              Campus Connect
            </span>
          </Link>
          <nav className="hidden md:flex space-x-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={user ? 'authenticated' : 'unauthenticated'}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="flex space-x-8"
              >
                {currentNavItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="uppercase text-sm text-[#d7d9f7] hover:text-white transition-all duration-300 relative group animate-shimmer"
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#ff8ad8] to-[#5e8bff] transition-all duration-300 group-hover:w-full group-hover:shadow-[0_0_10px_rgba(107,159,255,0.5)]"></span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#ff8ad8]/10 to-[#5e8bff]/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  </Link>
                ))}
              </motion.div>
            </AnimatePresence>
          </nav>
          <div className="flex items-center space-x-4">
            <AnimatePresence mode="wait">
              {user ? (
                <motion.div
                  key="user-info"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center space-x-3"
                >
                  <span className="text-[#d7d9f7] font-semibold hover:text-shadow-[0_0_6px_#6e8fff] transition-all duration-300">
                    {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-full text-[#d7d9f7] hover:bg-gradient-to-r hover:from-indigo-500 hover:to-pink-500 hover:scale-105 transition-all duration-300 hover:shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="auth-buttons"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center space-x-4"
                >
                  <Link
                    to="/login"
                    className="text-[#d7d9f7] hover:text-white transition-all duration-300 hover:shadow-[0_0_15px_rgba(107,159,255,0.3)] animate-shimmer"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-6 py-2 rounded-full font-medium bg-gradient-to-r from-[#ff8ad8] to-[#5e8bff] text-white border border-transparent hover:border-white/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,138,216,0.3)] animate-shimmer"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-full text-[#d7d9f7] hover:text-white transition-all duration-300 hover:bg-white/10"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="md:hidden absolute top-full left-0 right-0 bg-gradient-to-b from-[#0b0f1a] to-[#0e1424] backdrop-blur-md border-b border-white/10 shadow-2xl"
          >
            <nav className="px-6 py-6 space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={user ? 'authenticated-mobile' : 'unauthenticated-mobile'}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {currentNavItems.map((item, index) => (
                    <motion.div
                      key={item.to}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                    >
                      <Link
                        to={item.to}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block uppercase text-sm text-[#d7d9f7] hover:text-white transition-all duration-300 py-2 hover:translate-x-2 hover:bg-white/10 rounded-lg px-3"
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                  {user && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: currentNavItems.length * 0.1, duration: 0.4 }}
                      className="border-t border-white/10 pt-4 mt-4"
                    >
                      <div className="flex items-center justify-between px-3 py-2 mb-3">
                        <span className="text-[#d7d9f7] font-semibold">
                          {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                        </span>
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsMobileMenuOpen(false);
                          }}
                          className="p-2 rounded-full text-[#d7d9f7] hover:bg-gradient-to-r hover:from-indigo-500 hover:to-pink-500 hover:scale-105 transition-all duration-300"
                          title="Logout"
                        >
                          <LogOut size={20} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
export default Header;
