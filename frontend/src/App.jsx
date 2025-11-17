// Main App component for Campus Connect React application
import React, { useEffect, Suspense, lazy, memo } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import BgImport from './components/background/bgimport'; // Background components and effects
import Navbar from './components/navbar/navbarimport'; // Main navigation component
import LoadingSpinner from './components/common/LoadingSpinner'; // Loading spinner component

// Conditional navbar that only renders on non-landing pages
const ConditionalNavbar = () => {
  const location = useLocation();
  // Hide navbar on landing page for clean hero section
  if (location.pathname === '/') {
    return null;
  }
  return <Navbar />;
};

// Lazy-loaded page components for code splitting and performance optimization
const Landing = lazy(() => import('./pages/Landing')); // Landing page with hero section
const Home = lazy(() => import('./pages/Home')); // Home page for authenticated users
const Login = lazy(() => import('./pages/Login')); // User login page
const Signup = lazy(() => import('./pages/Signup')); // User registration page
const Dashboard = lazy(() => import('./pages/Dashboard')); // Main dashboard with overview
const Profile = lazy(() => import('./pages/Profile')); // User profile management
const Events = lazy(() => import('./pages/Events')); // Campus events listing and RSVP
const Networking = lazy(() => import('./pages/Networking')); // Professional networking
const Resources = lazy(() => import('./pages/Resources')); // Study materials and resources
const Notifications = lazy(() => import('./pages/Notifications')); // User notifications
const Settings = lazy(() => import('./pages/Settings')); // User settings and preferences
const Footer = lazy(() => import('./components/common/Footer')); // Site footer component
const ProtectedRoute = lazy(() => import('./components/auth/ProtectedRoute')); // Route protection wrapper
const Support = lazy(() => import('./pages/Support')); // Support and help center
const AboutUs = lazy(() => import('./pages/AboutUs')); // About page
const ContactUs = lazy(() => import('./pages/ContactUs')); // Contact information
const LostFound = lazy(() => import('./pages/LostFound')); // Lost and found items
const Alumni = lazy(() => import('./pages/Alumni')); // Alumni network and stories

// Utility component to scroll to top on route changes
const ScrollToTop = memo(function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top whenever route changes for better UX
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // This component doesn't render anything
});
// Route wrapper component for pages with footer
const PageWithFooter = ({ children, protected: isProtected = false }) => (
  <Suspense fallback={<LoadingSpinner />}>
    {isProtected ? <ProtectedRoute>{children}</ProtectedRoute> : children}
    <Footer />
  </Suspense>
);

PageWithFooter.propTypes = {
  children: PropTypes.node.isRequired,
  protected: PropTypes.bool,
};

// Main App component - root component of the Campus Connect application
function App() {
  return (
    <>
      {/* Scroll to top utility for route navigation */}
      <ScrollToTop />

      {/* Accessibility: Skip to main content link for screen readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-[#6366F1] text-white px-4 py-2 rounded-md text-sm font-medium"
      >
        Skip to main content
      </a>

      {/* Main application container with background and layout */}
      <div className="min-h-screen relative">
        {/* Background components (aurora, particles, etc.) */}
        <BgImport />

        {/* Navigation bar (conditionally rendered) */}
        <ConditionalNavbar />

        {/* Main content area with proper spacing and z-index */}
        <main id="main-content" className="relative z-10 pt-20">
          {/* Suspense wrapper for lazy-loaded components */}
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/home" element={<PageWithFooter><Home /></PageWithFooter>} />
              <Route path="/login" element={<PageWithFooter><Login /></PageWithFooter>} />
              <Route path="/signup" element={<PageWithFooter><Signup /></PageWithFooter>} />
              <Route path="/dashboard" element={<PageWithFooter protected><Dashboard /></PageWithFooter>} />
              <Route path="/profile" element={<PageWithFooter protected><Profile /></PageWithFooter>} />
              <Route path="/events" element={<PageWithFooter protected><Events /></PageWithFooter>} />
              <Route path="/networking" element={<PageWithFooter protected><Networking /></PageWithFooter>} />
              <Route path="/resources" element={<PageWithFooter protected><Resources /></PageWithFooter>} />
              <Route path="/notifications" element={<PageWithFooter protected><Notifications /></PageWithFooter>} />
              <Route path="/settings" element={<PageWithFooter protected><Settings /></PageWithFooter>} />
              <Route path="/support" element={<PageWithFooter><Support /></PageWithFooter>} />
              <Route path="/about" element={<PageWithFooter><AboutUs /></PageWithFooter>} />
              <Route path="/contact" element={<PageWithFooter><ContactUs /></PageWithFooter>} />
              <Route path="/lostfound" element={<PageWithFooter protected><LostFound /></PageWithFooter>} />
              <Route path="/alumni" element={<PageWithFooter protected><Alumni /></PageWithFooter>} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </>
  );
}

export default App;
