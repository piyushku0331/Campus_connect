/* global global */
import PropTypes from 'prop-types';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import toast from 'react-hot-toast';
import Profile from '../pages/Profile';
import { usersAPI } from '../services/api';

// Mock all external dependencies
vi.mock('framer-motion', () => {
  const AnimatePresence = ({ children }) => <>{children}</>;
  AnimatePresence.propTypes = { children: PropTypes.node };

  return {
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
  };
});

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  },
  Toaster: () => <div data-testid="toaster" />
}));

vi.mock('lucide-react', () => ({
  User: () => <svg data-testid="user-icon" />,
  Edit3: () => <svg data-testid="edit-icon" />,
  Save: () => <svg data-testid="save-icon" />,
  X: () => <svg data-testid="cancel-icon" />,
  Eye: () => <svg data-testid="eye-icon" />,
  EyeOff: () => <svg data-testid="eye-off-icon" />,
  Camera: () => <svg data-testid="camera-icon" />,
  Github: () => <svg data-testid="github-icon" />,
  Linkedin: () => <svg data-testid="linkedin-icon" />,
  Globe: () => <svg data-testid="globe-icon" />,
  MapPin: () => <svg data-testid="map-pin-icon" />,
  Calendar: () => <svg data-testid="calendar-icon" />,
  Award: () => <svg data-testid="award-icon" />,
  Users: () => <svg data-testid="users-icon" />
}));

// Mock URL for image preview
const mockCreateObjectURL = vi.fn();
const mockRevokeObjectURL = vi.fn();
globalThis.URL.createObjectURL = mockCreateObjectURL;
globalThis.URL.revokeObjectURL = mockRevokeObjectURL;

// Mock fetch for API calls
global.fetch = vi.fn();

const mockUserData = {
  id: 1,
  name: 'John Doe',
  bio: 'A passionate developer',
  department: 'Computer Science',
  semester: '6th',
  campus: 'Chitkara University',
  year: '2024',
  phone: '+1234567890',
  linkedin: 'https://linkedin.com/in/johndoe',
  github: 'https://github.com/johndoe',
  website: 'https://johndoe.com',
  skills: ['JavaScript', 'React', 'Node.js'],
  interests: ['AI', 'Web Development'],
  profilePhoto: '/profile.jpg',
  isPublic: true,
  points: 150
};

const renderProfile = () => {
  return render(
    <BrowserRouter>
      <Profile />
    </BrowserRouter>
  );
};

describe('File Upload Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateObjectURL.mockReturnValue('mock-preview-url');

    // Mock successful API responses
    usersAPI.getProfile.mockResolvedValue({ data: mockUserData });
    usersAPI.updateProfile.mockResolvedValue({ data: mockUserData });
    usersAPI.togglePrivacy.mockResolvedValue({ data: { isPublic: false } });
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Complete Profile Image Upload Flow', () => {
    it('successfully uploads profile image from selection to save', async () => {
      renderProfile();

      // Wait for profile to load
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      fireEvent.click(editButton);

      // Verify edit mode is active
      expect(screen.getByText('Full Name')).toBeInTheDocument();

      // Select an image file
      const file = new File(['fake-image-data'], 'profile.jpg', { type: 'image/jpeg' });
      const fileInput = screen.getByLabelText(/camera/i).closest('label').querySelector('input');

      fireEvent.change(fileInput, { target: { files: [file] } });

      // Verify preview is created
      expect(mockCreateObjectURL).toHaveBeenCalledWith(file);
      expect(screen.getByAltText('Profile')).toHaveAttribute('src', 'mock-preview-url');

      // Modify other profile data
      const nameInput = screen.getByLabelText(/full name/i);
      fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });

      // Save the profile
      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      // Verify API was called with FormData
      await waitFor(() => {
        expect(usersAPI.updateProfile).toHaveBeenCalledTimes(1);
        const formDataArg = usersAPI.updateProfile.mock.calls[0][0];
        expect(formDataArg).toBeInstanceOf(FormData);
        expect(formDataArg.get('name')).toBe('Jane Doe');
        expect(formDataArg.get('profilePicture')).toBe(file);
      });

      // Verify success message
      expect(toast.success).toHaveBeenCalledWith('Profile updated successfully!');

      // Verify edit mode is exited
      expect(screen.queryByText('Full Name')).not.toBeInTheDocument();
    });

    it('handles file upload errors during save', async () => {
      // Mock API error
      usersAPI.updateProfile.mockRejectedValue({
        response: { status: 400, data: { error: 'File too large' } }
      });

      renderProfile();

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Enter edit mode and select file
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      fireEvent.click(editButton);

      const file = new File(['large-file-data'], 'large.jpg', { type: 'image/jpeg' });
      const fileInput = screen.getByLabelText(/camera/i).closest('label').querySelector('input');
      fireEvent.change(fileInput, { target: { files: [file] } });

      // Attempt to save
      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      // Verify error handling
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to update profile');
        // Should remain in edit mode
        expect(screen.getByText('Full Name')).toBeInTheDocument();
      });
    });

    it('cancels image upload and reverts changes', async () => {
      renderProfile();

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      fireEvent.click(editButton);

      // Select file and modify name
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const fileInput = screen.getByLabelText(/camera/i).closest('label').querySelector('input');
      fireEvent.change(fileInput, { target: { files: [file] } });

      const nameInput = screen.getByLabelText(/full name/i);
      fireEvent.change(nameInput, { target: { value: 'Changed Name' } });

      // Cancel changes
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      // Verify reverted to original state
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Full Name')).not.toBeInTheDocument();

      // Verify object URL was revoked
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('mock-preview-url');
    });

    it('handles network errors gracefully', async () => {
      usersAPI.updateProfile.mockRejectedValue(new Error('Network error'));

      renderProfile();

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Enter edit mode and make changes
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      fireEvent.click(editButton);

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const fileInput = screen.getByLabelText(/camera/i).closest('label').querySelector('input');
      fireEvent.change(fileInput, { target: { files: [file] } });

      // Save
      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to update profile');
      });
    });

    it('preserves form data when image upload fails', async () => {
      usersAPI.updateProfile.mockRejectedValue(new Error('Upload failed'));

      renderProfile();

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      fireEvent.click(editButton);

      // Fill form with data
      const nameInput = screen.getByLabelText(/full name/i);
      const bioTextarea = screen.getByLabelText(/bio/i);
      fireEvent.change(nameInput, { target: { value: 'Updated Name' } });
      fireEvent.change(bioTextarea, { target: { value: 'Updated bio' } });

      // Select file
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const fileInput = screen.getByLabelText(/camera/i).closest('label').querySelector('input');
      fireEvent.change(fileInput, { target: { files: [file] } });

      // Save (will fail)
      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to update profile');
      });

      // Verify form data is preserved
      expect(nameInput).toHaveValue('Updated Name');
      expect(bioTextarea).toHaveValue('Updated bio');
      expect(screen.getByAltText('Profile')).toHaveAttribute('src', 'mock-preview-url');
    });

    it('successfully updates profile without image change', async () => {
      renderProfile();

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      fireEvent.click(editButton);

      // Only change text fields
      const nameInput = screen.getByLabelText(/full name/i);
      fireEvent.change(nameInput, { target: { value: 'Updated Name' } });

      // Save
      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(usersAPI.updateProfile).toHaveBeenCalledTimes(1);
        const formDataArg = usersAPI.updateProfile.mock.calls[0][0];
        expect(formDataArg).toBeInstanceOf(FormData);
        expect(formDataArg.get('name')).toBe('Updated Name');
        expect(formDataArg.get('profilePicture')).toBeNull(); // No file selected
      });

      expect(toast.success).toHaveBeenCalledWith('Profile updated successfully!');
    });

    it('handles privacy toggle independently of file uploads', async () => {
      renderProfile();

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Toggle privacy
      const privacyButton = screen.getByRole('button', { name: /public/i });
      fireEvent.click(privacyButton);

      await waitFor(() => {
        expect(usersAPI.togglePrivacy).toHaveBeenCalledWith(false);
        expect(toast.success).toHaveBeenCalledWith('Profile is now private');
      });
    });

    it('maintains image preview across form interactions', async () => {
      renderProfile();

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      fireEvent.click(editButton);

      // Select file
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const fileInput = screen.getByLabelText(/camera/i).closest('label').querySelector('input');
      fireEvent.change(fileInput, { target: { files: [file] } });

      // Interact with other form fields
      const nameInput = screen.getByLabelText(/full name/i);
      fireEvent.change(nameInput, { target: { value: 'Test Name' } });
      fireEvent.change(nameInput, { target: { value: '' } }); // Clear
      fireEvent.change(nameInput, { target: { value: 'Final Name' } }); // Set again

      // Verify image preview persists
      expect(screen.getByAltText('Profile')).toHaveAttribute('src', 'mock-preview-url');
      expect(nameInput).toHaveValue('Final Name');
    });
  });

  describe('File Upload Edge Cases', () => {
    it('handles very small files', async () => {
      renderProfile();

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      fireEvent.click(editButton);

      // Very small file (1 byte)
      const tinyFile = new File(['x'], 'tiny.jpg', { type: 'image/jpeg' });
      const fileInput = screen.getByLabelText(/camera/i).closest('label').querySelector('input');
      fireEvent.change(fileInput, { target: { files: [tinyFile] } });

      expect(mockCreateObjectURL).toHaveBeenCalledWith(tinyFile);
    });

    it('handles files with special characters in name', async () => {
      renderProfile();

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      fireEvent.click(editButton);

      // File with special characters
      const specialFile = new File(['test'], 'test-image_123!@#.jpg', { type: 'image/jpeg' });
      const fileInput = screen.getByLabelText(/camera/i).closest('label').querySelector('input');
      fireEvent.change(fileInput, { target: { files: [specialFile] } });

      expect(mockCreateObjectURL).toHaveBeenCalledWith(specialFile);
    });

    it('handles rapid file selection changes', async () => {
      renderProfile();

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      fireEvent.click(editButton);

      const fileInput = screen.getByLabelText(/camera/i).closest('label').querySelector('input');

      // Rapidly change files
      const file1 = new File(['1'], 'file1.jpg', { type: 'image/jpeg' });
      const file2 = new File(['2'], 'file2.jpg', { type: 'image/jpeg' });
      const file3 = new File(['3'], 'file3.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, { target: { files: [file1] } });
      fireEvent.change(fileInput, { target: { files: [file2] } });
      fireEvent.change(fileInput, { target: { files: [file3] } });

      // Should handle cleanup properly
      expect(mockRevokeObjectURL).toHaveBeenCalledTimes(2); // Two revocations for previous files
      expect(mockCreateObjectURL).toHaveBeenCalledTimes(3); // Three creations
    });
  });

  describe('Memory Management', () => {
    it('cleans up object URLs when component unmounts', async () => {
      const { unmount } = renderProfile();

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Enter edit mode and select file
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      fireEvent.click(editButton);

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const fileInput = screen.getByLabelText(/camera/i).closest('label').querySelector('input');
      fireEvent.change(fileInput, { target: { files: [file] } });

      // Unmount component
      unmount();

      // Cleanup should have been called
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('mock-preview-url');
    });

    it('does not create unnecessary object URLs', async () => {
      renderProfile();

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      fireEvent.click(editButton);

      // Select empty file list
      const fileInput = screen.getByLabelText(/camera/i).closest('label').querySelector('input');
      fireEvent.change(fileInput, { target: { files: [] } });

      // Should not create object URL for empty selection
      expect(mockCreateObjectURL).not.toHaveBeenCalled();
    });
  });
});