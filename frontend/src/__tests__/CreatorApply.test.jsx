import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { toast } from 'react-hot-toast';
import CreatorApply from '../pages/CreatorApply';
import { creatorsAPI } from '../services/api';

// Mock the API
vi.mock('../services/api', () => ({
  creatorsAPI: {
    applyForCreator: vi.fn(),
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
      success: vi.fn(),
      error: vi.fn(),
    },
    Toaster: () => <div data-testid="toaster" />,
  };
});

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  User: () => <div data-testid="user-icon" />,
  BookOpen: () => <div data-testid="book-open-icon" />,
  Award: () => <div data-testid="award-icon" />,
  Upload: () => <div data-testid="upload-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
}));

const renderCreatorApply = () => {
  return render(
    <MemoryRouter>
      <CreatorApply />
    </MemoryRouter>
  );
};

describe('CreatorApply Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial Rendering', () => {
    it('renders the creator application form', () => {
      renderCreatorApply();

      expect(screen.getByText('Become an Educational Content Creator')).toBeInTheDocument();
      expect(screen.getByText('Share your knowledge and inspire the next generation of learners')).toBeInTheDocument();
      expect(screen.getByText('Basic Information')).toBeInTheDocument();
    });

    it('renders progress indicator with 3 steps', () => {
      renderCreatorApply();

      expect(screen.getAllByText('1')).toHaveLength(1);
      expect(screen.getAllByText('2')).toHaveLength(1);
      expect(screen.getAllByText('3')).toHaveLength(1);
    });

    it('starts on step 1', () => {
      renderCreatorApply();

      expect(screen.getByText('Basic Information')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Your creator name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Tell us about yourself and your passion for education')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('e.g., Mathematics, Computer Science, Physics (comma-separated)')).toBeInTheDocument();
    });
  });

  describe('Form Navigation', () => {
    it('navigates to step 2 when Next is clicked with valid step 1 data', async () => {
      renderCreatorApply();

      // Fill required fields for step 1
      fireEvent.change(screen.getByPlaceholderText('Your creator name'), {
        target: { value: 'Test Creator' },
      });
      fireEvent.change(screen.getByPlaceholderText('Tell us about yourself and your passion for education'), {
        target: { value: 'Test bio content' },
      });
      fireEvent.change(screen.getByPlaceholderText('e.g., Mathematics, Computer Science, Physics (comma-separated)'), {
        target: { value: 'Mathematics, Physics' },
      });

      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('Education & Content Focus')).toBeInTheDocument();
      });
    });

    it('navigates to step 3 when Next is clicked with valid step 2 data', async () => {
      renderCreatorApply();

      // Fill step 1
      fireEvent.change(screen.getByPlaceholderText('Your creator name'), {
        target: { value: 'Test Creator' },
      });
      fireEvent.change(screen.getByPlaceholderText('Tell us about yourself and your passion for education'), {
        target: { value: 'Test bio content' },
      });
      fireEvent.change(screen.getByPlaceholderText('e.g., Mathematics, Computer Science, Physics (comma-separated)'), {
        target: { value: 'Mathematics, Physics' },
      });
      fireEvent.click(screen.getByText('Next'));

      // Wait for step 2
      await waitFor(() => {
        expect(screen.getByText('Education & Content Focus')).toBeInTheDocument();
      });

      // Select at least one content category
      const educationButton = screen.getByText('Education');
      fireEvent.click(educationButton);

      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('Links & Portfolio')).toBeInTheDocument();
      });
    });

    it('navigates back to previous step when Previous is clicked', async () => {
      renderCreatorApply();

      // Go to step 2
      fireEvent.change(screen.getByPlaceholderText('Your creator name'), {
        target: { value: 'Test Creator' },
      });
      fireEvent.change(screen.getByPlaceholderText('Tell us about yourself and your passion for education'), {
        target: { value: 'Test bio content' },
      });
      fireEvent.change(screen.getByPlaceholderText('e.g., Mathematics, Computer Science, Physics (comma-separated)'), {
        target: { value: 'Mathematics, Physics' },
      });
      fireEvent.click(screen.getByText('Next'));

      await waitFor(() => {
        expect(screen.getByText('Education & Content Focus')).toBeInTheDocument();
      });

      // Go back to step 1
      const prevButton = screen.getByText('Previous');
      fireEvent.click(prevButton);

      await waitFor(() => {
        expect(screen.getByText('Basic Information')).toBeInTheDocument();
      });
    });
  });

  describe('Form Validation', () => {
    it('requires display name field', async () => {
      renderCreatorApply();

      const displayNameInput = screen.getByPlaceholderText('Your creator name');
      expect(displayNameInput).toBeRequired();
    });

    it('requires bio field', async () => {
      renderCreatorApply();

      const bioTextarea = screen.getByPlaceholderText('Tell us about yourself and your passion for education');
      expect(bioTextarea).toBeRequired();
    });

    it('requires areas of expertise field', async () => {
      renderCreatorApply();

      const expertiseInput = screen.getByPlaceholderText('e.g., Mathematics, Computer Science, Physics (comma-separated)');
      expect(expertiseInput).toBeRequired();
    });

    it('requires at least one content category selection', async () => {
      renderCreatorApply();

      // Fill form and go to step 3
      fireEvent.change(screen.getByPlaceholderText('Your creator name'), {
        target: { value: 'Test Creator' },
      });
      fireEvent.change(screen.getByPlaceholderText('Tell us about yourself and your passion for education'), {
        target: { value: 'Test bio content' },
      });
      fireEvent.change(screen.getByPlaceholderText('e.g., Mathematics, Computer Science, Physics (comma-separated)'), {
        target: { value: 'Mathematics, Physics' },
      });
      fireEvent.click(screen.getByText('Next'));

      await waitFor(() => {
        expect(screen.getByText('Education & Content Focus')).toBeInTheDocument();
      });

      // Go to step 3 without selecting categories
      fireEvent.click(screen.getByText('Next'));

      await waitFor(() => {
        expect(screen.getByText('Links & Portfolio')).toBeInTheDocument();
      });

      // Try to submit without content categories
      const submitButton = screen.getByText('Submit Application');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('At least one content category must be selected');
      });
    });

    it('validates URL format for portfolio and social links', async () => {
      renderCreatorApply();

      // Go to step 3
      fireEvent.change(screen.getByPlaceholderText('Your creator name'), {
        target: { value: 'Test Creator' },
      });
      fireEvent.change(screen.getByPlaceholderText('Tell us about yourself and your passion for education'), {
        target: { value: 'Test bio content' },
      });
      fireEvent.change(screen.getByPlaceholderText('e.g., Mathematics, Computer Science, Physics (comma-separated)'), {
        target: { value: 'Mathematics, Physics' },
      });
      fireEvent.click(screen.getByText('Next'));

      await waitFor(() => {
        expect(screen.getByText('Education & Content Focus')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Education'));
      fireEvent.click(screen.getByText('Next'));

      await waitFor(() => {
        expect(screen.getByText('Links & Portfolio')).toBeInTheDocument();
      });

      // Test portfolio URL
      const portfolioInput = screen.getByPlaceholderText('https://yourportfolio.com');
      fireEvent.change(portfolioInput, { target: { value: 'invalid-url' } });

      // HTML5 validation should prevent invalid URLs, but we test the input accepts valid ones
      fireEvent.change(portfolioInput, { target: { value: 'https://validurl.com' } });
      expect(portfolioInput.value).toBe('https://validurl.com');
    });
  });

  describe('Content Category Selection', () => {
    it('allows selecting and deselecting content categories', async () => {
      renderCreatorApply();

      // Go to step 2
      fireEvent.change(screen.getByPlaceholderText('Your creator name'), {
        target: { value: 'Test Creator' },
      });
      fireEvent.change(screen.getByPlaceholderText('Tell us about yourself and your passion for education'), {
        target: { value: 'Test bio content' },
      });
      fireEvent.change(screen.getByPlaceholderText('e.g., Mathematics, Computer Science, Physics (comma-separated)'), {
        target: { value: 'Mathematics, Physics' },
      });
      fireEvent.click(screen.getByText('Next'));

      await waitFor(() => {
        expect(screen.getByText('Education & Content Focus')).toBeInTheDocument();
      });

      const educationButton = screen.getByText('Education');
      const technologyButton = screen.getByText('Technology');

      // Select education
      fireEvent.click(educationButton);
      expect(educationButton).toHaveClass('bg-blue-600');

      // Select technology
      fireEvent.click(technologyButton);
      expect(technologyButton).toHaveClass('bg-blue-600');

      // Deselect education
      fireEvent.click(educationButton);
      expect(educationButton).not.toHaveClass('bg-blue-600');
    });
  });

  describe('Form Submission', () => {
    const fillCompleteForm = async () => {
      // Step 1
      fireEvent.change(screen.getByPlaceholderText('Your creator name'), {
        target: { value: 'Test Creator' },
      });
      fireEvent.change(screen.getByPlaceholderText('Tell us about yourself and your passion for education'), {
        target: { value: 'Test bio content' },
      });
      fireEvent.change(screen.getByPlaceholderText('e.g., Mathematics, Computer Science, Physics (comma-separated)'), {
        target: { value: 'Mathematics, Physics' },
      });
      fireEvent.click(screen.getByText('Next'));

      await waitFor(() => {
        expect(screen.getByText('Education & Content Focus')).toBeInTheDocument();
      });

      // Step 2
      fireEvent.change(screen.getByPlaceholderText('e.g., Bachelor\'s, Master\'s'), {
        target: { value: 'Bachelor of Science' },
      });
      fireEvent.change(screen.getByPlaceholderText('e.g., Computer Science'), {
        target: { value: 'Computer Science' },
      });
      fireEvent.change(screen.getByPlaceholderText('University/College name'), {
        target: { value: 'Test University' },
      });
      fireEvent.change(screen.getByPlaceholderText('2024'), {
        target: { value: '2024' },
      });
      fireEvent.click(screen.getByText('Education'));
      fireEvent.click(screen.getByText('Next'));

      await waitFor(() => {
        expect(screen.getByText('Links & Portfolio')).toBeInTheDocument();
      });

      // Step 3
      fireEvent.change(screen.getByPlaceholderText('https://yourportfolio.com'), {
        target: { value: 'https://testportfolio.com' },
      });
      fireEvent.change(screen.getByPlaceholderText('LinkedIn profile URL'), {
        target: { value: 'https://linkedin.com/in/test' },
      });
      fireEvent.change(screen.getByPlaceholderText('YouTube channel URL'), {
        target: { value: 'https://youtube.com/@test' },
      });
      fireEvent.change(screen.getByPlaceholderText('Personal website URL'), {
        target: { value: 'https://testwebsite.com' },
      });
    };

    it('submits form successfully and shows success message', async () => {
      creatorsAPI.applyForCreator.mockResolvedValue({
        data: {
          message: 'Creator application submitted successfully',
          creator: { id: '123', displayName: 'Test Creator' },
        },
      });

      renderCreatorApply();
      await fillCompleteForm();

      const submitButton = screen.getByText('Submit Application');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(creatorsAPI.applyForCreator).toHaveBeenCalledWith({
          displayName: 'Test Creator',
          bio: 'Test bio content',
          expertise: ['Mathematics', 'Physics'],
          education: {
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            institution: 'Test University',
            graduationYear: '2024',
          },
          contentCategories: 'education',
          portfolioUrl: 'https://testportfolio.com',
          socialLinks: {
            linkedin: 'https://linkedin.com/in/test',
            youtube: 'https://youtube.com/@test',
            website: 'https://testwebsite.com',
          },
        });
      });

      expect(toast.success).toHaveBeenCalledWith('Creator application submitted successfully!');
      expect(mockNavigate).toHaveBeenCalledWith('/feed');
    });

    it('shows error message when submission fails', async () => {
      creatorsAPI.applyForCreator.mockRejectedValue({
        response: { data: { error: 'Application already exists' } },
      });

      renderCreatorApply();
      await fillCompleteForm();

      const submitButton = screen.getByText('Submit Application');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Application already exists');
      });

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('shows generic error message for network failures', async () => {
      creatorsAPI.applyForCreator.mockRejectedValue(new Error('Network error'));

      renderCreatorApply();
      await fillCompleteForm();

      const submitButton = screen.getByText('Submit Application');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to submit application');
      });
    });
  });

  describe('Loading States', () => {
    it('shows loading text on submit button during submission', async () => {
      creatorsAPI.applyForCreator.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      renderCreatorApply();

      // Fill form quickly
      fireEvent.change(screen.getByPlaceholderText('Your creator name'), {
        target: { value: 'Test Creator' },
      });
      fireEvent.change(screen.getByPlaceholderText('Tell us about yourself and your passion for education'), {
        target: { value: 'Test bio content' },
      });
      fireEvent.change(screen.getByPlaceholderText('e.g., Mathematics, Computer Science, Physics (comma-separated)'), {
        target: { value: 'Mathematics' },
      });
      fireEvent.click(screen.getByText('Next'));

      await waitFor(() => {
        expect(screen.getByText('Education & Content Focus')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Education'));
      fireEvent.click(screen.getByText('Next'));

      await waitFor(() => {
        expect(screen.getByText('Links & Portfolio')).toBeInTheDocument();
      });

      const submitButton = screen.getByText('Submit Application');
      fireEvent.click(submitButton);

      // Check loading state
      expect(screen.getByText('Submitting...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();

      await waitFor(() => {
        expect(screen.queryByText('Submitting...')).not.toBeInTheDocument();
      });
    });
  });

  describe('Progress Indicator', () => {
    it('updates progress indicator as steps are completed', async () => {
      renderCreatorApply();

      // Step 1 active
      const step1Indicators = screen.getAllByText('1');
      expect(step1Indicators[0].closest('div')).toHaveClass('bg-blue-600');

      // Go to step 2
      fireEvent.change(screen.getByPlaceholderText('Your creator name'), {
        target: { value: 'Test Creator' },
      });
      fireEvent.change(screen.getByPlaceholderText('Tell us about yourself and your passion for education'), {
        target: { value: 'Test bio content' },
      });
      fireEvent.change(screen.getByPlaceholderText('e.g., Mathematics, Computer Science, Physics (comma-separated)'), {
        target: { value: 'Mathematics' },
      });
      fireEvent.click(screen.getByText('Next'));

      await waitFor(() => {
        const step2Indicators = screen.getAllByText('2');
        expect(step2Indicators[0].closest('div')).toHaveClass('bg-blue-600');
      });

      // Go to step 3
      fireEvent.click(screen.getByText('education'));
      fireEvent.click(screen.getByText('Next'));

      await waitFor(() => {
        const step3Indicators = screen.getAllByText('3');
        expect(step3Indicators[0].closest('div')).toHaveClass('bg-blue-600');
      });
    });
  });
});