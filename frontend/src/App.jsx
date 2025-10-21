import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

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
const Support = lazy(() => import('./pages/Support'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const Header = lazy(() => import('./components/common/Header'));
const Footer = lazy(() => import('./components/common/Footer'));
const ProtectedRoute = lazy(() => import('./components/auth/ProtectedRoute'));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A0A0F] via-[#101020] to-[#0A0A0F]">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-[#6B9FFF]/30 border-t-[#6B9FFF] rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-[#6B9FFF] animate-pulse">Loading Campus Connect...</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Header />
                <Home />
                <Footer />
              </Suspense>
            } />
            <Route path="/login" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Header />
                <Login />
                <Footer />
              </Suspense>
            } />
            <Route path="/signup" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Header />
                <Signup />
                <Footer />
              </Suspense>
            } />
            <Route path="/dashboard" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Header />
                <ProtectedRoute><Dashboard /></ProtectedRoute>
                <Footer />
              </Suspense>
            } />
            <Route path="/profile" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Header />
                <ProtectedRoute><Profile /></ProtectedRoute>
                <Footer />
              </Suspense>
            } />
            <Route path="/events" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Header />
                <ProtectedRoute><Events /></ProtectedRoute>
                <Footer />
              </Suspense>
            } />
            <Route path="/networking" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Header />
                <ProtectedRoute><Networking /></ProtectedRoute>
                <Footer />
              </Suspense>
            } />
            <Route path="/resources" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Header />
                <ProtectedRoute><Resources /></ProtectedRoute>
                <Footer />
              </Suspense>
            } />
            <Route path="/notifications" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Header />
                <ProtectedRoute><Notifications /></ProtectedRoute>
                <Footer />
              </Suspense>
            } />
            <Route path="/settings" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Header />
                <ProtectedRoute><Settings /></ProtectedRoute>
                <Footer />
              </Suspense>
            } />
            <Route path="/support" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Header />
                <Support />
                <Footer />
              </Suspense>
            } />
            <Route path="/contact" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Header />
                <ContactUs />
                <Footer />
              </Suspense>
            } />
            <Route path="/about" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Header />
                <AboutUs />
                <Footer />
              </Suspense>
            } />
            <Route path="/help" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Header />
                <HelpCenter />
                <Footer />
              </Suspense>
            } />
            <Route path="/privacy" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Header />
                <PrivacyPolicy />
                <Footer />
              </Suspense>
            } />
            <Route path="/terms" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Header />
                <TermsOfService />
                <Footer />
              </Suspense>
            } />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
