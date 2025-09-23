# 🤝 Contributing to Campus Connect

Thank you for your interest in contributing to Campus Connect! We welcome contributions from developers of all skill levels. This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)

## 📜 Code of Conduct

This project follows our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold this code. Please report unacceptable behavior to [maintainers email].

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (local or cloud instance) - [Download here](https://www.mongodb.com/)
- **Git** - [Download here](https://git-scm.com/)
- **npm** or **yarn** package manager

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/campus-connect.git
   cd campus-connect
   ```

3. **Set up upstream remote**:
   ```bash
   git remote add upstream https://github.com/original/campus-connect.git
   ```

4. **Install dependencies** for both frontend and backend:
   ```bash
   # Backend
   cd campus-connect-backend
   npm install

   # Frontend (new terminal)
   cd campus-connect-frontend
   npm install
   ```

5. **Set up environment variables**:
   ```bash
   # Backend
   cp .env.example .env
   # Edit .env with your configuration

   # Frontend
   cp .env.example .env
   # Edit .env with your configuration
   ```

6. **Start development servers**:
   ```bash
   # Backend (terminal 1)
   cd campus-connect-backend
   npm run dev

   # Frontend (terminal 2)
   cd campus-connect-frontend
   npm start
   ```

## 💡 How to Contribute

### Types of Contributions

- **🐛 Bug Fixes**: Fix existing issues
- **✨ New Features**: Add new functionality
- **📚 Documentation**: Improve documentation
- **🎨 UI/UX**: Enhance user interface and experience
- **⚡ Performance**: Optimize code and improve performance
- **🧪 Testing**: Add or improve tests
- **🔧 Maintenance**: Code refactoring, dependency updates

### Finding Issues to Work On

1. Check the [Issues](https://github.com/yourusername/campus-connect/issues) page
2. Look for issues labeled `good first issue` or `help wanted`
3. Comment on the issue to indicate you're working on it
4. Wait for maintainer approval before starting

## 🔄 Development Workflow

### 1. Choose an Issue

- Select an issue from the [Issues](https://github.com/yourusername/campus-connect/issues) page
- Comment to indicate you're working on it
- Wait for maintainer assignment

### 2. Create a Branch

```bash
# Sync with upstream
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-number-description
```

### 3. Make Changes

- Write clear, concise commit messages
- Follow the coding standards below
- Test your changes thoroughly
- Update documentation if needed

### 4. Test Your Changes

```bash
# Run tests
npm test

# Run linting
npm run lint

# Manual testing
# - Test all affected features
# - Check responsive design
# - Verify accessibility
```

### 5. Submit a Pull Request

```bash
# Push your branch
git push origin feature/your-feature-name

# Create PR on GitHub
# - Use descriptive title
# - Fill out PR template
# - Reference related issues
```

## 📝 Coding Standards

### JavaScript/Node.js

- Use **ES6+** features
- Use **async/await** over Promises when possible
- Use **const** and **let** instead of **var**
- Use **template literals** instead of string concatenation
- Follow **camelCase** for variables and functions
- Follow **PascalCase** for classes and components

### React

- Use **functional components** with hooks
- Use **custom hooks** for reusable logic
- Follow **component composition** over inheritance
- Use **meaningful component names**
- Keep components **small and focused**

### CSS

- Use **CSS custom properties** (variables)
- Follow **BEM** methodology for class names
- Use **flexbox** and **CSS Grid** for layouts
- Prefer **rem/em** over px for scalability
- Use **CSS modules** or scoped styles

### Git Commits

Follow conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Testing
- `chore`: Maintenance

Examples:
```
feat(auth): add JWT refresh token functionality
fix(ui): resolve mobile navigation overflow
docs(api): update authentication endpoints
```

## 🧪 Testing

### Backend Testing

```bash
cd campus-connect-backend
npm test                    # Run all tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Generate coverage report
```

### Frontend Testing

```bash
cd campus-connect-frontend
npm test                   # Run all tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Generate coverage report
```

### Manual Testing Checklist

- [ ] Functionality works as expected
- [ ] No console errors
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Accessibility features work (keyboard navigation, screen readers)
- [ ] Performance is acceptable
- [ ] No breaking changes to existing functionality

## 📤 Submitting Changes

### Pull Request Process

1. **Ensure your branch is up to date**:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Squash commits** if needed:
   ```bash
   git rebase -i HEAD~n  # n = number of commits
   ```

3. **Push your changes**:
   ```bash
   git push origin feature/your-feature-name --force-with-lease
   ```

4. **Create Pull Request**:
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Select your feature branch
   - Fill out the PR template completely
   - Request review from maintainers

### PR Requirements

- [ ] Descriptive title and description
- [ ] Reference related issues
- [ ] Include screenshots for UI changes
- [ ] Update documentation if needed
- [ ] All tests pass
- [ ] Code follows style guidelines
- [ ] No merge conflicts

## 🐛 Reporting Issues

### Bug Reports

When reporting bugs, please include:

1. **Clear title** describing the issue
2. **Steps to reproduce** the bug
3. **Expected behavior** vs actual behavior
4. **Environment details**:
   - OS and version
   - Browser and version
   - Node.js version
   - MongoDB version
5. **Screenshots** if applicable
6. **Console errors** or logs

### Feature Requests

For feature requests, please include:

1. **Clear description** of the proposed feature
2. **Use case** and benefits
3. **Implementation ideas** if any
4. **Mockups or examples** if applicable

## 🎯 Best Practices

### Code Quality

- Write **self-documenting code** with clear variable names
- Add **comments** for complex logic
- Keep functions **small and focused**
- Use **meaningful error messages**
- Follow **DRY** (Don't Repeat Yourself) principle

### Security

- Never commit **sensitive data** (API keys, passwords)
- Use **environment variables** for configuration
- Validate and **sanitize all inputs**
- Implement **proper authentication** and authorization
- Keep dependencies **up to date**

### Performance

- Optimize **database queries**
- Use **appropriate data structures**
- Implement **caching** where beneficial
- Minimize **bundle size** for frontend
- Use **lazy loading** for components

### Accessibility

- Use **semantic HTML** elements
- Provide **alt text** for images
- Ensure **keyboard navigation** works
- Maintain **sufficient color contrast**
- Test with **screen readers**

## 📞 Getting Help

- **Documentation**: Check the [README](README.md) first
- **Issues**: Search existing issues before creating new ones
- **Discussions**: Use GitHub Discussions for questions
- **Discord/Slack**: Join our community chat (if available)

## 🙏 Recognition

Contributors will be recognized in:
- Repository contributors list
- Changelog for significant contributions
- Project documentation

Thank you for contributing to Campus Connect! 🚀

---

[⬆️ Back to Top](#-contributing-to-campus-connect)