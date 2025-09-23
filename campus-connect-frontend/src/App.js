import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

// Import Main CSS
import './assets/styles/main.css';

// Import Core Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import NotificationContainer from './components/common/NotificationContainer';

// Import Context
import { NotificationProvider } from './contexts/NotificationContext';

// Import critical pages immediately
import PreLandingPage from './pages/PreLandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OtpVerificationPage from './pages/OtpVerificationPage';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';

// Lazy load less critical pages
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const AnalyticsDashboardPage = lazy(() => import('./pages/AnalyticsDashboardPage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const HelplinePage = lazy(() => import('./pages/HelplinePage'));
const LostAndFoundPage = lazy(() => import('./pages/LostAndFoundPage'));
const NoticeBoardPage = lazy(() => import('./pages/NoticeBoardPage'));
const PlacementsPage = lazy(() => import('./pages/PlacementsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const StudyMaterialPage = lazy(() => import('./pages/StudyMaterialPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));

function AppContent() {
  const location = useLocation();
  const showHeader = location.pathname !== '/';

  return (
    <div className="App">
      <div className="parallax-bg"></div>
      <NotificationContainer />
      {showHeader && <Header />}
      <main>
        <Suspense fallback={<div className="loading-spinner" style={{ margin: '50px auto' }}></div>}>
          <Routes>
            {/* Default landing page */}
            <Route path="/" element={<PreLandingPage />} />

            {/* Home page */}
            <Route path="/home" element={<HomePage />} />

            {/* Pre-landing page (redirect or alias) */}
            <Route path="/prelanding" element={<PreLandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/verify-otp" element={<OtpVerificationPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Feature Routes from Header */}
            <Route path="/events" element={<EventsPage />} />
            <Route path="/placements" element={<PlacementsPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/study-hub" element={<StudyMaterialPage />} />
            <Route path="/notice-board" element={<NoticeBoardPage />} />
            <Route path="/lost-and-found" element={<LostAndFoundPage />} />
            <Route path="/helpline" element={<HelplinePage />} />

            {/* Other Application Routes */}
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/analytics" element={<AnalyticsDashboardPage />} />

            {/* Additional Pages */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </Suspense>
      </main>
      {showHeader && <Footer />}
    </div>
  );
}

function App() {
  return (
    <NotificationProvider>
      <Router>
        <AppContent />
      </Router>
    </NotificationProvider>
  );
}

export default App;