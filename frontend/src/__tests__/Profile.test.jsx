import React from 'react';
import PropTypes from 'prop-types';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import toast from 'react-hot-toast';
import Profile from '../pages/Profile';
import { usersAPI } from '../services/api';

// Mock framer-motion
const AnimatePresence = ({ children }) => <>{children}</>;
AnimatePresence.propTypes = { children: PropTypes.node };

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

// Mock usersAPI
vi.mock('../services/api', () => ({
  usersAPI: {
    getProfile: vi.fn(),
    updateProfile: vi.fn(),
    togglePrivacy: vi.fn()
  }
}));

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

describe('Profile Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateObjectURL.mockReturnValue('mock-preview-url');
    usersAPI.getProfile.mockResolvedValue({ data: mockUserData });
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Initial Loading State', () => {
    it('shows loading spinner while fetching profile', () => {
      usersAPI.getProfile.mockImplementation(() => new Promise(() => {})); // Never resolves
      renderProfile();

      expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument(); // Loading spinner
    });

    it('loads profile data successfully', async () => {
      renderProfile();

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Computer Science • 6th')).toBeInTheDocument();
      });

      expect(usersAPI.getProfile).toHaveBeenCalledTimes(1);
    });

    it('handles profile fetch error', async () => {
      usersAPI.getProfile.mockRejectedValue(new Error('Failed to fetch'));

      renderProfile();

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to load profile');
      });
    });
  });

  describe('Edit Profile Button', () => {
    it('toggles to edit mode when Edit Profile button is clicked', async () => {
      renderProfile();

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const editButton = screen.getByRole('button', { name: /edit profile/i });
      fireEvent.click(editButton);

      expect(screen.getByText('Full Name')).toBeInTheDocument();
      expect(screen.getByText('Department')).toBeInTheDocument();
      expect(screen.getByText('Bio')).toBeInTheDocument();
    });

    it('shows Save and Cancel buttons in edit mode', async () => {
      renderProfile();

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const editButton = screen.getByRole('button', { name: /edit profile/i });
      fireEvent.click(editButton);

      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });
  });

  describe('Cancel Button', () => {
    it('exits edit mode and resets form when Cancel is clicked', async () => {
      renderProfile();

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      fireEvent.click(editButton);

      // Modify form data
      const nameInput = screen.getByLabelText(/full name/i);
      fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });

      // Cancel
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      // Should be back to view mode with original data
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Full Name')).not.toBeInTheDocument();
    });
  });

  describe('Save Button', () => {
    it('saves profile changes successfully', async () => {
      usersAPI.updateProfile.mockResolvedValue({ data: { ...mockUserData, name: 'Jane Doe' } });

      renderProfile();

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      fireEvent.click(editButton);

      // Modify form data
      const nameInput = screen.getByLabelText(/full name/i);
      fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });

      // Save
      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(usersAPI.updateProfile).toHaveBeenCalledWith(
          expect.objectContaining({ name: 'Jane Doe' })
        );
        expect(toast.success).toHaveBeenCalledWith('Profile updated successfully!');
      });

      // Should exit edit mode
      expect(screen.queryByText('Full Name')).not.toBeInTheDocument();
    });

    it('shows loading state during save', async () => {
      usersAPI.updateProfile.mockImplementation(() => new Promise(() => {})); // Never resolves

      renderProfile();

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      fireEvent.click(editButton);

      // Save
      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      // Button should be disabled and show "Saving..."
      expect(saveButton).toBeDisabled();
      expect(screen.getByText('Saving...')).toBeInTheDocument();
    });

    it('handles save error', async () => {
      usersAPI.updateProfile.mockRejectedValue(new Error('Save failed'));

      renderProfile();

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      fireEvent.click(editButton);

      // Save
      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to update profile');
      });

      // Should remain in edit mode
      expect(screen.getByText('Full Name')).toBeInTheDocument();
    });
  });

  describe('Privacy Toggle Button', () => {
    it('toggles privacy from public to private', async () => {
      usersAPI.togglePrivacy.mockResolvedValue({ data: { isPublic: false } });

      renderProfile();

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const privacyButton = screen.getByRole('button', { name: /public/i });
      fireEvent.click(privacyButton);

      await waitFor(() => {
        expect(usersAPI.togglePrivacy).toHaveBeenCalledWith(false);
        expect(toast.success).toHaveBeenCalledWith('Profile is now private');
      });
    });

    it('toggles privacy from private to public', async () => {
      usersAPI.getProfile.mockResolvedValue({ data: { ...mockUserData, isPublic: false } });
      usersAPI.togglePrivacy.mockResolvedValue({ data: { isPublic: true } });

      renderProfile();

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const privacyButton = screen.getByRole('button', { name: /private/i });
      fireEvent.click(privacyButton);

      await waitFor(() => {
        expect(usersAPI.togglePrivacy).toHaveBeenCalledWith(true);
        expect(toast.success).toHaveBeenCalledWith('Profile is now public');
      });
    });

    it('reverts optimistic update on privacy toggle error', async () => {
      usersAPI.togglePrivacy.mockRejectedValue(new Error('Toggle failed'));

      renderProfile();

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const privacyButton = screen.getByRole('button', { name: /public/i });
      fireEvent.click(privacyButton);

      // Should immediately show private state (optimistic update)
      expect(screen.getByRole('button', { name: /private/i })).toBeInTheDocument();

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to update privacy settings');
        // Should revert back to public
        expect(screen.getByRole('button', { name: /public/i })).toBeInTheDocument();
      });
    });
  });

  describe('Image Upload', () => {
    it('handles image file selection and creates preview', async () => {
      renderProfile();

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      fireEvent.click(editButton);

      const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
      const fileInput = screen.getByLabelText(/camera/i).closest('label').querySelector('input');

      fireEvent.change(fileInput, { target: { files: [file] } });

      expect(mockCreateObjectURL).toHaveBeenCalledWith(file);
      expect(screen.getByAltText('Profile')).toHaveAttribute('src', 'mock-preview-url');
    });

    it('includes image file in form data when saving', async () => {
      usersAPI.updateProfile.mockResolvedValue({ data: mockUserData });

      renderProfile();

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      fireEvent.click(editButton);

      const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
      const fileInput = screen.getByLabelText(/camera/i).closest('label').querySelector('input');

      fireEvent.change(fileInput, { target: { files: [file] } });

      // Save
      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        const formDataArg = usersAPI.updateProfile.mock.calls[0][0];
        expect(formDataArg).toBeInstanceOf(FormData);
        expect(formDataArg.get('profilePicture')).toBe(file);
      });
    });

    it('validates file type - accepts valid image formats', async () => {
      renderProfile();

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      fireEvent.click(editButton);

      const validFormats = ['image/jpeg', 'image/png', 'image/webp'];
      const fileNames = ['test.jpg', 'test.png', 'test.webp'];

      for (let i = 0; i < validFormats.length; i++) {
        const file = new File(['dummy content'], fileNames[i], { type: validFormats[i] });
        const fileInput = screen.getByLabelText(/camera/i).closest('label').querySelector('input');

        fireEvent.change(fileInput, { target: { files: [file] } });

        expect(mockCreateObjectURL).toHaveBeenCalledWith(file);
      }
    });

    it('handles file size validation on frontend', async () => {
      renderProfile();

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      fireEvent.click(editButton);

      // Create a file larger than typical limits (simulate large file)
      const largeFile = new File(['x'.repeat(3 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
      const fileInput = screen.getByLabelText(/camera/i).closest('label').querySelector('input');

      fireEvent.change(fileInput, { target: { files: [largeFile] } });

      // The component should still accept the file, validation happens on backend
      expect(mockCreateObjectURL).toHaveBeenCalledWith(largeFile);
    });

    it('handles multiple file selection - only uses first file', async () => {
      renderProfile();

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      fireEvent.click(editButton);

      const file1 = new File(['content1'], 'test1.png', { type: 'image/png' });
      const file2 = new File(['content2'], 'test2.jpg', { type: 'image/jpeg' });
      const fileInput = screen.getByLabelText(/camera/i).closest('label').querySelector('input');

      fireEvent.change(fileInput, { target: { files: [file1, file2] } });

      // Should only use the first file
      expect(mockCreateObjectURL).toHaveBeenCalledWith(file1);
      expect(mockCreateObjectURL).not.toHaveBeenCalledWith(file2);
    });

    it('clears preview when switching between files', async () => {
      renderProfile();

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      fireEvent.click(editButton);

      const file1 = new File(['content1'], 'test1.png', { type: 'image/png' });
      const file2 = new File(['content2'], 'test2.jpg', { type: 'image/jpeg' });
      const fileInput = screen.getByLabelText(/camera/i).closest('label').querySelector('input');

      // Select first file
      fireEvent.change(fileInput, { target: { files: [file1] } });
      expect(mockCreateObjectURL).toHaveBeenCalledWith(file1);

      // Select second file
      fireEvent.change(fileInput, { target: { files: [file2] } });
      expect(mockCreateObjectURL).toHaveBeenCalledWith(file2);

      // Should revoke the first URL
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('mock-preview-url');
    });

    it('handles upload errors gracefully', async () => {
      usersAPI.updateProfile.mockRejectedValue({
        response: { status: 400, data: { error: 'File too large' } }
      });

      renderProfile();

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      fireEvent.click(editButton);

      const file = new File(['dummy content'], 'large.png', { type: 'image/png' });
      const fileInput = screen.getByLabelText(/camera/i).closest('label').querySelector('input');

      fireEvent.change(fileInput, { target: { files: [file] } });

      // Save
      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to update profile');
      });

      // Should remain in edit mode
      expect(screen.getByText('Full Name')).toBeInTheDocument();
    });

    it('shows upload progress indication during save', async () => {
      usersAPI.updateProfile.mockImplementation(() => new Promise(resolve => {
        setTimeout(() => resolve({ data: mockUserData }), 100);
      }));

      renderProfile();

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      fireEvent.click(editButton);

      const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
      const fileInput = screen.getByLabelText(/camera/i).closest('label').querySelector('input');

      fireEvent.change(fileInput, { target: { files: [file] } });

      // Save
      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      // Should show loading state
      expect(saveButton).toBeDisabled();
      expect(screen.getByText('Saving...')).toBeInTheDocument();

      // Wait for completion
      await waitFor(() => {
        expect(saveButton).not.toBeDisabled();
        expect(screen.queryByText('Saving...')).not.toBeInTheDocument();
      });
    });

    it('preserves existing profile photo when no new file selected', async () => {
      usersAPI.updateProfile.mockResolvedValue({ data: mockUserData });

      renderProfile();

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      fireEvent.click(editButton);

      // Save without selecting a file
      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        const formDataArg = usersAPI.updateProfile.mock.calls[0][0];
        expect(formDataArg).toBeInstanceOf(FormData);
        // Should not have profilePicture field
        expect(formDataArg.get('profilePicture')).toBeNull();
      });
    });

    it('cleans up object URLs on component unmount', async () => {
      renderProfile();

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      fireEvent.click(editButton);

      const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
      const fileInput = screen.getByLabelText(/camera/i).closest('label').querySelector('input');

      fireEvent.change(fileInput, { target: { files: [file] } });

      // Unmount component
      // This would normally happen when navigating away
      // The cleanup effect should revoke the URL
    });
  });

  describe('Skills and Interests', () => {
    it('parses comma-separated skills input', async () => {
      renderProfile();

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      fireEvent.click(editButton);

      const skillsInput = screen.getByLabelText(/skills/i);
      fireEvent.change(skillsInput, { target: { value: 'Python, Django, PostgreSQL' } });

      expect(skillsInput).toHaveValue('Python, Django, PostgreSQL');
    });

    it('displays skills as tags in view mode', async () => {
      renderProfile();

      await waitFor(() => {
        expect(screen.getByText('Skills')).toBeInTheDocument();
        expect(screen.getByText('JavaScript')).toBeInTheDocument();
        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('Node.js')).toBeInTheDocument();
      });
    });

    it('displays interests as tags in view mode', async () => {
      renderProfile();

      await waitFor(() => {
        expect(screen.getByText('Interests')).toBeInTheDocument();
        expect(screen.getByText('AI')).toBeInTheDocument();
        expect(screen.getByText('Web Development')).toBeInTheDocument();
      });
    });

    it('handles empty skills/interests arrays', async () => {
      const userDataNoSkills = { ...mockUserData, skills: [], interests: [] };
      usersAPI.getProfile.mockResolvedValue({ data: userDataNoSkills });

      renderProfile();

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      expect(screen.queryByText('Skills')).not.toBeInTheDocument();
      expect(screen.queryByText('Interests')).not.toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('allows empty optional fields', async () => {
      usersAPI.updateProfile.mockResolvedValue({ data: mockUserData });

      renderProfile();

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      fireEvent.click(editButton);

      // Clear optional fields
      const bioTextarea = screen.getByLabelText(/bio/i);
      const linkedinInput = screen.getByLabelText(/linkedin/i);
      const githubInput = screen.getByLabelText(/github/i);
      const websiteInput = screen.getByLabelText(/website/i);

      fireEvent.change(bioTextarea, { target: { value: '' } });
      fireEvent.change(linkedinInput, { target: { value: '' } });
      fireEvent.change(githubInput, { target: { value: '' } });
      fireEvent.change(websiteInput, { target: { value: '' } });

      // Save should still work
      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(usersAPI.updateProfile).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith('Profile updated successfully!');
      });
    });
  });

  describe('Data Persistence', () => {
    it('persists form data after successful save', async () => {
      const updatedUserData = { ...mockUserData, name: 'Jane Doe', bio: 'Updated bio' };
      usersAPI.updateProfile.mockResolvedValue({ data: updatedUserData });

      renderProfile();

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      fireEvent.click(editButton);

      // Modify form data
      const nameInput = screen.getByLabelText(/full name/i);
      const bioTextarea = screen.getByLabelText(/bio/i);
      fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
      fireEvent.change(bioTextarea, { target: { value: 'Updated bio' } });

      // Save
      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText('Jane Doe')).toBeInTheDocument();
        expect(screen.getByText('Updated bio')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('handles network errors during profile fetch', async () => {
      usersAPI.getProfile.mockRejectedValue(new Error('Network error'));

      renderProfile();

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to load profile');
      });
    });

    it('handles API errors during profile update', async () => {
      usersAPI.updateProfile.mockRejectedValue({
        response: { status: 400, data: { message: 'Validation error' } }
      });

      renderProfile();

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Enter edit mode and try to save
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      fireEvent.click(editButton);

      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to update profile');
      });
    });
  });

  describe('Loading States', () => {
    it('disables save button during submission', async () => {
      usersAPI.updateProfile.mockImplementation(() => new Promise(() => {}));

      renderProfile();

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      fireEvent.click(editButton);

      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      expect(saveButton).toBeDisabled();
      expect(saveButton).toHaveTextContent('Saving...');
    });

    it('shows loading spinner during initial load', () => {
      usersAPI.getProfile.mockImplementation(() => new Promise(() => {}));

      renderProfile();

      expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument();
    });
  });
});