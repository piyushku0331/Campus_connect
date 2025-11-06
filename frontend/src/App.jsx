import React, { useEffect, Suspense, lazy, memo } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import BgImport from './components/background/bgimport';
import Navbar from './components/navbar/navbarimport';

const ConditionalNavbar = () => {
  const location = useLocation();
  if (location.pathname === '/') {
    return null;
  }
  return <Navbar />;
};

const Landing = lazy(() => import('./pages/Landing'));
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Events = lazy(() => import('./pages/Events'));
const Networking = lazy(() => import('./pages/Networking'));
const Resources = lazy(() => import('./pages/Resources'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Settings = lazy(() => import('./pages/Settings'));
const Footer = lazy(() => import('./components/common/Footer'));
const ProtectedRoute = lazy(() => import('./components/auth/ProtectedRoute'));
const Support = lazy(() => import('./pages/Support'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const LostFound = lazy(() => import('./pages/LostFound'));
const Alumni = lazy(() => import('./pages/Alumni'));

const ScrollToTop = memo(function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
});

const LoadingSpinner = memo(function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A0A0F] via-[#101020] to-[#0A0A0F]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#6B9FFF]/30 border-t-[#6B9FFF] rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[#6B9FFF] animate-pulse">Loading Campus Connect...</p>
      </div>
    </div>
  );
});
function App() {
  return (
    <>
      <ScrollToTop />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-[#6366F1] text-white px-4 py-2 rounded-md text-sm font-medium"
      >
        Skip to main content
      </a>
      <div className="min-h-screen relative">
        <BgImport />
        <ConditionalNavbar />
        <main id="main-content" className="relative z-10 pt-20">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Home />
                <Footer />
              </Suspense>
            } />
            <Route path="/login" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Login />
                <Footer />
              </Suspense>
            } />
            <Route path="/signup" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Signup />
                <Footer />
              </Suspense>
            } />
            <Route path="/dashboard" element={
              <Suspense fallback={<LoadingSpinner />}>
                <ProtectedRoute><Dashboard /></ProtectedRoute>
                <Footer />
              </Suspense>
            } />
            <Route path="/profile" element={
              <Suspense fallback={<LoadingSpinner />}>
                <ProtectedRoute><Profile /></ProtectedRoute>
                <Footer />
              </Suspense>
            } />
            <Route path="/events" element={
              <Suspense fallback={<LoadingSpinner />}>
                <ProtectedRoute><Events /></ProtectedRoute>
                <Footer />
              </Suspense>
            } />
            <Route path="/networking" element={
              <Suspense fallback={<LoadingSpinner />}>
                <ProtectedRoute><Networking /></ProtectedRoute>
                <Footer />
              </Suspense>
            } />
            <Route path="/resources" element={
              <Suspense fallback={<LoadingSpinner />}>
                <ProtectedRoute><Resources /></ProtectedRoute>
                <Footer />
              </Suspense>
            } />
            <Route path="/notifications" element={
              <Suspense fallback={<LoadingSpinner />}>
                <ProtectedRoute><Notifications /></ProtectedRoute>
                <Footer />
              </Suspense>
            } />
            <Route path="/settings" element={
              <Suspense fallback={<LoadingSpinner />}>
                <ProtectedRoute><Settings /></ProtectedRoute>
                <Footer />
              </Suspense>
            } />
            <Route path="/support" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Support />
                <Footer />
              </Suspense>
            } />
            <Route path="/about" element={
              <Suspense fallback={<LoadingSpinner />}>
                <AboutUs />
                <Footer />
              </Suspense>
            } />
            <Route path="/contact" element={
              <Suspense fallback={<LoadingSpinner />}>
                <ContactUs />
                <Footer />
              </Suspense>
            } />
            <Route path="/lostfound" element={
              <Suspense fallback={<LoadingSpinner />}>
                <ProtectedRoute><LostFound /></ProtectedRoute>
                <Footer />
              </Suspense>
            } />
            <Route path="/alumni" element={
              <Suspense fallback={<LoadingSpinner />}>
                <ProtectedRoute><Alumni /></ProtectedRoute>
                <Footer />
              </Suspense>
            } />
          </Routes>
          </Suspense>
        </main>
      </div>
    </>
  );
}

export default App;
