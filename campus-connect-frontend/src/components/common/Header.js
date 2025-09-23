import React, { useState, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/components/common/Header.css';

// Logo component using logo.ico
const Logo = () => (
  <img src="/logo.ico" alt="Campus Connect Logo" style={{ width: '28px', height: '28px' }} />
);

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check if user is authenticated (you can replace this with your auth logic)
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('userId');
    setIsAuthenticated(!!token);
    setUserId(id);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="main-header">
      <nav className="navbar">
        {/* Left Section: Brand */}
        <div className="navbar-brand">
          <Link to="/" onClick={closeMobileMenu}>
            <Logo />
            <span>Campus Connect</span>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {/* Center Section: Main Navigation (Desktop) */}
        <div className="navbar-center">
          {isAuthenticated ? (
            // Show all features for authenticated users
            <>
              <Link to="/profile">Profile</Link>
              <Link to="/events">Events</Link>
              <Link to="/placements">Placements</Link>
              <Link to="/community">Community</Link>
              <Link to="/connections">Connections</Link>
              <Link to="/study-hub">Study Hub</Link>
              <Link to="/notice-board">Notice Board</Link>
              <Link to="/lost-and-found">Lost & Found</Link>
              <Link to="/helpline">Helpline</Link>
              <Link to="/chat">Messages</Link>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
            </>
          ) : (
            // Show only About and Contact for non-authenticated users
            <>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
            </>
          )}
        </div>

        {/* Right Section: Actions (Desktop) */}
        <div className="navbar-right">
          {isAuthenticated ? (
            <button
              className="btn-logout"
              onClick={() => {
                localStorage.removeItem('token');
                setIsAuthenticated(false);
                window.location.href = '/';
              }}
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/signup" className="btn-signup">Get Started</Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        {isAuthenticated ? (
          <>
            <Link to="/profile" onClick={closeMobileMenu}>Profile</Link>
            <Link to="/events" onClick={closeMobileMenu}>Events</Link>
            <Link to="/placements" onClick={closeMobileMenu}>Placements</Link>
            <Link to="/community" onClick={closeMobileMenu}>Community</Link>
            <Link to="/connections" onClick={closeMobileMenu}>Connections</Link>
            <Link to="/study-hub" onClick={closeMobileMenu}>Study Hub</Link>
            <Link to="/notice-board" onClick={closeMobileMenu}>Notice Board</Link>
            <Link to="/lost-and-found" onClick={closeMobileMenu}>Lost & Found</Link>
            <Link to="/helpline" onClick={closeMobileMenu}>Helpline</Link>
            <Link to="/chat" onClick={closeMobileMenu}>Messages</Link>
            <Link to="/about" onClick={closeMobileMenu}>About</Link>
            <Link to="/contact" onClick={closeMobileMenu}>Contact</Link>
            <button
              className="btn-login mobile-logout"
              onClick={() => {
                localStorage.removeItem('token');
                setIsAuthenticated(false);
                closeMobileMenu();
                window.location.href = '/';
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/about" onClick={closeMobileMenu}>About</Link>
            <Link to="/contact" onClick={closeMobileMenu}>Contact</Link>
            <Link to="/login" className="btn-login" onClick={closeMobileMenu}>Login</Link>
            <Link to="/signup" className="btn-signup" onClick={closeMobileMenu}>Get Started</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default memo(Header);