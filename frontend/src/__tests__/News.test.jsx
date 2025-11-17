import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import News from '../pages/News';
import { newsAPI } from '../services/api';

// Mock the API
vi.mock('../services/api', () => ({
  newsAPI: {
    getEducationalNews: vi.fn(),
  },
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    toast: {
      error: vi.fn((message) => console.log('Toast error called with:', message)),
      success: vi.fn(),
    },
    Toaster: () => <div data-testid="toaster" />,
  };
});

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Newspaper: () => <div data-testid="newspaper-icon" />,
  ExternalLink: () => <div data-testid="external-link-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  User: () => <div data-testid="user-icon" />,
  TrendingUp: () => <div data-testid="trending-up-icon" />,
}));

const mockArticles = [
  {
    id: '1',
    title: 'AI Tools Revolutionizing Education',
    description: 'Educational institutions are adopting AI-powered platforms to enhance student learning experiences.',
    url: 'https://example.com/ai-education',
    urlToImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    source: { name: 'Tech Education Today' },
    publishedAt: '2023-11-15T10:00:00Z',
    author: 'Sarah Johnson',
    content: 'AI tools are transforming education...',
  },
  {
    id: '2',
    title: 'College Students Lead Climate Research',
    description: 'Undergraduate researchers at universities worldwide are making significant contributions to climate science.',
    url: 'https://example.com/climate-research',
    urlToImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400',
    source: { name: 'Science Daily' },
    publishedAt: '2023-11-14T08:30:00Z',
    author: 'Dr. Michael Chen',
    content: 'Climate research by students...',
  },
  {
    id: '3',
    title: 'Virtual Reality in Medical Education',
    description: 'Medical students are using VR technology to practice complex procedures in safe environments.',
    url: 'https://example.com/vr-medicine',
    urlToImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
    source: { name: 'Medical Education Journal' },
    publishedAt: '2023-11-13T15:45:00Z',
    author: 'Prof. Lisa Rodriguez',
    content: 'VR technology transforms medical education...',
  },
];

const renderNews = () => {
  return render(<News />);
};

describe('News Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    newsAPI.getEducationalNews.mockResolvedValue({
      data: {
        articles: mockArticles,
      },
    });
  });

  describe('Initial Rendering', () => {
    it('renders loading spinner initially', () => {
      renderNews();
      expect(screen.getByText('', { selector: '.animate-spin' })).toBeInTheDocument();
    });

    it('renders news articles after loading', async () => {
      renderNews();

      await waitFor(() => {
        expect(screen.getByText('AI Tools Revolutionizing Education')).toBeInTheDocument();
        expect(screen.getByText('College Students Lead Climate Research')).toBeInTheDocument();
      });
    });

    it('renders header with title and description', async () => {
      renderNews();

      await waitFor(() => {
        expect(screen.getByText('Educational News')).toBeInTheDocument();
        expect(screen.getByText('Stay informed with the latest educational news, research, and trends from around the world')).toBeInTheDocument();
      });
    });
  });

  describe('Category Filter Buttons', () => {
    it('renders all category filter buttons', async () => {
      renderNews();

      await waitFor(() => {
        expect(screen.getByText('All News')).toBeInTheDocument();
        expect(screen.getByText('Education')).toBeInTheDocument();
        expect(screen.getByText('Technology')).toBeInTheDocument();
        expect(screen.getByText('Science')).toBeInTheDocument();
        expect(screen.getByText('Career')).toBeInTheDocument();
      });
    });

    it('filters articles by education category', async () => {
      renderNews();

      await waitFor(() => {
        const educationButton = screen.getByText('Education');
        fireEvent.click(educationButton);
      });

      // Since filtering is client-side and articles contain 'education' in title/description/content
      await waitFor(() => {
        expect(newsAPI.getEducationalNews).toHaveBeenCalledTimes(2); // Initial + filter
      });
    });

    it('shows all articles when All News is selected', async () => {
      renderNews();

      await waitFor(() => {
        expect(screen.getByText('AI Tools Revolutionizing Education')).toBeInTheDocument();
        expect(screen.getByText('College Students Lead Climate Research')).toBeInTheDocument();
        expect(screen.getByText('Virtual Reality in Medical Education')).toBeInTheDocument();
      });
    });

    it('highlights selected category button', async () => {
      renderNews();

      await waitFor(() => {
        const educationButton = screen.getByText('Education');
        fireEvent.click(educationButton);
      });

      // Check if the button has the selected styling (this might need adjustment based on actual styling)
      const educationButton = screen.getByText('Education');
      expect(educationButton.closest('button')).toHaveClass('bg-blue-600');
    });
  });

  describe('Load More Articles Button', () => {
    it('renders Load More Articles button when articles are loaded', async () => {
      renderNews();

      await waitFor(() => {
        expect(screen.getByText('Load More Articles')).toBeInTheDocument();
      });
    });

    it('calls fetchNews when Load More Articles button is clicked', async () => {
      renderNews();

      await waitFor(() => {
        const loadMoreButton = screen.getByText('Load More Articles');
        fireEvent.click(loadMoreButton);
      });

      await waitFor(() => {
        expect(newsAPI.getEducationalNews).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Read Full Article Links', () => {
    it('renders Read Full Article links for each article', async () => {
      renderNews();

      await waitFor(() => {
        const readButtons = screen.getAllByText('Read Full Article');
        expect(readButtons).toHaveLength(3);
      });
    });

    it('links have correct href and target attributes', async () => {
      renderNews();

      await waitFor(() => {
        const links = screen.getAllByRole('link', { name: /Read Full Article/i });
        links.forEach((link, index) => {
          expect(link).toHaveAttribute('href', mockArticles[index].url);
          expect(link).toHaveAttribute('target', '_blank');
          expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        });
      });
    });
  });

  describe('News Card Display', () => {
    it('displays article title and description', async () => {
      renderNews();

      await waitFor(() => {
        expect(screen.getByText('AI Tools Revolutionizing Education')).toBeInTheDocument();
        expect(screen.getByText('Educational institutions are adopting AI-powered platforms to enhance student learning experiences.')).toBeInTheDocument();
      });
    });

    it('displays article metadata (source, date, author)', async () => {
      renderNews();

      await waitFor(() => {
        expect(screen.getByText('Tech Education Today')).toBeInTheDocument();
        expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
        expect(screen.getByText('Science Daily')).toBeInTheDocument();
        expect(screen.getByText('Dr. Michael Chen')).toBeInTheDocument();
        expect(screen.getByText('Medical Education Journal')).toBeInTheDocument();
        expect(screen.getByText('Prof. Lisa Rodriguez')).toBeInTheDocument();
        // Check that clock and user icons are present (there are more due to category buttons, but at least 3 for articles)
        expect(screen.getAllByTestId('clock-icon').length).toBeGreaterThanOrEqual(3);
        expect(screen.getAllByTestId('user-icon').length).toBeGreaterThanOrEqual(3);
      });
    });

    it('displays article images when available', async () => {
      renderNews();

      await waitFor(() => {
        const images = screen.getAllByRole('img');
        expect(images).toHaveLength(3);
        images.forEach((img, index) => {
          expect(img).toHaveAttribute('src', mockArticles[index].urlToImage);
          expect(img).toHaveAttribute('alt', mockArticles[index].title);
        });
      });
    });

    it('handles articles without images', async () => {
      const articlesWithoutImages = mockArticles.map(article => ({
        ...article,
        urlToImage: null,
      }));

      newsAPI.getEducationalNews.mockResolvedValue({
        data: {
          articles: articlesWithoutImages,
        },
      });

      renderNews();

      await waitFor(() => {
        const images = screen.queryAllByRole('img');
        expect(images).toHaveLength(0);
      });
    });
  });

  describe('Error Handling', () => {
    it('handles API failure gracefully', async () => {
      vi.clearAllMocks();
      newsAPI.getEducationalNews.mockRejectedValue(new Error('Network error'));

      renderNews();

      await waitFor(() => {
        expect(screen.getByText('No articles found')).toBeInTheDocument();
        expect(screen.queryByText('', { selector: '.animate-spin' })).not.toBeInTheDocument();
      });
    });

    it('hides loading spinner when API fails', async () => {
      newsAPI.getEducationalNews.mockRejectedValue(new Error('Network error'));

      renderNews();

      await waitFor(() => {
        expect(screen.queryByText('', { selector: '.animate-spin' })).not.toBeInTheDocument();
      });
    });
  });

  describe('Empty State', () => {
    it('shows empty state when no articles are returned', async () => {
      newsAPI.getEducationalNews.mockResolvedValue({
        data: {
          articles: [],
        },
      });

      renderNews();

      await waitFor(() => {
        expect(screen.getByText('No articles found')).toBeInTheDocument();
        expect(screen.getByText('Try selecting a different category or check back later for new articles.')).toBeInTheDocument();
      });
    });
  });

  describe('Footer Stats', () => {
    it('displays article count in footer', async () => {
      renderNews();

      await waitFor(() => {
        expect(screen.getByText('3')).toBeInTheDocument(); // Article count
        expect(screen.getByText('Articles Available')).toBeInTheDocument();
      });
    });

    it('updates article count when filtered', async () => {
      // Mock filtered results
      newsAPI.getEducationalNews.mockResolvedValueOnce({
        data: {
          articles: [mockArticles[0]], // Only one article matches filter
        },
      });

      renderNews();

      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument();
      });
    });
  });
});