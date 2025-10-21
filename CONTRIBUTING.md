# 🤝 Contributing to Campus Connect

Thank you for your interest in contributing to Campus Connect! We welcome contributions from developers, designers, educators, and students who share our vision of transforming campus communities through technology.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Contribution Guidelines](#contribution-guidelines)
- [Reporting Issues](#reporting-issues)
- [Pull Request Process](#pull-request-process)
- [Development Setup](#development-setup)
- [Testing](#testing)
- [Documentation](#documentation)

## 📜 Code of Conduct

This project adheres to a code of conduct to ensure a welcoming environment for all contributors. By participating, you agree to:

- **Be respectful** and inclusive in all interactions
- **Focus on constructive feedback** and collaborative problem-solving
- **Respect diverse perspectives** and experiences
- **Maintain professional communication** in all channels
- **Follow our community guidelines** for discussions and code reviews

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Git** for version control
- **Supabase** account for database access
- **Code editor** (VS Code recommended)

### Quick Setup

```bash
# Fork and clone the repository
git clone https://github.com/your-username/campus-connect.git
cd campus-connect

# Install dependencies
npm run setup:all

# Start development servers
npm run dev
```

## 🔄 Development Workflow

### 1. Choose an Issue

- Check our [GitHub Issues](https://github.com/your-username/campus-connect/issues) for open tasks
- Look for issues labeled `good first issue` or `help wanted`
- Comment on the issue to indicate you're working on it

### 2. Create a Branch

```bash
# Create and switch to a feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/issue-number-description
```

### 3. Make Changes

- Follow our coding standards and guidelines
- Write clear, concise commit messages
- Test your changes thoroughly
- Update documentation if needed

### 4. Submit a Pull Request

- Push your branch to GitHub
- Create a Pull Request with a clear description
- Reference any related issues
- Wait for review and address feedback

## 📝 Contribution Guidelines

### 🎯 Types of Contributions

#### **Code Contributions**
- Bug fixes and patches
- New features and enhancements
- Performance improvements
- Security updates

#### **Non-Code Contributions**
- Documentation improvements
- UI/UX design suggestions
- Testing and QA
- Translation and localization
- Community support

### 💻 Coding Standards

#### **JavaScript/React Guidelines**
```javascript
// ✅ Good: Clear naming and structure
const handleUserLogin = async (credentials) => {
  try {
    const response = await authAPI.signIn(credentials);
    setUser(response.data.user);
    return { success: true };
  } catch (error) {
    console.error('Login failed:', error);
    return { success: false, error: error.message };
  }
};

// ❌ Bad: Unclear naming and poor error handling
const login = (data) => {
  authAPI.signIn(data).then(setUser);
};
```

#### **CSS/Tailwind Guidelines**
```css
/* ✅ Good: Consistent naming and organization */
.btn-primary {
  @apply bg-primary text-white font-medium px-6 py-3 rounded-lg;
  @apply hover:bg-primary/90 transition-colors duration-200;
  @apply focus:ring-2 focus:ring-primary/50 focus:outline-none;
}

.btn-primary:disabled {
  @apply opacity-50 cursor-not-allowed;
}

/* ❌ Bad: Inline styles and inconsistent naming */
.button-blue {
  background: #6B9FFF;
  color: white;
  padding: 12px 24px;
}
```

#### **Commit Message Format**
```bash
# Format: type(scope): description

# Examples:
feat(auth): add magic link authentication
fix(ui): resolve mobile layout overflow
docs(readme): update installation guide
refactor(api): optimize database queries
test(auth): add unit tests for login flow
```

### 🧪 Testing Requirements

#### **Unit Tests**
```javascript
// Example: Component testing
import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from '../components/auth/LoginForm';

describe('LoginForm', () => {
  it('should handle email input', () => {
    render(<LoginForm />);
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
  });
});
```

#### **Integration Tests**
```javascript
// Example: API integration testing
describe('Authentication API', () => {
  it('should authenticate valid users', async () => {
    const credentials = { email: 'test@chitkara.edu.in', password: 'password' };
    const response = await authAPI.signIn(credentials);
    expect(response.data).toHaveProperty('user');
    expect(response.data).toHaveProperty('session');
  });
});
```

### 📚 Documentation Standards

#### **Component Documentation**
```javascript
/**
 * LoginForm Component
 * @param {Object} props - Component props
 * @param {Function} props.onLogin - Callback function for successful login
 * @param {boolean} props.loading - Loading state indicator
 * @returns {JSX.Element} Login form component
 */
const LoginForm = ({ onLogin, loading = false }) => {
  // Component implementation
};
```

#### **API Documentation**
```javascript
/**
 * Sign in user with email and password
 * @param {string} email - User email address
 * @param {string} password - User password
 * @returns {Promise<Object>} User data and session token
 * @throws {Error} Authentication failed
 */
export const signIn = async (email, password) => {
  // API implementation
};
```

## 🐛 Reporting Issues

### Bug Reports

When reporting bugs, please include:

1. **Clear Title**: Summarize the issue concisely
2. **Description**: Detailed explanation of the problem
3. **Steps to Reproduce**: Numbered steps to replicate the issue
4. **Expected Behavior**: What should happen
5. **Actual Behavior**: What actually happens
6. **Environment**: Browser, OS, Node version
7. **Screenshots**: Visual evidence when applicable

### Feature Requests

For new features, please provide:

1. **Feature Title**: Clear, descriptive name
2. **Problem Statement**: What problem does this solve?
3. **Proposed Solution**: How should it work?
4. **Alternatives Considered**: Other approaches you've thought of
5. **Additional Context**: Screenshots, mockups, or examples

## 🔄 Pull Request Process

### Before Submitting

1. **Update Documentation**: Ensure README and docs are current
2. **Run Tests**: All tests should pass
3. **Code Linting**: Fix any linting errors
4. **Self Review**: Check your code for issues

### PR Template

```markdown
## Description
Brief description of the changes made

## Type of Change
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Cross-browser testing done

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing unit tests pass locally
```

### Review Process

1. **Automated Checks**: CI/CD pipeline runs tests and linting
2. **Code Review**: Team members review code quality and functionality
3. **Testing**: QA team validates the changes
4. **Approval**: Maintainers approve and merge the PR

## 🛠️ Development Setup

### Local Development Environment

```bash
# 1. Clone and setup
git clone https://github.com/your-username/campus-connect.git
cd campus-connect

# 2. Install dependencies
npm install

# 3. Environment setup
cp .env.example .env
# Edit .env with your credentials

# 4. Database setup
# Follow database setup guide

# 5. Start development servers
npm run dev
```

### Development Scripts

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\"",
    "dev:frontend": "cd frontend && npm run dev",
    "dev:backend": "cd backend && npm run dev",
    "build": "npm run build:frontend && npm run build:backend",
    "test": "npm run test:frontend && npm run test:backend",
    "lint": "npm run lint:frontend && npm run lint:backend"
  }
}
```

## 🧪 Testing

### Testing Strategy

#### **Unit Tests**
- Component logic and utilities
- Custom hooks and context
- Utility functions and helpers

#### **Integration Tests**
- API endpoints and services
- Component interactions
- User workflows

#### **End-to-End Tests**
- Critical user journeys
- Authentication flows
- Core functionality

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- LoginForm.test.js

# Run tests in watch mode
npm run test:watch
```

## 📖 Documentation

### Documentation Structure

```
docs/
├── 📄 API_REFERENCE.md      # API endpoints documentation
├── 📄 COMPONENT_LIBRARY.md  # UI component documentation
├── 📄 DEPLOYMENT_GUIDE.md   # Production deployment
├── 📄 USER_MANUAL.md        # End-user documentation
├── 📄 ARCHITECTURE.md       # System architecture
└── 📄 TROUBLESHOOTING.md    # Common issues and solutions
```

### Updating Documentation

1. **Keep it Current**: Update docs when code changes
2. **Clear Examples**: Provide practical code examples
3. **Visual Aids**: Use diagrams and screenshots
4. **Step-by-Step**: Break down complex processes

## 🎯 Recognition

Contributors are recognized through:

- **GitHub Contributors**: Listed in repository contributors
- **Changelog**: Featured in release notes
- **Community**: Highlighted in community updates
- **Events**: Special mentions in campus events

## 📞 Getting Help

- **GitHub Discussions**: General questions and ideas
- **Discord Community**: Real-time chat and support
- **Documentation**: Comprehensive guides and tutorials
- **Team Communication**: Direct contact for urgent issues

## 🙏 Acknowledgments

We appreciate all contributors for their time and effort in making Campus Connect better for the entire Chitkara University community!

---

**Happy Contributing! 🎉**