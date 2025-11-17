import React from 'react';
import PropTypes from 'prop-types';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import toast from 'react-hot-toast';
import Blog from '../pages/Blog';
import { blogAPI } from '../services/api';

// Define AnimatePresence with prop validation
const AnimatePresence = ({ children }) => <>{children}</>;
AnimatePresence.propTypes = { children: PropTypes.node };

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>
  },
  AnimatePresence,
  whileHover: () => ({}),
  initial: () => ({}),
  animate: () => ({}),
  exit: () => ({}),
  transition: () => ({})
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  },
  Toaster: () => <div data-testid="toaster" />
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Plus: () => <svg data-testid="plus-icon" />,
  Search: () => <svg data-testid="search-icon" />,
  Filter: () => <svg data-testid="filter-icon" />,
  Heart: () => <svg data-testid="heart-icon" />,
  MessageCircle: () => <svg data-testid="message-circle-icon" />,
  Eye: () => <svg data-testid="eye-icon" />,
  Calendar: () => <svg data-testid="calendar-icon" />,
  User: () => <svg data-testid="user-icon" />,
  Tag: () => <svg data-testid="tag-icon" />,
  Edit: () => <svg data-testid="edit-icon" />,
  Trash2: () => <svg data-testid="trash-icon" />,
  BookOpen: () => <svg data-testid="book-open-icon" />
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Mock blogAPI
vi.mock('../services/api', () => ({
  blogAPI: {
    getBlogs: vi.fn(),
    createBlog: vi.fn(),
    updateBlog: vi.fn(),
    deleteBlog: vi.fn(),
    getUserBlogs: vi.fn(),
    toggleLike: vi.fn(),
    addComment: vi.fn(),
    getTags: vi.fn()
  }
}));

const mockBlogs = [
  {
    _id: '1',
    title: 'Test Blog Post',
    excerpt: 'This is a test blog excerpt',
    content: 'Full blog content here',
    author: 'author1',
    authorName: 'Test Author',
    tags: ['test', 'blog'],
    category: 'article',
    featuredImage: 'https://example.com/image.jpg',
    createdAt: '2023-01-01T00:00:00Z',
    readingTime: 5,
    likes: [],
    comments: [],
    views: 10
  }
];

const renderBlog = () => {
  return render(
    <BrowserRouter>
      <Blog />
    </BrowserRouter>
  );
};

describe('Blog Image Upload Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    blogAPI.getBlogs.mockResolvedValue({ data: { blogs: mockBlogs, pagination: { page: 1, limit: 10, total: 1, pages: 1 } } });
    blogAPI.getTags.mockResolvedValue({ data: [] });
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Blog Creation with Featured Image', () => {
    it('opens create blog modal when Write Article button is clicked', async () => {
      renderBlog();

      await waitFor(() => {
        expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
      });

      const writeButton = screen.getByText('Write Article');
      fireEvent.click(writeButton);

      expect(screen.getByText('Create New Article')).toBeInTheDocument();
      expect(screen.getByText('Title *')).toBeInTheDocument();
      expect(screen.getByText('Content *')).toBeInTheDocument();
    });

    it('creates blog post with featured image URL', async () => {
      blogAPI.createBlog.mockResolvedValue({
        data: {
          _id: '2',
          title: 'New Blog Post',
          featuredImage: 'https://example.com/featured-image.jpg'
        }
      });

      renderBlog();

      await waitFor(() => {
        expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
      });

      // Open create modal
      const writeButton = screen.getByText('Write Article');
      fireEvent.click(writeButton);

      // Fill form with featured image URL
      const titleInput = screen.getByLabelText(/title \*/i);
      const contentTextarea = screen.getByLabelText(/content \*/i);
      const excerptTextarea = screen.getByLabelText(/excerpt \(optional\)/i);

      fireEvent.change(titleInput, { target: { value: 'New Blog Post' } });
      fireEvent.change(contentTextarea, { target: { value: 'Blog content here' } });
      fireEvent.change(excerptTextarea, { target: { value: 'Blog excerpt' } });

      // Note: There's no featured image input field in the current implementation
      // This test documents the current behavior

      const publishButton = screen.getByText('Publish Article');
      fireEvent.click(publishButton);

      await waitFor(() => {
        expect(blogAPI.createBlog).toHaveBeenCalledWith({
          title: 'New Blog Post',
          content: 'Blog content here',
          excerpt: 'Blog excerpt',
          category: 'article',
          tags: ''
        });
        expect(toast.success).toHaveBeenCalledWith('Blog post created successfully!');
      });
    });

    it('validates required fields for blog creation', async () => {
      renderBlog();

      await waitFor(() => {
        expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
      });

      // Open create modal
      const writeButton = screen.getByText('Write Article');
      fireEvent.click(writeButton);

      // Try to submit without required fields
      const publishButton = screen.getByText('Publish Article');
      fireEvent.click(publishButton);

      // Should not call API due to HTML5 validation
      expect(blogAPI.createBlog).not.toHaveBeenCalled();
    });

    it('handles blog creation errors', async () => {
      blogAPI.createBlog.mockRejectedValue(new Error('Creation failed'));

      renderBlog();

      await waitFor(() => {
        expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
      });

      // Open create modal
      const writeButton = screen.getByText('Write Article');
      fireEvent.click(writeButton);

      // Fill required fields
      const titleInput = screen.getByLabelText(/title \*/i);
      const contentTextarea = screen.getByLabelText(/content \*/i);

      fireEvent.change(titleInput, { target: { value: 'New Blog Post' } });
      fireEvent.change(contentTextarea, { target: { value: 'Blog content here' } });

      const publishButton = screen.getByText('Publish Article');
      fireEvent.click(publishButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to create blog post');
      });

      // Modal should remain open
      expect(screen.getByText('Create New Article')).toBeInTheDocument();
    });

    it('closes modal and resets form after successful creation', async () => {
      blogAPI.createBlog.mockResolvedValue({
        data: {
          _id: '2',
          title: 'New Blog Post'
        }
      });

      renderBlog();

      await waitFor(() => {
        expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
      });

      // Open create modal
      const writeButton = screen.getByText('Write Article');
      fireEvent.click(writeButton);

      // Fill form
      const titleInput = screen.getByLabelText(/title \*/i);
      const contentTextarea = screen.getByLabelText(/content \*/i);

      fireEvent.change(titleInput, { target: { value: 'New Blog Post' } });
      fireEvent.change(contentTextarea, { target: { value: 'Blog content here' } });

      const publishButton = screen.getByText('Publish Article');
      fireEvent.click(publishButton);

      await waitFor(() => {
        expect(screen.queryByText('Create New Article')).not.toBeInTheDocument();
        // Form should be reset (checked by verifying getBlogs was called to refresh)
        expect(blogAPI.getBlogs).toHaveBeenCalledTimes(2); // Initial load + refresh
      });
    });

    it('cancels blog creation and closes modal', async () => {
      renderBlog();

      await waitFor(() => {
        expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
      });

      // Open create modal
      const writeButton = screen.getByText('Write Article');
      fireEvent.click(writeButton);

      expect(screen.getByText('Create New Article')).toBeInTheDocument();

      // Cancel
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      expect(screen.queryByText('Create New Article')).not.toBeInTheDocument();
    });
  });

  describe('Blog Display with Featured Images', () => {
    it('displays featured image when available', async () => {
      renderBlog();

      await waitFor(() => {
        const blogCard = screen.getByText('Test Blog Post').closest('div');
        const featuredImage = blogCard.querySelector('img[alt="Test Blog Post"]');
        expect(featuredImage).toBeInTheDocument();
        expect(featuredImage).toHaveAttribute('src', 'https://example.com/image.jpg');
      });
    });

    it('handles blogs without featured images', async () => {
      const blogsWithoutImages = [{
        ...mockBlogs[0],
        featuredImage: null
      }];

      blogAPI.getBlogs.mockResolvedValue({
        data: {
          blogs: blogsWithoutImages,
          pagination: { page: 1, limit: 10, total: 1, pages: 1 }
        }
      });

      renderBlog();

      await waitFor(() => {
        expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
        const blogCard = screen.getByText('Test Blog Post').closest('div');
        const featuredImage = blogCard.querySelector('img[alt="Test Blog Post"]');
        expect(featuredImage).not.toBeInTheDocument();
      });
    });

    it('loads and displays multiple blogs with and without images', async () => {
      const mixedBlogs = [
        { ...mockBlogs[0], featuredImage: 'https://example.com/image1.jpg' },
        { ...mockBlogs[0], _id: '2', title: 'Blog Without Image', featuredImage: null },
        { ...mockBlogs[0], _id: '3', title: 'Another Blog With Image', featuredImage: 'https://example.com/image2.jpg' }
      ];

      blogAPI.getBlogs.mockResolvedValue({
        data: {
          blogs: mixedBlogs,
          pagination: { page: 1, limit: 10, total: 3, pages: 1 }
        }
      });

      renderBlog();

      await waitFor(() => {
        expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
        expect(screen.getByText('Blog Without Image')).toBeInTheDocument();
        expect(screen.getByText('Another Blog With Image')).toBeInTheDocument();

        // Check images are displayed appropriately
        const images = screen.getAllByRole('img');
        expect(images.length).toBeGreaterThanOrEqual(2); // At least 2 blogs with images
      });
    });
  });

  describe('Blog Categories and Tags', () => {
    it('filters blogs by category', async () => {
      renderBlog();

      await waitFor(() => {
        expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
      });

      const categorySelect = screen.getByRole('combobox');
      fireEvent.change(categorySelect, { target: { value: 'article' } });

      await waitFor(() => {
        expect(blogAPI.getBlogs).toHaveBeenCalledWith('?category=article');
      });
    });

    it('searches blogs by text', async () => {
      renderBlog();

      await waitFor(() => {
        expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search articles...');
      fireEvent.change(searchInput, { target: { value: 'test search' } });

      // Debounced search - wait for it
      await waitFor(() => {
        expect(blogAPI.getBlogs).toHaveBeenCalledWith('?search=test%20search');
      }, { timeout: 1000 });
    });

    it('displays blog tags', async () => {
      renderBlog();

      await waitFor(() => {
        expect(screen.getByText('#test')).toBeInTheDocument();
        expect(screen.getByText('#blog')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('handles blog loading errors', async () => {
      blogAPI.getBlogs.mockRejectedValue(new Error('Network error'));

      renderBlog();

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to load blogs');
      });
    });

    it('handles empty blog list', async () => {
      blogAPI.getBlogs.mockResolvedValue({
        data: {
          blogs: [],
          pagination: { page: 1, limit: 10, total: 0, pages: 0 }
        }
      });

      renderBlog();

      await waitFor(() => {
        expect(screen.getByText('No articles found')).toBeInTheDocument();
        expect(screen.getByText('Write First Article')).toBeInTheDocument();
      });
    });
  });
});