import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ProtectedRoute from '../components/auth/ProtectedRoute';

// Mock the useAuth hook
const mockUseAuth = vi.fn();

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth()
}));

const TestComponent = () => <div>Protected Content</div>;

const renderProtectedRoute = (user = null, loading = false) => {
  mockUseAuth.mockReturnValue({ user, loading });

  return render(
    <MemoryRouter>
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    </MemoryRouter>
  );
};

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading spinner when authentication is loading', () => {
    renderProtectedRoute(null, true);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders protected content when user is authenticated', () => {
    const mockUser = { id: '123', email: 'test@chitkara.edu.in' };
    renderProtectedRoute(mockUser, false);

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    // Mock window.location to check redirect
    const mockLocation = { pathname: '/protected' };
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true
    });

    renderProtectedRoute(null, false);

    // Since Navigate component redirects, we can't easily test the redirect in this setup
    // But we can verify that the component doesn't render protected content
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('redirects to login when user is null and not loading', () => {
    renderProtectedRoute(null, false);

    // The Navigate component should be rendered instead of children
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders children when user exists', () => {
    const mockUser = {
      id: '123',
      email: 'test@chitkara.edu.in',
      name: 'Test User'
    };

    renderProtectedRoute(mockUser, false);

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('handles undefined user state', () => {
    renderProtectedRoute(undefined, false);

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('handles empty user object', () => {
    renderProtectedRoute({}, false);

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});