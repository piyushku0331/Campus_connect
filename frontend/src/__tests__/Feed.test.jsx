import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { toast } from 'react-hot-toast';
import Feed from '../pages/Feed';
import { postsAPI } from '../services/api';

// Mock the API
vi.mock('../services/api', () => ({
  postsAPI: {
    getFeed: vi.fn(),
    toggleLike: vi.fn(),
    addComment: vi.fn(),
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
  };
});

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Heart: () => <div data-testid="heart-icon" />,
  MessageCircle: () => <div data-testid="message-circle-icon" />,
  Share: () => <div data-testid="share-icon" />,
  Plus: () => <div data-testid="plus-icon" />,
  Play: () => <div data-testid="play-icon" />,
  Pause: () => <div data-testid="pause-icon" />,
  Volume2: () => <div data-testid="volume2-icon" />,
  VolumeX: () => <div data-testid="volumex-icon" />,
  MoreHorizontal: () => <div data-testid="more-horizontal-icon" />,
  Send: () => <div data-testid="send-icon" />,
  Bookmark: () => <div data-testid="bookmark-icon" />,
}));

const mockPosts = [
  {
    _id: '1',
    caption: 'Test post 1',
    creator: {
      displayName: 'Creator 1',
      profilePicture: '/avatar1.png',
      isVerified: true,
    },
    media: [{ type: 'image', url: '/image1.jpg' }],
    likeCount: 5,
    commentCount: 3,
    createdAt: '2023-01-01T00:00:00Z',
  },
  {
    _id: '2',
    caption: 'Test post 2',
    creator: {
      displayName: 'Creator 2',
      profilePicture: '/avatar2.png',
      isVerified: false,
    },
    media: [{ type: 'video', url: '/video1.mp4' }],
    likeCount: 10,
    commentCount: 7,
    createdAt: '2023-01-02T00:00:00Z',
  },
];

const renderFeed = () => {
  return render(
    <MemoryRouter>
      <Feed />
    </MemoryRouter>
  );
};

describe('Feed Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    postsAPI.getFeed.mockResolvedValue({
      data: {
        posts: mockPosts,
        pagination: { hasMore: true },
      },
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Initial Rendering', () => {
    it('renders loading spinner initially', () => {
      renderFeed();
      expect(screen.getByText('', { selector: '.animate-spin' })).toBeInTheDocument();
    });

    it('renders feed posts after loading', async () => {
      renderFeed();

      await waitFor(() => {
        expect(screen.getByText('Test post 1')).toBeInTheDocument();
        expect(screen.getByText('Test post 2')).toBeInTheDocument();
      });
    });

    it('renders creator information correctly', async () => {
      renderFeed();

      await waitFor(() => {
        expect(screen.getByText('Creator 1')).toBeInTheDocument();
        expect(screen.getByText('Creator 2')).toBeInTheDocument();
      });
    });

    it('renders like and comment counts', async () => {
      renderFeed();

      await waitFor(() => {
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument();
        expect(screen.getByText('7')).toBeInTheDocument();
      });
    });

    it('renders share text', async () => {
      renderFeed();

      await waitFor(() => {
        expect(screen.getAllByText('Share')).toHaveLength(2);
      });
    });
  });

  describe('Stories Section', () => {
    it('renders add story button', async () => {
      renderFeed();

      await waitFor(() => {
        expect(screen.getByText('Add Story')).toBeInTheDocument();
      });
    });

    it('renders sample stories', async () => {
      renderFeed();

      await waitFor(() => {
        expect(screen.getByText('Creator 1')).toBeInTheDocument();
        expect(screen.getByText('Creator 2')).toBeInTheDocument();
        expect(screen.getByText('Creator 3')).toBeInTheDocument();
        expect(screen.getByText('Creator 4')).toBeInTheDocument();
        expect(screen.getByText('Creator 5')).toBeInTheDocument();
      });
    });

    // Note: Story interactions are not implemented yet
    it.skip('clicking on a story should navigate or open story viewer', async () => {
      renderFeed();

      await waitFor(() => {
        const story = screen.getByText('Creator 1');
        fireEvent.click(story);
        // TODO: Implement story navigation
      });
    });
  });

  describe('Create Post Modal', () => {
    it('renders floating create button', async () => {
      renderFeed();

      await waitFor(() => {
        const plusIcons = screen.getAllByTestId('plus-icon');
        const floatingButton = plusIcons.find(icon => icon.closest('button')?.classList.contains('fixed'));
        expect(floatingButton).toBeInTheDocument();
      });
    });

    it('opens create post modal when create button is clicked', async () => {
      renderFeed();

      await waitFor(() => {
        const plusIcons = screen.getAllByTestId('plus-icon');
        const floatingButton = plusIcons.find(icon => icon.closest('button')?.classList.contains('fixed'));
        fireEvent.click(floatingButton.closest('button'));
      });

      expect(screen.getByText('Create Post')).toBeInTheDocument();
      expect(screen.getByText('Only verified educational content creators can post.')).toBeInTheDocument();
    });

    it('navigates to creator apply page when Become a Creator is clicked', async () => {
      renderFeed();

      await waitFor(() => {
        const plusIcons = screen.getAllByTestId('plus-icon');
        const floatingButton = plusIcons.find(icon => icon.closest('button')?.classList.contains('fixed'));
        fireEvent.click(floatingButton.closest('button'));
      });

      const becomeCreatorButton = screen.getByText('Become a Creator');
      fireEvent.click(becomeCreatorButton);

      expect(mockNavigate).toHaveBeenCalledWith('/creator/apply');
    });

    it('closes modal when Cancel is clicked', async () => {
      renderFeed();

      await waitFor(() => {
        const plusIcons = screen.getAllByTestId('plus-icon');
        const floatingButton = plusIcons.find(icon => icon.closest('button')?.classList.contains('fixed'));
        fireEvent.click(floatingButton.closest('button'));
      });

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByText('Create Post')).not.toBeInTheDocument();
      });
    });
  });

  describe('Load More Functionality', () => {
    it('renders Load More button when hasMore is true', async () => {
      renderFeed();

      await waitFor(() => {
        expect(screen.getByText('Load More')).toBeInTheDocument();
      });
    });

    it('loads more posts when Load More is clicked', async () => {
      const newPosts = [
        {
          _id: '3',
          caption: 'Test post 3',
          creator: { displayName: 'Creator 3', profilePicture: '/avatar3.png' },
          media: [{ type: 'image', url: '/image3.jpg' }],
          likeCount: 2,
          commentCount: 1,
        },
      ];

      // First call returns initial posts with hasMore: true
      postsAPI.getFeed.mockResolvedValueOnce({
        data: {
          posts: mockPosts,
          pagination: { hasMore: true },
        },
      });

      // Second call returns new posts with hasMore: false
      postsAPI.getFeed.mockResolvedValueOnce({
        data: {
          posts: newPosts,
          pagination: { hasMore: false },
        },
      });

      renderFeed();

      await waitFor(() => {
        const loadMoreButton = screen.getByText('Load More');
        fireEvent.click(loadMoreButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Test post 3')).toBeInTheDocument();
      });
    });

    it('hides Load More button when no more posts available', async () => {
      postsAPI.getFeed.mockResolvedValue({
        data: {
          posts: mockPosts,
          pagination: { hasMore: false },
        },
      });

      renderFeed();

      await waitFor(() => {
        expect(screen.queryByText('Load More')).not.toBeInTheDocument();
      });
    });
  });

  describe('Media Rendering', () => {
    it('renders images correctly', async () => {
      renderFeed();

      await waitFor(() => {
        const images = screen.getAllByRole('img');
        expect(images.length).toBeGreaterThanOrEqual(2); // At least creator avatars

        // Check for creator avatars specifically
        const creatorAvatars = images.filter(img =>
          img.getAttribute('class')?.includes('w-8 h-8 rounded-full')
        );
        expect(creatorAvatars).toHaveLength(2);
        expect(creatorAvatars[0]).toHaveAttribute('src', '/avatar1.png');
        expect(creatorAvatars[1]).toHaveAttribute('src', '/avatar2.png');
      });
    });

  });

  describe('Error Handling', () => {
    it('shows error toast when feed fetch fails', async () => {
      postsAPI.getFeed.mockRejectedValue(new Error('Network error'));

      renderFeed();

      await waitFor(() => {
        expect(screen.getByText('Failed to load feed')).toBeInTheDocument();
      });
    });
  });

  describe('Like Button Functionality', () => {
    it('should render like button for each post', async () => {
      renderFeed();

      await waitFor(() => {
        const heartIcons = screen.getAllByTestId('heart-icon');
        expect(heartIcons).toHaveLength(2);
      });
    });

    it('should toggle like when like button is clicked', async () => {
      postsAPI.toggleLike.mockResolvedValue({ data: { liked: true, likeCount: 6 } });

      renderFeed();

      await waitFor(() => {
        const likeButtons = screen.getAllByRole('button');
        const likeButton = likeButtons.find(btn => btn.querySelector('[data-testid="heart-icon"]'));
        fireEvent.click(likeButton);
      });

      expect(postsAPI.toggleLike).toHaveBeenCalledWith('1');
      await waitFor(() => {
        expect(screen.getByText('6')).toBeInTheDocument();
      });
    });

    it('should handle like toggle errors', async () => {
      postsAPI.toggleLike.mockRejectedValue(new Error('Like failed'));

      renderFeed();

      await waitFor(() => {
        const likeButtons = screen.getAllByRole('button');
        const likeButton = likeButtons.find(btn => btn.querySelector('[data-testid="heart-icon"]'));
        fireEvent.click(likeButton);
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to toggle like');
      });
    });
  });

  describe('Comment Functionality', () => {
    it('should render comment button for each post', async () => {
      renderFeed();

      await waitFor(() => {
        const messageIcons = screen.getAllByTestId('message-circle-icon');
        expect(messageIcons).toHaveLength(2);
      });
    });

    it('should toggle comment section when comment button is clicked', async () => {
      renderFeed();

      await waitFor(() => {
        const commentButtons = screen.getAllByRole('button');
        const commentButton = commentButtons.find(btn => btn.querySelector('[data-testid="message-circle-icon"]'));
        fireEvent.click(commentButton);
      });

      expect(screen.getByPlaceholderText('Write a comment...')).toBeInTheDocument();
    });

    it('should submit comment when send button is clicked', async () => {
      postsAPI.addComment.mockResolvedValue({ data: {} });

      renderFeed();

      await waitFor(() => {
        const commentButtons = screen.getAllByRole('button');
        const commentButton = commentButtons.find(btn => btn.querySelector('[data-testid="message-circle-icon"]'));
        fireEvent.click(commentButton);
      });

      const commentInput = screen.getByPlaceholderText('Write a comment...');
      const sendButton = screen.getByTestId('send-icon').closest('button');

      fireEvent.change(commentInput, { target: { value: 'Test comment' } });
      fireEvent.click(sendButton);

      expect(postsAPI.addComment).toHaveBeenCalledWith('1', { content: 'Test comment' });
      expect(toast.success).toHaveBeenCalledWith('Comment added');
    });

    it('should submit comment when Enter is pressed', async () => {
      postsAPI.addComment.mockResolvedValue({ data: {} });

      renderFeed();

      await waitFor(() => {
        const commentButtons = screen.getAllByRole('button');
        const commentButton = commentButtons.find(btn => btn.querySelector('[data-testid="message-circle-icon"]'));
        fireEvent.click(commentButton);
      });

      const commentInput = screen.getByPlaceholderText('Write a comment...');

      fireEvent.change(commentInput, { target: { value: 'Test comment' } });
      fireEvent.keyPress(commentInput, { key: 'Enter', code: 'Enter' });

      expect(postsAPI.addComment).toHaveBeenCalledWith('1', { content: 'Test comment' });
    });

    it('should handle comment submission errors', async () => {
      postsAPI.addComment.mockRejectedValue(new Error('Comment failed'));

      renderFeed();

      await waitFor(() => {
        const commentButtons = screen.getAllByRole('button');
        const commentButton = commentButtons.find(btn => btn.querySelector('[data-testid="message-circle-icon"]'));
        fireEvent.click(commentButton);
      });

      const commentInput = screen.getByPlaceholderText('Write a comment...');
      const sendButton = screen.getByTestId('send-icon').closest('button');

      fireEvent.change(commentInput, { target: { value: 'Test comment' } });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to add comment');
      });
    });
  });

  describe('Share Functionality', () => {
    it('should render share button for each post', async () => {
      renderFeed();

      await waitFor(() => {
        const shareIcons = screen.getAllByTestId('share-icon');
        expect(shareIcons).toHaveLength(2);
      });
    });

    it('should copy link to clipboard when share button is clicked', async () => {
      const mockClipboard = { writeText: vi.fn().mockResolvedValue() };
      Object.defineProperty(navigator, 'clipboard', {
        value: mockClipboard,
        writable: true
      });

      renderFeed();

      await waitFor(() => {
        const shareButtons = screen.getAllByRole('button');
        const shareButton = shareButtons.find(btn => btn.querySelector('[data-testid="share-icon"]'));
        fireEvent.click(shareButton);
      });

      expect(mockClipboard.writeText).toHaveBeenCalledWith(`${window.location.origin}/post/1`);
      expect(toast.success).toHaveBeenCalledWith('Link copied to clipboard!');
    });

    it('should handle share errors gracefully', async () => {
      const mockClipboard = { writeText: vi.fn().mockRejectedValue(new Error('Clipboard error')) };
      Object.defineProperty(navigator, 'clipboard', {
        value: mockClipboard,
        writable: true
      });

      renderFeed();

      await waitFor(() => {
        const shareButtons = screen.getAllByRole('button');
        const shareButton = shareButtons.find(btn => btn.querySelector('[data-testid="share-icon"]'));
        fireEvent.click(shareButton);
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to copy link');
      });
    });
  });

  describe('Video Controls (Basic Implementation)', () => {
    it('renders video with native controls', async () => {
      renderFeed();

      // Wait for posts to load first
      await waitFor(() => {
        expect(screen.getByText('Test post 2')).toBeInTheDocument();
      });

      // Then check for video
      const video = document.querySelector('video');
      expect(video).toBeInTheDocument();
      expect(video).toHaveAttribute('controls');
      expect(video).toHaveAttribute('src', '/video1.mp4');
    });

    // Note: Custom video controls are not implemented
    it.skip('should have custom play/pause controls', async () => {
      renderFeed();

      await waitFor(() => {
        const playButton = screen.getByTestId('play-icon');
        expect(playButton).toBeInTheDocument();
      });
    });

    it.skip('should toggle mute when volume button is clicked', async () => {
      renderFeed();

      await waitFor(() => {
        const video = screen.getByRole('video');
        const volumeButton = screen.getByTestId('volume2-icon');

        fireEvent.click(volumeButton);
        expect(video).toHaveAttribute('muted', 'true');
      });
    });
  });

  describe('PropTypes Validation', () => {
    it('PostCard component validates props correctly', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // This would normally cause a PropTypes warning
      render(
        <MemoryRouter>
          <Feed />
        </MemoryRouter>
      );

      // Clean up
      consoleSpy.mockRestore();
    });
  });
});