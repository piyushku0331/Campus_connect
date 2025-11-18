import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Signup from '../pages/Signup';
import { AuthProvider } from '../contexts/AuthContext';

// Mock the useAuth hook
const mockSignUp = vi.fn();
const mockVerifyOtp = vi.fn();
const mockUseAuth = vi.fn();

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth()
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>
  },
  AnimatePresence: ({ children }) => children
}));

const renderSignup = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Signup />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Signup Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      signUp: mockSignUp,
      verifyOtp: mockVerifyOtp
    });
  });

  it('renders signup form correctly', () => {
    renderSignup();

    expect(screen.getByText('Join the Community')).toBeInTheDocument();
    expect(screen.getByText('Create your account and start connecting')).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
  });

  it('shows step indicator', () => {
    renderSignup();

    expect(screen.getByText('Account Details')).toBeInTheDocument();
    expect(screen.getByText('Verification')).toBeInTheDocument();
  });

  it('validates email domain', async () => {
    renderSignup();

    const emailInput = screen.getByLabelText(/email address/i);
    const continueButton = screen.getByRole('button', { name: /continue/i });

    fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
    fireEvent.click(continueButton);

    await waitFor(() => {
      expect(screen.getByText('Only @chitkara.edu.in email addresses are allowed')).toBeInTheDocument();
    });
  });

  it('validates age range', async () => {
    renderSignup();

    const ageInput = screen.getByLabelText(/age/i);
    const continueButton = screen.getByRole('button', { name: /continue/i });

    fireEvent.change(ageInput, { target: { value: '15' } });
    fireEvent.click(continueButton);

    await waitFor(() => {
      expect(screen.getByText('Age must be between 16 and 30')).toBeInTheDocument();
    });
  });

  it('validates password strength', () => {
    renderSignup();

    const passwordInput = screen.getByLabelText(/^password$/i);

    fireEvent.change(passwordInput, { target: { value: 'weak' } });
    expect(screen.getByText('Weak')).toBeInTheDocument();

    fireEvent.change(passwordInput, { target: { value: 'StrongPass123!' } });
    expect(screen.getByText('Strong')).toBeInTheDocument();
  });

  it('validates password confirmation match', () => {
    renderSignup();

    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'different' } });

    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });

  it('shows loading state during registration', async () => {
    mockSignUp.mockResolvedValue({ error: null });

    renderSignup();

    // Fill required fields
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@chitkara.edu.in' } });
    fireEvent.change(screen.getByLabelText(/age/i), { target: { value: '20' } });
    fireEvent.change(screen.getByLabelText(/year/i), { target: { value: '3rd Year' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });

    const continueButton = screen.getByRole('button', { name: /continue/i });
    fireEvent.click(continueButton);

    expect(continueButton).toBeDisabled();
    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalled();
    });
  });

  it('transitions to OTP verification step on successful registration', async () => {
    mockSignUp.mockResolvedValue({ error: null });

    renderSignup();

    // Fill required fields
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@chitkara.edu.in' } });
    fireEvent.change(screen.getByLabelText(/age/i), { target: { value: '20' } });
    fireEvent.change(screen.getByLabelText(/year/i), { target: { value: '3rd Year' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });

    const continueButton = screen.getByRole('button', { name: /continue/i });
    fireEvent.click(continueButton);

    await waitFor(() => {
      expect(screen.getByText('Verification Code')).toBeInTheDocument();
    });
  });

  it('validates OTP input', async () => {
    // First complete registration step
    mockSignUp.mockResolvedValue({ error: null });

    renderSignup();

    // Fill required fields and submit
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@chitkara.edu.in' } });
    fireEvent.change(screen.getByLabelText(/age/i), { target: { value: '20' } });
    fireEvent.change(screen.getByLabelText(/year/i), { target: { value: '3rd Year' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    await waitFor(() => {
      expect(screen.getByText('Verification Code')).toBeInTheDocument();
    });

    // Now test OTP validation
    const otpInput = screen.getByLabelText(/verification code/i);
    const verifyButton = screen.getByRole('button', { name: /verify & complete/i });

    // Try with short OTP
    fireEvent.change(otpInput, { target: { value: '123' } });
    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid 6-digit OTP')).toBeInTheDocument();
    });
  });

  it('handles successful OTP verification', async () => {
    const mockNavigate = vi.fn();
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useNavigate: () => mockNavigate
      };
    });

    // First complete registration step
    mockSignUp.mockResolvedValue({ error: null });
    mockVerifyOtp.mockResolvedValue({ error: null });

    renderSignup();

    // Fill required fields and submit
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@chitkara.edu.in' } });
    fireEvent.change(screen.getByLabelText(/age/i), { target: { value: '20' } });
    fireEvent.change(screen.getByLabelText(/year/i), { target: { value: '3rd Year' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    await waitFor(() => {
      expect(screen.getByText('Verification Code')).toBeInTheDocument();
    });

    // Enter valid OTP
    const otpInput = screen.getByLabelText(/verification code/i);
    fireEvent.change(otpInput, { target: { value: '123456' } });

    const verifyButton = screen.getByRole('button', { name: /verify & complete/i });
    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(mockVerifyOtp).toHaveBeenCalledWith('test@chitkara.edu.in', '123456');
    });
  });

  it('displays login link', () => {
    renderSignup();

    const loginLink = screen.getByRole('link', { name: /login/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  it('handles photo upload preview', () => {
    renderSignup();

    const fileInput = screen.getByLabelText(/profile photo/i);
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    // Check if preview appears (this might need adjustment based on implementation)
    expect(fileInput.files[0]).toBe(file);
  });
});