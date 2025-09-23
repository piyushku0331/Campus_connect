import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';
import '../assets/styles/pages/OtpVerificationPage.css';

const OtpVerificationPage = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const { showError, showSuccess } = useNotification();

  const validateOtp = () => {
    if (!otp) {
      showError('Please enter the OTP');
      return false;
    }

    if (otp.length !== 6) {
      showError('OTP must be 6 digits long');
      return false;
    }

    if (!/^\d{6}$/.test(otp)) {
      showError('OTP must contain only numbers');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateOtp()) {
      return;
    }

    setLoading(true);

    try {
      await authAPI.verifyOtp({ email, otp });
      showSuccess('Email verified successfully! Please login.');
      navigate('/login');
    } catch (err) {
      showError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    navigate('/signup');
    return null;
  }

  return (
    <div className="otp-verification-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="logo">
              <img src="/logo.ico" alt="Campus Connect Logo" className="logo-icon" />
              <h2>Campus Connect</h2>
            </div>
            <h1>Verify Your Email</h1>
            <p>Enter the 6-digit code sent to {email}</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="otp">OTP Code</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                placeholder="Enter 6-digit OTP"
                maxLength="6"
                className="otp-input"
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Didn't receive the code? <button className="resend-btn" onClick={() => alert('Resend functionality not implemented yet')}>Resend</button></p>
            <button className="back-link" onClick={() => navigate('/signup')}>← Back to Signup</button>
          </div>
        </div>

        <div className="auth-visual">
          <div className="floating-elements">
            <div className="float-shape shape1"></div>
            <div className="float-shape shape2"></div>
            <div className="float-shape shape3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationPage;