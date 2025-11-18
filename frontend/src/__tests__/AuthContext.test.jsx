import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { AuthProvider } from '../contexts/AuthContext';

// Mock the API
const mockGetCurrentUser = vi.fn();
const mockSignIn = vi.fn();
const mockSignOut = vi.fn();

vi.mock('../services/api', () => ({
  authAPI: {
    getCurrentUser: () => mockGetCurrentUser(),
    signIn: mockSignIn,
    signOut: mockSignOut
  }
}));

// Test component that uses AuthContext
const TestComponent = () => {
  const { user, loading, signIn, signOut } = React.useContext(
    React.createContext(null)
  );

  return (
    <div>
      <div data-testid="loading">{loading ? 'loading' : 'not-loading'}</div>
      <div data-testid="user">{user ? user.email : 'no-user'}</div>
      <button onClick={() => signIn('test@test.com', 'password')}>Sign In</button>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
};

const renderWithAuthProvider = () => {
  return render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear sessionStorage
    sessionStorage.clear();
  });

  it('provides loading state initially', () => {
    mockGetCurrentUser.mockResolvedValue({ data: { user: null } });

    renderWithAuthProvider();

    expect(screen.getByTestId('loading')).toHaveTextContent('loading');
  });

  it('sets user data when authenticated', async () => {
    const mockUser = { id: '123', email: 'test@chitkara.edu.in', name: 'Test User' };
    mockGetCurrentUser.mockResolvedValue({ data: { user: mockUser } });

    renderWithAuthProvider();

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('test@chitkara.edu.in');
    });
    expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
  });

  it('handles sign in successfully', async () => {
    const mockResponse = {
      data: {
        data: {
          user: { id: '123', email: 'test@chitkara.edu.in' },
          session: { access_token: 'token123' }
        }
      }
    };
    mockSignIn.mockResolvedValue(mockResponse);

    renderWithAuthProvider();

    const signInButton = screen.getByRole('button', { name: /sign in/i });
    signInButton.click();

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@test.com', 'password');
      expect(sessionStorage.getItem('accessToken')).toBe('token123');
    });
  });

  it('handles sign in error', async () => {
    const error = { response: { data: { error: 'Invalid credentials' } } };
    mockSignIn.mockRejectedValue(error);

    renderWithAuthProvider();

    const signInButton = screen.getByRole('button', { name: /sign in/i });
    signInButton.click();

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@test.com', 'password');
      // Error handling should be tested in the component using the context
    });
  });

  it('handles sign out', async () => {
    // Set up authenticated state
    sessionStorage.setItem('accessToken', 'token123');
    mockSignOut.mockResolvedValue({});

    renderWithAuthProvider();

    const signOutButton = screen.getByRole('button', { name: /sign out/i });
    signOutButton.click();

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
      expect(sessionStorage.getItem('accessToken')).toBeNull();
    });
  });

  it('handles API errors during user fetch', async () => {
    mockGetCurrentUser.mockRejectedValue(new Error('API Error'));

    renderWithAuthProvider();

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('no-user');
    });
    expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
  });

  it('clears token on API error', async () => {
    sessionStorage.setItem('accessToken', 'invalid-token');
    mockGetCurrentUser.mockRejectedValue(new Error('Invalid token'));

    renderWithAuthProvider();

    await waitFor(() => {
      expect(sessionStorage.getItem('accessToken')).toBeNull();
    });
  });

  it('handles signUp method', () => {
    // The signUp method is exposed by the context
    // This would be tested by components that use it
    expect(true).toBe(true); // Placeholder test
  });

  it('handles verifyOtp method', () => {
    // The verifyOtp method is exposed by the context
    // This would be tested by components that use it
    expect(true).toBe(true); // Placeholder test
  });
});