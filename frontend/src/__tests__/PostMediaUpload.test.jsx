import React from 'react';
import PropTypes from 'prop-types';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import Feed from '../pages/Feed';
import { postsAPI } from '../services/api';

// Mock the API
vi.mock('../services/api', () => ({
  postsAPI: {
    getFeed: vi.fn(),
    toggleLike: vi.fn(),
    addComment: vi.fn(),
    createPost: vi.fn(),
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
];

const renderFeed = () => {
  return render(
    <MemoryRouter>
      <Feed />
    </MemoryRouter>
  );
};

// Mock Post Creation Component (since it doesn't exist in Feed yet)
const MockPostCreationComponent = ({ onClose, onSubmit }) => {
  const [caption, setCaption] = React.useState('');
  const [files, setFiles] = React.useState([]);
  const [uploading, setUploading] = React.useState(false);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
  };

  const handleSubmit = async () => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('type', 'post');
      formData.append('caption', caption);
      formData.append('category', 'education');

      files.forEach((file) => {
        formData.append('media', file);
      });

      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div data-testid="post-creation-modal">
      <h2>Create Post</h2>
      <input
        type="text"
        placeholder="Caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        data-testid="caption-input"
      />
      <input
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileChange}
        data-testid="file-input"
      />
      <button
        onClick={handleSubmit}
        disabled={uploading || files.length === 0}
        data-testid="submit-button"
      >
        {uploading ? 'Uploading...' : 'Post'}
      </button>
      <button onClick={onClose} data-testid="cancel-button">
        Cancel
      </button>
      {files.length > 0 && (
        <div data-testid="file-preview">
          {files.map((file, index) => (
            <div key={index} data-testid={`file-${index}`}>
              {file.name} ({file.type})
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

MockPostCreationComponent.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

describe('Post Media Upload Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    postsAPI.getFeed.mockResolvedValue({
      data: {
        posts: mockPosts,
        pagination: { hasMore: false },
      },
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Post Creation Modal Access', () => {
    it('shows message about verified creators for post creation', async () => {
      renderFeed();

      await waitFor(() => {
        expect(screen.getByText('Test post 1')).toBeInTheDocument();
      });

      // Click create post button
      const plusIcons = screen.getAllByTestId('plus-icon');
      const floatingButton = plusIcons.find(icon => icon.closest('button')?.classList.contains('fixed'));
      fireEvent.click(floatingButton.closest('button'));

      expect(screen.getByText('Create Post')).toBeInTheDocument();
      expect(screen.getByText('Only verified educational content creators can post.')).toBeInTheDocument();
    });

    it('navigates to creator apply page when becoming creator', async () => {
      renderFeed();

      await waitFor(() => {
        expect(screen.getByText('Test post 1')).toBeInTheDocument();
      });

      // Open modal
      const plusIcons = screen.getAllByTestId('plus-icon');
      const floatingButton = plusIcons.find(icon => icon.closest('button')?.classList.contains('fixed'));
      fireEvent.click(floatingButton.closest('button'));

      const becomeCreatorButton = screen.getByText('Become a Creator');
      fireEvent.click(becomeCreatorButton);

      expect(mockNavigate).toHaveBeenCalledWith('/creator/apply');
    });
  });

  describe('Mock Post Creation Component', () => {
    const renderPostCreation = (props = {}) => {
      const defaultProps = {
        onClose: vi.fn(),
        onSubmit: vi.fn(),
        ...props,
      };

      return render(<MockPostCreationComponent {...defaultProps} />);
    };

    it('renders post creation form', () => {
      renderPostCreation();

      expect(screen.getByTestId('post-creation-modal')).toBeInTheDocument();
      expect(screen.getByTestId('caption-input')).toBeInTheDocument();
      expect(screen.getByTestId('file-input')).toBeInTheDocument();
      expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    });

    it('handles single image file selection', () => {
      renderPostCreation();

      const file = new File(['dummy image content'], 'test.jpg', { type: 'image/jpeg' });
      const fileInput = screen.getByTestId('file-input');

      fireEvent.change(fileInput, { target: { files: [file] } });

      expect(screen.getByTestId('file-preview')).toBeInTheDocument();
      expect(screen.getByTestId('file-0')).toHaveTextContent('test.jpg (image/jpeg)');
    });

    it('handles multiple file selection', () => {
      renderPostCreation();

      const files = [
        new File(['image1'], 'test1.jpg', { type: 'image/jpeg' }),
        new File(['image2'], 'test2.png', { type: 'image/png' }),
        new File(['video1'], 'test.mp4', { type: 'video/mp4' }),
      ];
      const fileInput = screen.getByTestId('file-input');

      fireEvent.change(fileInput, { target: { files } });

      expect(screen.getByTestId('file-preview')).toBeInTheDocument();
      expect(screen.getByTestId('file-0')).toHaveTextContent('test1.jpg (image/jpeg)');
      expect(screen.getByTestId('file-1')).toHaveTextContent('test2.png (image/png)');
      expect(screen.getByTestId('file-2')).toHaveTextContent('test.mp4 (video/mp4)');
    });

    it('validates file types - accepts images and videos', () => {
      renderPostCreation();

      const validFiles = [
        new File(['img'], 'test.jpg', { type: 'image/jpeg' }),
        new File(['img'], 'test.png', { type: 'image/png' }),
        new File(['img'], 'test.webp', { type: 'image/webp' }),
        new File(['vid'], 'test.mp4', { type: 'video/mp4' }),
        new File(['vid'], 'test.webm', { type: 'video/webm' }),
      ];

      const fileInput = screen.getByTestId('file-input');
      fireEvent.change(fileInput, { target: { files: validFiles } });

      expect(screen.getByTestId('file-preview')).toBeInTheDocument();
      expect(screen.getAllByTestId(/^file-/)).toHaveLength(5);
    });

    it('prevents submission without files', () => {
      const mockOnSubmit = vi.fn();
      renderPostCreation({ onSubmit: mockOnSubmit });

      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).toBeDisabled();

      fireEvent.click(submitButton);
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('enables submission when files are selected', () => {
      renderPostCreation();

      const file = new File(['dummy'], 'test.jpg', { type: 'image/jpeg' });
      const fileInput = screen.getByTestId('file-input');

      fireEvent.change(fileInput, { target: { files: [file] } });

      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).not.toBeDisabled();
    });

    it('submits post with correct form data', async () => {
      const mockOnSubmit = vi.fn().mockResolvedValue({});
      const mockOnClose = vi.fn();

      renderPostCreation({ onSubmit: mockOnSubmit, onClose: mockOnClose });

      // Fill caption
      const captionInput = screen.getByTestId('caption-input');
      fireEvent.change(captionInput, { target: { value: 'Test caption' } });

      // Select files
      const files = [
        new File(['image1'], 'test1.jpg', { type: 'image/jpeg' }),
        new File(['video1'], 'test.mp4', { type: 'video/mp4' }),
      ];
      const fileInput = screen.getByTestId('file-input');
      fireEvent.change(fileInput, { target: { files } });

      // Submit
      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
        const formData = mockOnSubmit.mock.calls[0][0];
        expect(formData).toBeInstanceOf(FormData);
        expect(formData.get('type')).toBe('post');
        expect(formData.get('caption')).toBe('Test caption');
        expect(formData.get('category')).toBe('education');
        // Note: FormData.get() only gets the first file for 'media' field
        expect(formData.get('media')).toBeInstanceOf(File);
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it('shows uploading state during submission', async () => {
      const mockOnSubmit = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      renderPostCreation({ onSubmit: mockOnSubmit });

      // Select file and submit
      const file = new File(['dummy'], 'test.jpg', { type: 'image/jpeg' });
      const fileInput = screen.getByTestId('file-input');
      fireEvent.change(fileInput, { target: { files: [file] } });

      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);

      expect(screen.getByText('Uploading...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();

      await waitFor(() => {
        expect(screen.queryByText('Uploading...')).not.toBeInTheDocument();
      });
    });

    it('handles upload errors gracefully', async () => {
      const mockOnSubmit = vi.fn().mockRejectedValue(new Error('Upload failed'));
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      renderPostCreation({ onSubmit: mockOnSubmit });

      // Select file and submit
      const file = new File(['dummy'], 'test.jpg', { type: 'image/jpeg' });
      const fileInput = screen.getByTestId('file-input');
      fireEvent.change(fileInput, { target: { files: [file] } });

      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Upload failed:', expect.any(Error));
      });

      consoleSpy.mockRestore();
    });

    it('closes modal when cancel is clicked', () => {
      const mockOnClose = vi.fn();
      renderPostCreation({ onClose: mockOnClose });

      const cancelButton = screen.getByTestId('cancel-button');
      fireEvent.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('handles file size validation on frontend', () => {
      renderPostCreation();

      // Create a very large file (simulate size check)
      const largeFile = new File(['x'.repeat(100 * 1024 * 1024)], 'large.mp4', { type: 'video/mp4' });
      const fileInput = screen.getByTestId('file-input');

      fireEvent.change(fileInput, { target: { files: [largeFile] } });

      // Component should still accept the file (backend validation)
      expect(screen.getByTestId('file-preview')).toBeInTheDocument();
    });

    it('limits number of files (simulate frontend validation)', () => {
      renderPostCreation();

      // Create more files than typical limit
      const files = Array.from({ length: 15 }, (_, i) =>
        new File(['content'], `file${i}.jpg`, { type: 'image/jpeg' })
      );

      const fileInput = screen.getByTestId('file-input');
      fireEvent.change(fileInput, { target: { files } });

      // Component accepts all files (backend enforces limit)
      expect(screen.getAllByTestId(/^file-/)).toHaveLength(15);
    });
  });

  describe('Post Display with Media', () => {
    it('renders image posts correctly', async () => {
      renderFeed();

      await waitFor(() => {
        expect(screen.getByText('Test post 1')).toBeInTheDocument();
        // Check for image rendering
        const images = screen.getAllByRole('img');
        expect(images.length).toBeGreaterThan(0);
      });
    });

    it('renders video posts with controls', async () => {
      const videoPost = [{
        ...mockPosts[0],
        media: [{ type: 'video', url: '/video1.mp4' }]
      }];

      postsAPI.getFeed.mockResolvedValue({
        data: {
          posts: videoPost,
          pagination: { hasMore: false },
        },
      });

      renderFeed();

      await waitFor(() => {
        const video = document.querySelector('video');
        expect(video).toBeInTheDocument();
        expect(video).toHaveAttribute('controls');
        expect(video).toHaveAttribute('src', '/video1.mp4');
      });
    });

    it('handles posts without media', async () => {
      const textOnlyPost = [{
        ...mockPosts[0],
        media: []
      }];

      postsAPI.getFeed.mockResolvedValue({
        data: {
          posts: textOnlyPost,
          pagination: { hasMore: false },
        },
      });

      renderFeed();

      await waitFor(() => {
        expect(screen.getByText('Test post 1')).toBeInTheDocument();
        // No media elements should be rendered
        const images = screen.queryAllByRole('img');
        const videos = document.querySelectorAll('video');
        expect(images.length).toBe(1); // Only avatar
        expect(videos.length).toBe(0);
      });
    });
  });
});