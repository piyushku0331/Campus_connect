import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import { AuthContext } from '../../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useContext(AuthContext);

  const allNavLinks = [
    { name: 'Home', href: '/home' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Events', href: '/events' },
    { name: 'Networking', href: '/networking' },
    { name: 'Resources', href: '/resources' },
    { name: 'Support', href: '/support' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const publicNavLinks = [
    { name: 'Home', href: '/home' },
    { name: 'Support', href: '/support' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const navLinks = user ? allNavLinks : publicNavLinks;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-6xl">
      <div className="glass-card rounded-full p-4 shadow-2xl backdrop-blur-xl bg-white/10 border border-white/20">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/home" className="flex items-center space-x-3 group flex-shrink-0">
            <div className="relative">
              <img src="/image.png" alt="Campus Connect Logo" className="w-8 h-8 rounded-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <span className="text-white font-bold text-lg transition-all duration-300 group-hover:text-primary/90 hidden sm:block">Campus Connect</span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center space-x-8 flex-1 justify-center">
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                to={link.href}
                className={`relative text-white/80 hover:text-white transition-all duration-300 font-medium group px-3 py-2 rounded-lg ${
                  location.pathname === link.href ? 'text-white bg-white/5' : ''
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <span className="relative z-10">{link.name}</span>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-3/4 transition-all duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          {user ? (
            <div className="hidden md:flex items-center space-x-3 flex-shrink-0">
              <button
                onClick={async () => {
                  await signOut();
                  window.location.href = '/home';
                }}
                className="relative glass-effect border border-red-500/30 text-red-400 hover:border-red-500/60 px-5 py-2 rounded-full font-medium hover:bg-red-500/10 transition-all duration-500 overflow-hidden group text-sm"
              >
                <span className="relative z-10">Logout</span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-3 flex-shrink-0">
              <Link
                to="/login"
                className="relative glass-effect border border-primary/30 text-primary hover:border-primary/60 px-5 py-2 rounded-full font-medium hover:bg-primary/10 transition-all duration-500 animate-shimmer overflow-hidden group text-sm"
              >
                <span className="relative z-10">Login</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link
                to="/signup"
                className="relative bg-gradient-to-r from-primary to-secondary text-white font-medium px-5 py-2 rounded-full hover:shadow-cinematic-glow hover:scale-105 transition-all duration-500 overflow-hidden group text-sm"
              >
                <span className="relative z-10">Sign Up</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white hover:text-primary transition-colors duration-300 p-2 flex-shrink-0"
          >
            {isOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden mt-4 pt-4 border-t border-white/20 transition-all duration-500 ease-out ${isOpen ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'}`}>
          <div className="flex flex-col space-y-4">
          {navLinks.map((link, index) => (
            <Link
              key={link.name}
              to={link.href}
              className={`relative text-white/80 hover:text-white transition-all duration-300 font-medium group ${
                location.pathname === link.href ? 'text-white' : ''
              }`}
              onClick={() => setIsOpen(false)}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <span className="relative z-10">{link.name}</span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-300"></div>
            </Link>
          ))}
          {user ? (
            <div className="flex flex-col space-y-3 pt-4 border-t border-white/20">
              <button
                onClick={async () => {
                  await signOut();
                  setIsOpen(false);
                  window.location.href = '/home';
                }}
                className="relative glass-effect border border-red-500/30 text-red-400 hover:border-red-500/60 px-6 py-2 rounded-full font-medium hover:bg-red-500/10 transition-all duration-500 text-center overflow-hidden group"
              >
                <span className="relative z-10">Logout</span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-3 pt-4 border-t border-white/20">
              <Link
                to="/login"
                className="relative glass-effect border border-primary/30 text-primary hover:border-primary/60 px-6 py-2 rounded-full font-medium hover:bg-primary/10 transition-all duration-500 animate-shimmer text-center overflow-hidden group"
                onClick={() => setIsOpen(false)}
              >
                <span className="relative z-10">Login</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link
                to="/signup"
                className="relative bg-gradient-to-r from-primary to-secondary text-white font-medium px-6 py-2 rounded-full hover:shadow-cinematic-glow hover:scale-105 transition-all duration-500 text-center overflow-hidden group"
                onClick={() => setIsOpen(false)}
              >
                <span className="relative z-10">Sign Up</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>
          )}
        </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
