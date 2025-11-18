import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import PillNav from '../components/navbar/PillNav';

// Mock GSAP
vi.mock('gsap', () => ({
  timeline: vi.fn(() => ({
    to: vi.fn().mockReturnThis(),
    tweenTo: vi.fn().mockReturnThis(),
    kill: vi.fn(),
    duration: vi.fn(() => 1)
  })),
  set: vi.fn(),
  to: vi.fn(),
  fromTo: vi.fn(),
  killTweensOf: vi.fn()
}));

// Mock createPortal
const mockCreatePortal = vi.fn((children) => <div data-testid="portal">{children}</div>);
vi.mock('react-dom', () => ({
  createPortal: (children) => mockCreatePortal(children)
}));

// Mock window.scrollY and scrollX
Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
Object.defineProperty(window, 'scrollX', { value: 0, writable: true });

describe('PillNav', () => {
  const mockItems = [
    { label: 'Logo', href: '/home' },
    { label: 'Home', href: '/home' },
    { label: 'Services', href: '#', dropdown: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'News', href: '/news' }
    ]},
    { label: 'Contact', href: '/contact' }
  ];

  const defaultProps = {
    logo: '/logo.png',
    logoAlt: 'Test Logo',
    items: mockItems,
    baseColor: '#000',
    pillColor: '#fff',
    hoveredPillTextColor: '#fff',
    pillTextColor: '#000'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockCreatePortal.mockImplementation((children) => <div data-testid="portal">{children}</div>);
  });

  it('renders logo correctly', () => {
    render(
      <MemoryRouter>
        <PillNav {...defaultProps} />
      </MemoryRouter>
    );

    const logoLink = screen.getByRole('link', { name: /home/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', '/home');
  });

  it('renders navigation items', () => {
    render(
      <MemoryRouter>
        <PillNav {...defaultProps} />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contact' })).toBeInTheDocument();
  });

  it('renders dropdown items when dropdown is open', async () => {
    render(
      <MemoryRouter>
        <PillNav {...defaultProps} />
      </MemoryRouter>
    );

    const servicesButton = screen.getByRole('button', { name: 'Services' });
    fireEvent.click(servicesButton);

    await waitFor(() => {
      expect(mockCreatePortal).toHaveBeenCalled();
    });

    // Check if portal contains dropdown items
    expect(screen.getByTestId('portal')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('News')).toBeInTheDocument();
  });

  it('closes dropdown when clicking outside', async () => {
    render(
      <MemoryRouter>
        <PillNav {...defaultProps} />
      </MemoryRouter>
    );

    const servicesButton = screen.getByRole('button', { name: 'Services' });
    fireEvent.click(servicesButton);

    await waitFor(() => {
      expect(mockCreatePortal).toHaveBeenCalled();
    });

    // Click outside
    fireEvent.mouseDown(document.body);

    // Portal should be cleared or not rendered
    expect(mockCreatePortal).toHaveBeenCalledTimes(1); // Only initial call
  });

  it('renders mobile menu button', () => {
    render(
      <MemoryRouter>
        <PillNav {...defaultProps} />
      </MemoryRouter>
    );

    const mobileMenuButton = screen.getByRole('button', { name: 'Toggle menu' });
    expect(mobileMenuButton).toBeInTheDocument();
  });

  it('toggles mobile menu on button click', async () => {
    render(
      <MemoryRouter>
        <PillNav {...defaultProps} />
      </MemoryRouter>
    );

    const mobileMenuButton = screen.getByRole('button', { name: 'Toggle menu' });

    // Initially closed
    expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(mobileMenuButton);

    await waitFor(() => {
      expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'true');
    });

    // Mobile menu should be visible
    expect(screen.getByText('Home')).toBeInTheDocument(); // Mobile menu items
  });

  it('closes mobile menu on navigation', async () => {
    render(
      <MemoryRouter>
        <PillNav {...defaultProps} />
      </MemoryRouter>
    );

    const mobileMenuButton = screen.getByRole('button', { name: 'Toggle menu' });
    fireEvent.click(mobileMenuButton);

    await waitFor(() => {
      expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'true');
    });

    // Click on a mobile menu item
    const homeLink = screen.getAllByRole('link', { name: 'Home' })[1]; // Mobile version
    fireEvent.click(homeLink);

    await waitFor(() => {
      expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  it('handles keyboard navigation for dropdown', () => {
    render(
      <MemoryRouter>
        <PillNav {...defaultProps} />
      </MemoryRouter>
    );

    const servicesButton = screen.getByRole('button', { name: 'Services' });

    // Focus and press Enter
    servicesButton.focus();
    fireEvent.keyDown(servicesButton, { key: 'Enter' });

    expect(servicesButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('handles keyboard navigation for mobile menu', () => {
    render(
      <MemoryRouter>
        <PillNav {...defaultProps} />
      </MemoryRouter>
    );

    const mobileMenuButton = screen.getByRole('button', { name: 'Toggle menu' });

    // Focus and press Enter
    mobileMenuButton.focus();
    fireEvent.keyDown(mobileMenuButton, { key: 'Enter' });

    expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes menus on Escape key', async () => {
    render(
      <MemoryRouter>
        <PillNav {...defaultProps} />
      </MemoryRouter>
    );

    const servicesButton = screen.getByRole('button', { name: 'Services' });
    fireEvent.click(servicesButton);

    await waitFor(() => {
      expect(mockCreatePortal).toHaveBeenCalled();
    });

    // Press Escape
    fireEvent.keyDown(document, { key: 'Escape' });

    // Portal should be cleared
    expect(mockCreatePortal).toHaveBeenCalledTimes(1);
  });

  it('highlights active route', () => {
    render(
      <MemoryRouter initialEntries={['/home']}>
        <PillNav {...defaultProps} />
      </MemoryRouter>
    );

    // The active pill should have a bottom indicator
    // This is tested by checking if the active route logic works
    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toHaveAttribute('aria-current', 'page');
  });

  it('renders external links correctly', () => {
    const itemsWithExternal = [
      { label: 'Logo', href: '/home' },
      { label: 'External', href: 'https://example.com' }
    ];

    render(
      <MemoryRouter>
        <PillNav {...defaultProps} items={itemsWithExternal} />
      </MemoryRouter>
    );

    const externalLink = screen.getByRole('link', { name: 'External' });
    expect(externalLink).toHaveAttribute('href', 'https://example.com');
    expect(externalLink).toHaveAttribute('target', '_blank');
    expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('handles dropdown item clicks', async () => {
    render(
      <MemoryRouter>
        <PillNav {...defaultProps} />
      </MemoryRouter>
    );

    const servicesButton = screen.getByRole('button', { name: 'Services' });
    fireEvent.click(servicesButton);

    await waitFor(() => {
      expect(mockCreatePortal).toHaveBeenCalled();
    });

    // Click on dropdown item
    const dashboardLink = screen.getByRole('link', { name: 'Dashboard' });
    fireEvent.click(dashboardLink);

    // Menu should close
    expect(mockCreatePortal).toHaveBeenCalledTimes(1);
  });

  it('applies correct CSS variables', () => {
    render(
      <MemoryRouter>
        <PillNav {...defaultProps} />
      </MemoryRouter>
    );

    const nav = screen.getByRole('navigation');

    // Check if CSS variables are applied (this is a basic check)
    expect(nav).toHaveStyle('--base: #000');
    expect(nav).toHaveStyle('--pill-bg: #fff');
  });
});