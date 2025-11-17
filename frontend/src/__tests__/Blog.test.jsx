import React from 'react';
import PropTypes from 'prop-types';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { toast } from 'react-hot-toast';
import Blog from '../pages/Blog';
import { blogAPI } from '../services/api';

// Mock the API
vi.mock('../services/api', () => ({
  blogAPI: {
    getBlogs: vi.fn(),
    createBlog: vi.fn(),
  },
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock react-hot-toast
vi.mock('react-hot-toast', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    toast: {
      error: vi.fn(),
      success: vi.fn(),
    },
    Toaster: () => <div data-testid="toaster" />,
  };
});

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Plus: () => <div data-testid="plus-icon" />,
  Search: () => <div data-testid="search-icon" />,
  Filter: () => <div data-testid="filter-icon" />,
  Heart: () => <div data-testid="heart-icon" />,
  MessageCircle: () => <div data-testid="message-circle-icon" />,
  Eye: () => <div data-testid="eye-icon" />,
  Calendar: () => <div data-testid="calendar-icon" />,
  User: () => <div data-testid="user-icon" />,
  Tag: () => <div data-testid="tag-icon" />,
  Edit: () => <div data-testid="edit-icon" />,
  Trash2: () => <div data-testid="trash2-icon" />,
  BookOpen: () => <div data-testid="book-open-icon" />,
}));

const AnimatePresence = ({ children }) => <>{children}</>;
AnimatePresence.propTypes = { children: PropTypes.node };

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence,
}));

const mockBlogs = [
  {
    _id: '1',
    title: 'Test Blog 1',
    content: 'This is test content 1',
    excerpt: 'Test excerpt 1',
    category: 'article',
    tags: ['test', 'blog'],
    authorName: 'Author 1',
    createdAt: '2023-01-01T00:00:00Z',
    readingTime: 5,
    likeCount: 10,
    commentCount: 5,
    views: 100,
    featuredImage: '/image1.jpg',
  },
  {
    _id: '2',
    title: 'Test Blog 2',
    content: 'This is test content 2',
    excerpt: 'Test excerpt 2',
    category: 'tutorial',
    tags: ['tutorial', 'guide'],
    authorName: 'Author 2',
    createdAt: '2023-01-02T00:00:00Z',
    readingTime: 8,
    likeCount: 15,
    commentCount: 8,
    views: 200,
  },
];

const renderBlog = () => {
  return render(
    <MemoryRouter>
      <Blog />
    </MemoryRouter>
  );
};

describe('Blog Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    blogAPI.getBlogs.mockResolvedValue({
      data: {
        blogs: mockBlogs,
      },
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Initial Rendering', () => {
    it('renders loading spinner initially', () => {
      renderBlog();
      expect(screen.getByText('', { selector: '.animate-spin' })).toBeInTheDocument();
    });

    it('renders blog posts after loading', async () => {
      renderBlog();

      await waitFor(() => {
        expect(screen.getByText('Test Blog 1')).toBeInTheDocument();
        expect(screen.getByText('Test Blog 2')).toBeInTheDocument();
      });
    });

    it('renders header with title and description', async () => {
      renderBlog();

      await waitFor(() => {
        expect(screen.getByText('Community Blog')).toBeInTheDocument();
        expect(screen.getByText('Share your knowledge, research, and insights with the community')).toBeInTheDocument();
      });
    });

    it('renders Write Article button', async () => {
      renderBlog();

      await waitFor(() => {
        expect(screen.getByText('Write Article')).toBeInTheDocument();
      });
    });
  });

  describe('Write Article Button and Modal', () => {
    it('opens create article modal when Write Article button is clicked', async () => {
      renderBlog();

      await waitFor(() => {
        const writeButton = screen.getByText('Write Article');
        fireEvent.click(writeButton);
      });

      expect(screen.getByText('Create New Article')).toBeInTheDocument();
      expect(screen.getByText('Title *')).toBeInTheDocument();
      expect(screen.getByText('Content *')).toBeInTheDocument();
    });

    it('closes modal when close button is clicked', async () => {
      renderBlog();

      await waitFor(() => {
        const writeButton = screen.getByText('Write Article');
        fireEvent.click(writeButton);
      });

      const closeButton = screen.getByText('✕');
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText('Create New Article')).not.toBeInTheDocument();
      });
    });
  });

  describe('Create Article Form', () => {
    beforeEach(async () => {
      renderBlog();

      await waitFor(() => {
        const writeButton = screen.getByText('Write Article');
        fireEvent.click(writeButton);
      });
    });

    it('validates required fields', async () => {
      const submitButton = screen.getByText('Publish Article');
      fireEvent.click(submitButton);

      // Form should not submit without required fields
      expect(blogAPI.createBlog).not.toHaveBeenCalled();
    });

    it('submits form with valid data', async () => {
      blogAPI.createBlog.mockResolvedValue({ data: { success: true } });

      const titleInput = screen.getByPlaceholderText('Enter article title');
      const contentTextarea = screen.getByPlaceholderText('Write your article content here...');
      const submitButton = screen.getByText('Publish Article');

      fireEvent.change(titleInput, { target: { value: 'New Article' } });
      fireEvent.change(contentTextarea, { target: { value: 'Article content' } });

      await act(async () => {
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(blogAPI.createBlog).toHaveBeenCalledWith({
          title: 'New Article',
          content: 'Article content',
          excerpt: '',
          category: 'article',
          tags: '',
        });
        expect(toast.success).toHaveBeenCalledWith('Blog post created successfully!');
      });
    });

    it('handles form submission errors', async () => {
      blogAPI.createBlog.mockRejectedValue(new Error('Create failed'));

      const titleInput = screen.getByPlaceholderText('Enter article title');
      const contentTextarea = screen.getByPlaceholderText('Write your article content here...');
      const submitButton = screen.getByText('Publish Article');

      fireEvent.change(titleInput, { target: { value: 'New Article' } });
      fireEvent.change(contentTextarea, { target: { value: 'Article content' } });

      await act(async () => {
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to create blog post');
      });
    });

    it('resets form after successful submission', async () => {
      blogAPI.createBlog.mockResolvedValue({ data: { success: true } });

      // Open modal and fill form
      await waitFor(() => {
        const writeButton = screen.getByText('Write Article');
        fireEvent.click(writeButton);
      });

      const titleInput = screen.getByPlaceholderText('Enter article title');
      const contentTextarea = screen.getByPlaceholderText('Write your article content here...');
      const submitButton = screen.getByText('Publish Article');

      fireEvent.change(titleInput, { target: { value: 'New Article' } });
      fireEvent.change(contentTextarea, { target: { value: 'Article content' } });

      await act(async () => {
        fireEvent.click(submitButton);
      });

      // Modal should close
      await waitFor(() => {
        expect(screen.queryByText('Create New Article')).not.toBeInTheDocument();
      });

      // Reopen modal to check form is reset
      const writeButton = screen.getByText('Write Article');
      fireEvent.click(writeButton);

      await waitFor(() => {
        const newTitleInput = screen.getByPlaceholderText('Enter article title');
        const newContentTextarea = screen.getByPlaceholderText('Write your article content here...');
        expect(newTitleInput.value).toBe('');
        expect(newContentTextarea.value).toBe('');
      });
    });
  });

  describe('Search Functionality', () => {
    it('renders search input', async () => {
      renderBlog();

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search articles...')).toBeInTheDocument();
      });
    });

    it('calls API with search parameter when typing', async () => {
      renderBlog();

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Search articles...');
        fireEvent.change(searchInput, { target: { value: 'test search' } });
      });

      // Wait for debounce (assuming 300ms delay in component)
      await waitFor(() => {
        expect(blogAPI.getBlogs).toHaveBeenCalledWith('?search=test+search');
      }, { timeout: 500 });
    });

    it('filters blogs based on search results', async () => {
      blogAPI.getBlogs.mockResolvedValue({
        data: {
          blogs: [mockBlogs[0]], // Only return first blog
        },
      });

      renderBlog();

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Search articles...');
        fireEvent.change(searchInput, { target: { value: 'Test Blog 1' } });
      });

      await waitFor(() => {
        expect(screen.getByText('Test Blog 1')).toBeInTheDocument();
        expect(screen.queryByText('Test Blog 2')).not.toBeInTheDocument();
      });
    });
  });

  describe('Category Filter', () => {
    it('renders category dropdown', async () => {
      renderBlog();

      await waitFor(() => {
        expect(screen.getByDisplayValue('All Categories')).toBeInTheDocument();
      });
    });

    it('calls API with category parameter when category is selected', async () => {
      renderBlog();

      await waitFor(() => {
        const categorySelect = screen.getByDisplayValue('All Categories');
        fireEvent.change(categorySelect, { target: { value: 'tutorial' } });
      });

      await waitFor(() => {
        expect(blogAPI.getBlogs).toHaveBeenCalledWith('?category=tutorial');
      });
    });

    it('filters blogs by category', async () => {
      blogAPI.getBlogs.mockResolvedValue({
        data: {
          blogs: [mockBlogs[1]], // Only tutorial blog
        },
      });

      renderBlog();

      await waitFor(() => {
        const categorySelect = screen.getByDisplayValue('All Categories');
        fireEvent.change(categorySelect, { target: { value: 'tutorial' } });
      });

      await waitFor(() => {
        expect(screen.getByText('Test Blog 2')).toBeInTheDocument();
        expect(screen.queryByText('Test Blog 1')).not.toBeInTheDocument();
      });
    });
  });

  describe('Read More Buttons', () => {
    it('navigates to individual blog post when Read More is clicked', async () => {
      renderBlog();

      await waitFor(() => {
        const readMoreButtons = screen.getAllByText('Read More →');
        fireEvent.click(readMoreButtons[0]);
      });

      expect(mockNavigate).toHaveBeenCalledWith('/blog/1');
    });
  });

  describe('Form Submission Buttons', () => {
    beforeEach(async () => {
      renderBlog();

      await waitFor(() => {
        const writeButton = screen.getByText('Write Article');
        fireEvent.click(writeButton);
      });
    });

    it('closes modal when Cancel button is clicked', async () => {
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByText('Create New Article')).not.toBeInTheDocument();
      });
    });

    it('handles Publish Article button click', async () => {
      blogAPI.createBlog.mockResolvedValue({ data: { success: true } });

      const titleInput = screen.getByPlaceholderText('Enter article title');
      const contentTextarea = screen.getByPlaceholderText('Write your article content here...');
      const publishButton = screen.getByText('Publish Article');

      fireEvent.change(titleInput, { target: { value: 'New Article' } });
      fireEvent.change(contentTextarea, { target: { value: 'Article content' } });
      fireEvent.click(publishButton);

      await waitFor(() => {
        expect(blogAPI.createBlog).toHaveBeenCalled();
      });
    });
  });

  describe('Loading States', () => {
    it('shows loading spinner during initial load', () => {
      renderBlog();
      expect(screen.getByText('', { selector: '.animate-spin' })).toBeInTheDocument();
    });

    it('hides loading spinner after data loads', async () => {
      renderBlog();

      await waitFor(() => {
        expect(screen.queryByText('', { selector: '.animate-spin' })).not.toBeInTheDocument();
      });
    });

    it('shows loading state during form submission', async () => {
      blogAPI.createBlog.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      renderBlog();

      await waitFor(() => {
        const writeButton = screen.getByText('Write Article');
        fireEvent.click(writeButton);
      });

      const titleInput = screen.getByPlaceholderText('Enter article title');
      const contentTextarea = screen.getByPlaceholderText('Write your article content here...');
      const publishButton = screen.getByText('Publish Article');

      fireEvent.change(titleInput, { target: { value: 'New Article' } });
      fireEvent.change(contentTextarea, { target: { value: 'Article content' } });
      fireEvent.click(publishButton);

      // Button should still be visible during loading
      expect(publishButton).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('shows error toast when blog fetch fails', async () => {
      // First render with success
      renderBlog();

      await waitFor(() => {
        expect(screen.getByText('Test Blog 1')).toBeInTheDocument();
      });

      // Now mock failure and trigger a new search
      blogAPI.getBlogs.mockRejectedValue(new Error('Network error'));

      const searchInput = screen.getByPlaceholderText('Search articles...');
      fireEvent.change(searchInput, { target: { value: 'test' } });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to load blogs');
      });
    });

    it('shows empty state when no blogs found', async () => {
      blogAPI.getBlogs.mockResolvedValue({
        data: {
          blogs: [],
        },
      });

      renderBlog();

      await waitFor(() => {
        expect(screen.getByText('No articles found')).toBeInTheDocument();
        expect(screen.getByText('Write First Article')).toBeInTheDocument();
      });
    });
  });

  describe('Blog Post Display', () => {
    it('renders blog post metadata correctly', async () => {
      renderBlog();

      await waitFor(() => {
        expect(screen.getByText('Author 1')).toBeInTheDocument();
        expect(screen.getByText('5 min read')).toBeInTheDocument();
        expect(screen.getByText('article')).toBeInTheDocument();
      });
    });

    it('renders blog post stats', async () => {
      renderBlog();

      await waitFor(() => {
        expect(screen.getByText('10')).toBeInTheDocument(); // likes
        expect(screen.getByText('5')).toBeInTheDocument(); // comments
        expect(screen.getByText('100')).toBeInTheDocument(); // views
      });
    });

    it('renders tags when available', async () => {
      renderBlog();

      await waitFor(() => {
        expect(screen.getByText('#test')).toBeInTheDocument();
        expect(screen.getByText('#blog')).toBeInTheDocument();
      });
    });

    it('renders featured image when available', async () => {
      renderBlog();

      await waitFor(() => {
        const images = screen.getAllByRole('img');
        const blogImage = images.find(img => img.getAttribute('src') === '/image1.jpg');
        expect(blogImage).toBeInTheDocument();
        expect(blogImage).toHaveAttribute('alt', 'Test Blog 1');
      });
    });
  });
});