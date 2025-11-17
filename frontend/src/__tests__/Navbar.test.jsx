import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Navbar from '../components/navbar/navbarimport';

// Mock AuthContext
const mockSignOut = vi.fn();
const mockAuthContext = {
  user: null,
  signOut: mockSignOut
};

vi.mock('../contexts/AuthContext', () => ({
  AuthContext: React.createContext(mockAuthContext)
}));

// Mock PillNav component
const mockPillNav = vi.fn();
vi.mock('../components/navbar/PillNav', () => ({
  default: mockPillNav
}));

// Mock useLocation
const mockUseLocation = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: () => mockUseLocation()
  };
});

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseLocation.mockReturnValue({ pathname: '/' });
    mockPillNav.mockImplementation((props) => (
      <div data-testid="pill-nav">
        <div data-testid="pill-nav-items">
          {props.items.map((item, index) => (
            <div key={index} data-testid={`nav-item-${item.label}`}>
              {item.label}
              {item.dropdown && (
                <div data-testid={`dropdown-${item.label}`}>
                  {item.dropdown.map((dropdownItem, dropdownIndex) => (
                    <div key={dropdownIndex} data-testid={`dropdown-item-${dropdownItem.label}`}>
                      {dropdownItem.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    ));
  });

  describe('Public navigation (no user)', () => {
    beforeEach(() => {
      // Mock no user
      vi.mocked(React.createContext).mockReturnValue({
        ...mockAuthContext,
        user: null
      });
    });

    it('renders public navigation links', () => {
      render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      );

      expect(mockPillNav).toHaveBeenCalledWith(
        expect.objectContaining({
          logo: '/image.png',
          logoAlt: 'Campus Connect Logo',
          items: expect.arrayContaining([
            expect.objectContaining({ label: 'Home', href: '/home' }),
            expect.objectContaining({
              label: 'Services',
              href: '#',
              dropdown: expect.arrayContaining([
                expect.objectContaining({ label: 'Dashboard', href: '/dashboard' }),
                expect.objectContaining({ label: 'Feed', href: '/feed' }),
                expect.objectContaining({ label: 'News', href: '/news' }),
                expect.objectContaining({ label: 'Blog', href: '/blog' }),
                expect.objectContaining({ label: 'Profile', href: '/profile' }),
                expect.objectContaining({ label: 'Lost & Found', href: '/lostfound' }),
                expect.objectContaining({ label: 'Resources', href: '/resources' }),
                expect.objectContaining({ label: 'Events', href: '/events' }),
                expect.objectContaining({ label: 'Networking', href: '/networking' }),
                expect.objectContaining({ label: 'Alumni', href: '/alumni' })
              ])
            }),
            expect.objectContaining({ label: 'Support', href: '/support' }),
            expect.objectContaining({ label: 'About', href: '/about' }),
            expect.objectContaining({ label: 'Contact', href: '/contact' }),
            expect.objectContaining({ label: 'Login', href: '/login' }),
            expect.objectContaining({ label: 'Register', href: '/signup' })
          ]),
          activeHref: '/'
        }),
        expect.anything()
      );
    });

    it('does not include logout in public navigation', () => {
      render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      );

      const items = mockPillNav.mock.calls[0][0].items;
      const logoutItem = items.find(item => item.label === 'Logout');
      expect(logoutItem).toBeUndefined();
    });
  });

  describe('Authenticated navigation (with user)', () => {
    beforeEach(() => {
      // Mock authenticated user
      vi.mocked(React.createContext).mockReturnValue({
        ...mockAuthContext,
        user: { id: '1', email: 'test@example.com' }
      });
    });

    it('renders authenticated navigation links', () => {
      render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      );

      expect(mockPillNav).toHaveBeenCalledWith(
        expect.objectContaining({
          logo: '/image.png',
          logoAlt: 'Campus Connect Logo',
          items: expect.arrayContaining([
            expect.objectContaining({ label: 'Home', href: '/home' }),
            expect.objectContaining({
              label: 'Services',
              href: '#',
              dropdown: expect.arrayContaining([
                expect.objectContaining({ label: 'Dashboard', href: '/dashboard' }),
                expect.objectContaining({ label: 'Feed', href: '/feed' }),
                expect.objectContaining({ label: 'News', href: '/news' }),
                expect.objectContaining({ label: 'Blog', href: '/blog' }),
                expect.objectContaining({ label: 'Profile', href: '/profile' }),
                expect.objectContaining({ label: 'Lost & Found', href: '/lostfound' }),
                expect.objectContaining({ label: 'Resources', href: '/resources' }),
                expect.objectContaining({ label: 'Events', href: '/events' }),
                expect.objectContaining({ label: 'Networking', href: '/networking' }),
                expect.objectContaining({ label: 'Alumni', href: '/alumni' })
              ])
            }),
            expect.objectContaining({ label: 'Support', href: '/support' }),
            expect.objectContaining({ label: 'About', href: '/about' }),
            expect.objectContaining({ label: 'Contact', href: '/contact' }),
            expect.objectContaining({
              label: 'Logout',
              href: '/logout',
              action: 'logout'
            })
          ]),
          activeHref: '/'
        }),
        expect.anything()
      );
    });

    it('does not include login/register in authenticated navigation', () => {
      render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      );

      const items = mockPillNav.mock.calls[0][0].items;
      const loginItem = items.find(item => item.label === 'Login');
      const registerItem = items.find(item => item.label === 'Register');
      expect(loginItem).toBeUndefined();
      expect(registerItem).toBeUndefined();
    });

    it('calls signOut when logout action is triggered', async () => {
      render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      );

      const items = mockPillNav.mock.calls[0][0].items;
      const logoutItem = items.find(item => item.action === 'logout');

      // Simulate logout click
      if (logoutItem && logoutItem.onClick) {
        logoutItem.onClick();
      }

      expect(mockSignOut).toHaveBeenCalled();
    });
  });

  it('passes current location pathname as activeHref', () => {
    mockUseLocation.mockReturnValue({ pathname: '/dashboard' });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(mockPillNav).toHaveBeenCalledWith(
      expect.objectContaining({
        activeHref: '/dashboard'
      }),
      expect.anything()
    );
  });

  it('includes all services dropdown items', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const items = mockPillNav.mock.calls[0][0].items;
    const servicesItem = items.find(item => item.label === 'Services');

    expect(servicesItem.dropdown).toHaveLength(10);
    expect(servicesItem.dropdown).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: 'Dashboard', href: '/dashboard' }),
        expect.objectContaining({ label: 'Feed', href: '/feed' }),
        expect.objectContaining({ label: 'News', href: '/news' }),
        expect.objectContaining({ label: 'Blog', href: '/blog' }),
        expect.objectContaining({ label: 'Profile', href: '/profile' }),
        expect.objectContaining({ label: 'Lost & Found', href: '/lostfound' }),
        expect.objectContaining({ label: 'Resources', href: '/resources' }),
        expect.objectContaining({ label: 'Events', href: '/events' }),
        expect.objectContaining({ label: 'Networking', href: '/networking' }),
        expect.objectContaining({ label: 'Alumni', href: '/alumni' })
      ])
    );
  });
});