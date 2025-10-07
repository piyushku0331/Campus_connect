import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

import Header from './components/common/Header';
import Footer from './components/common/Footer';
import NotificationContainer from './components/common/NotificationContainer';
import { NotificationProvider } from './contexts/NotificationContext';
import { usePerformance } from './hooks/usePerformance';

import PreLandingPage from './pages/PreLandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OtpVerificationPage from './pages/OtpVerificationPage';

const HomePage = lazy(() => import('./pages/HomePage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const ConnectionsPage = lazy(() => import('./pages/ConnectionsPage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const StudyMaterialPage = lazy(() => import('./pages/StudyMaterialPage'));
const NoticeBoardPage = lazy(() => import('./pages/NoticeBoardPage'));
const PlacementsPage = lazy(() => import('./pages/PlacementsPage'));
const LostAndFoundPage = lazy(() => import('./pages/LostAndFoundPage'));
const HelplinePage = lazy(() => import('./pages/HelplinePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const AnalyticsDashboardPage = lazy(() => import('./pages/AnalyticsDashboardPage'));
const AlumniStoryPage = lazy(() => import('./pages/AlumniStoryPage'));
const LazyErrorBoundary = lazy(() => import('./components/common/ErrorBoundary'));

const PageLoader = () => (
  <div className="page-loader">
    <div className="loading-spinner"></div>
    <p>Loading page...</p>
    <div className="loading-dots">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
);

function AppContent() {
  const location = useLocation();
  const showHeader = location.pathname !== '/';
  usePerformance();

  return (
    <div className="App">
      <div className="parallax-bg"></div>
      <NotificationContainer />
      {showHeader && <Header />}
      <main>
        <Suspense fallback={<PageLoader />}>
          <LazyErrorBoundary>
            <Routes>
            <Route path="/" element={<PreLandingPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/prelanding" element={<PreLandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/verify-otp" element={<OtpVerificationPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/placements" element={<PlacementsPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/connections" element={<ConnectionsPage />} />
            <Route path="/study-hub" element={<StudyMaterialPage />} />
            <Route path="/notice-board" element={<NoticeBoardPage />} />
            <Route path="/lost-and-found" element={<LostAndFoundPage />} />
            <Route path="/helpline" element={<HelplinePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/analytics" element={<AnalyticsDashboardPage />} />
            <Route path="/alumni/:id" element={<AlumniStoryPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </LazyErrorBoundary>
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