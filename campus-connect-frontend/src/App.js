import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

import Header from './components/common/Header';
import Footer from './components/common/Footer';
import NotificationContainer from './components/common/NotificationContainer';

import { NotificationProvider } from './contexts/NotificationContext';

import PreLandingPage from './pages/PreLandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OtpVerificationPage from './pages/OtpVerificationPage';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const AnalyticsDashboardPage = lazy(() => import('./pages/AnalyticsDashboardPage'));
const AlumniStoryPage = lazy(() => import('./pages/AlumniStoryPage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const ConnectionsPage = lazy(() => import('./pages/ConnectionsPage'));
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