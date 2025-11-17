import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import App from '../App';

// Mock all lazy-loaded components
vi.mock('../pages/Landing', () => ({ default: () => <div data-testid="landing-page">Landing Page</div> }));
vi.mock('../pages/Home', () => ({ default: () => <div data-testid="home-page">Home Page</div> }));
vi.mock('../pages/Login', () => ({ default: () => <div data-testid="login-page">Login Page</div> }));
vi.mock('../pages/Signup', () => ({ default: () => <div data-testid="signup-page">Signup Page</div> }));
vi.mock('../pages/Dashboard', () => ({ default: () => <div data-testid="dashboard-page">Dashboard Page</div> }));
vi.mock('../pages/Profile', () => ({ default: () => <div data-testid="profile-page">Profile Page</div> }));
vi.mock('../pages/Events', () => ({ default: () => <div data-testid="events-page">Events Page</div> }));
vi.mock('../pages/Networking', () => ({ default: () => <div data-testid="networking-page">Networking Page</div> }));
vi.mock('../pages/Resources', () => ({ default: () => <div data-testid="resources-page">Resources Page</div> }));
vi.mock('../pages/Notifications', () => ({ default: () => <div data-testid="notifications-page">Notifications Page</div> }));
vi.mock('../pages/Settings', () => ({ default: () => <div data-testid="settings-page">Settings Page</div> }));
vi.mock('../pages/Support', () => ({ default: () => <div data-testid="support-page">Support Page</div> }));
vi.mock('../pages/AboutUs', () => ({ default: () => <div data-testid="about-page">About Us Page</div> }));
vi.mock('../pages/ContactUs', () => ({ default: () => <div data-testid="contact-page">Contact Us Page</div> }));
vi.mock('../pages/LostFound', () => ({ default: () => <div data-testid="lostfound-page">Lost & Found Page</div> }));
vi.mock('../pages/Alumni', () => ({ default: () => <div data-testid="alumni-page">Alumni Page</div> }));
vi.mock('../pages/Feed', () => ({ default: () => <div data-testid="feed-page">Feed Page</div> }));
vi.mock('../pages/Blog', () => ({ default: () => <div data-testid="blog-page">Blog Page</div> }));
vi.mock('../pages/News', () => ({ default: () => <div data-testid="news-page">News Page</div> }));
vi.mock('../pages/CreatorApply', () => ({ default: () => <div data-testid="creator-apply-page">Creator Apply Page</div> }));
vi.mock('../pages/Faq', () => ({ default: () => <div data-testid="faq-page">FAQ Page</div> }));
vi.mock('../pages/Docs', () => ({ default: () => <div data-testid="docs-page">Docs Page</div> }));
vi.mock('../pages/Forum', () => ({ default: () => <div data-testid="forum-page">Forum Page</div> }));

// Mock components
vi.mock('../components/background/bgimport', () => ({ default: () => <div data-testid="background">Background</div> }));
vi.mock('../components/navbar/navbarimport', () => ({ default: () => <div data-testid="navbar">Navbar</div> }));
vi.mock('../components/common/Footer', () => ({ default: () => <div data-testid="footer">Footer</div> }));
vi.mock('../components/common/LoadingSpinner', () => ({ default: () => <div data-testid="loading-spinner">Loading...</div> }));
vi.mock('../components/auth/ProtectedRoute', () => ({
  default: ({ children }) => <div data-testid="protected-route">{children}</div>
}));

const renderApp = (initialRoute = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <App />
    </MemoryRouter>
  );
};

describe('App Routing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders landing page on root path', async () => {
    renderApp('/');

    await waitFor(() => {
      expect(screen.getByTestId('landing-page')).toBeInTheDocument();
    });
  });

  it('renders home page on /home path', async () => {
    renderApp('/home');

    await waitFor(() => {
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
  });

  it('renders login page on /login path', async () => {
    renderApp('/login');

    await waitFor(() => {
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
  });

  it('renders signup page on /signup path', async () => {
    renderApp('/signup');

    await waitFor(() => {
      expect(screen.getByTestId('signup-page')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
  });

  it('renders dashboard page on /dashboard path with protection', async () => {
    renderApp('/dashboard');

    await waitFor(() => {
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
  });

  it('renders feed page on /feed path with protection', async () => {
    renderApp('/feed');

    await waitFor(() => {
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('feed-page')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
  });

  it('renders news page on /news path with protection', async () => {
    renderApp('/news');

    await waitFor(() => {
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('news-page')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
  });

  it('renders blog page on /blog path with protection', async () => {
    renderApp('/blog');

    await waitFor(() => {
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('blog-page')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
  });

  it('renders creator apply page on /creator/apply path with protection', async () => {
    renderApp('/creator/apply');

    await waitFor(() => {
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('creator-apply-page')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
  });

  it('renders profile page on /profile path with protection', async () => {
    renderApp('/profile');

    await waitFor(() => {
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('profile-page')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
  });

  it('renders events page on /events path with protection', async () => {
    renderApp('/events');

    await waitFor(() => {
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('events-page')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
  });

  it('renders networking page on /networking path with protection', async () => {
    renderApp('/networking');

    await waitFor(() => {
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('networking-page')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
  });

  it('renders resources page on /resources path with protection', async () => {
    renderApp('/resources');

    await waitFor(() => {
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('resources-page')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
  });

  it('renders notifications page on /notifications path with protection', async () => {
    renderApp('/notifications');

    await waitFor(() => {
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('notifications-page')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
  });

  it('renders settings page on /settings path with protection', async () => {
    renderApp('/settings');

    await waitFor(() => {
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('settings-page')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
  });

  it('renders lostfound page on /lostfound path with protection', async () => {
    renderApp('/lostfound');

    await waitFor(() => {
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('lostfound-page')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
  });

  it('renders alumni page on /alumni path with protection', async () => {
    renderApp('/alumni');

    await waitFor(() => {
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('alumni-page')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
  });

  it('renders support page on /support path without protection', async () => {
    renderApp('/support');

    await waitFor(() => {
      expect(screen.getByTestId('support-page')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-route')).not.toBeInTheDocument();
    });
  });

  it('renders about page on /about path without protection', async () => {
    renderApp('/about');

    await waitFor(() => {
      expect(screen.getByTestId('about-page')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-route')).not.toBeInTheDocument();
    });
  });

  it('renders contact page on /contact path without protection', async () => {
    renderApp('/contact');

    await waitFor(() => {
      expect(screen.getByTestId('contact-page')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-route')).not.toBeInTheDocument();
    });
  });

  it('renders faq page on /faq path without protection', async () => {
    renderApp('/faq');

    await waitFor(() => {
      expect(screen.getByTestId('faq-page')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-route')).not.toBeInTheDocument();
    });
  });

  it('renders docs page on /docs path without protection', async () => {
    renderApp('/docs');

    await waitFor(() => {
      expect(screen.getByTestId('docs-page')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-route')).not.toBeInTheDocument();
    });
  });

  it('renders forum page on /forum path without protection', async () => {
    renderApp('/forum');

    await waitFor(() => {
      expect(screen.getByTestId('forum-page')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-route')).not.toBeInTheDocument();
    });
  });

  it('does not render navbar on landing page', async () => {
    renderApp('/');

    await waitFor(() => {
      expect(screen.getByTestId('landing-page')).toBeInTheDocument();
      expect(screen.queryByTestId('navbar')).not.toBeInTheDocument();
    });
  });

  it('renders navbar on other pages', async () => {
    renderApp('/home');

    await waitFor(() => {
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });
  });

  it('renders background component', async () => {
    renderApp('/');

    await waitFor(() => {
      expect(screen.getByTestId('background')).toBeInTheDocument();
    });
  });

  it('renders skip to main content link', async () => {
    renderApp('/');

    await waitFor(() => {
      const skipLink = screen.getByRole('link', { name: /skip to main content/i });
      expect(skipLink).toBeInTheDocument();
      expect(skipLink).toHaveAttribute('href', '#main-content');
    });
  });

  it('renders main content with proper id', async () => {
    renderApp('/');

    await waitFor(() => {
      const main = screen.getByRole('main');
      expect(main).toHaveAttribute('id', 'main-content');
    });
  });
});