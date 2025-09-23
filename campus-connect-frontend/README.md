# Campus Connect Frontend

A modern, responsive React frontend for the Campus Connect platform featuring glassmorphism design, smooth animations, and parallax effects.

## Features

- **Modern UI**: Glassmorphism design with smooth parallax scrolling
- **Interactive Animations**: Scroll-triggered animations and floating elements
- **Responsive Design**: Mobile-first approach with cross-device compatibility
- **Real-time Updates**: Socket.io integration for live notifications
- **Component Architecture**: Modular, reusable React components

## Tech Stack

- **Framework**: React 19 with Hooks
- **Routing**: React Router DOM v7
- **Styling**: CSS3 with Glassmorphism effects
- **State Management**: React Context API
- **HTTP Client**: Fetch API
- **Real-time**: Socket.io Client
- **Build Tool**: Create React App

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running (see backend README)

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd campus-connect-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create `.env` file in the root:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start development server**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## Project Structure

```
campus-connect-frontend/
├── public/                      # Static assets
│   ├── index.html              # Main HTML template
│   ├── manifest.json           # PWA manifest
│   └── favicon.ico             # App favicon
├── src/
│   ├── assets/                 # Static assets
│   │   ├── images/            # Image files
│   │   └── styles/            # CSS stylesheets
│   │       ├── main.css       # Global styles and variables
│   │       ├── components/    # Component-specific styles
│   │       └── pages/         # Page-specific styles
│   ├── components/             # Reusable React components
│   │   ├── common/            # Shared components (Header, Footer, etc.)
│   │   ├── auth/              # Authentication components
│   │   ├── events/            # Event-related components
│   │   └── ...                # Other feature components
│   ├── contexts/               # React Context providers
│   ├── data/                   # Static data and constants
│   ├── pages/                  # Page components
│   ├── services/               # API service layer
│   ├── App.js                 # Main application component
│   ├── index.js               # Application entry point
│   └── ...                    # Other configuration files
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## Key Features

### Animations & Effects
- **Parallax Scrolling**: Smooth background movement on scroll
- **Floating Elements**: Animated shapes with sine wave motion
- **Scroll-triggered Animations**: Elements animate in as they enter viewport
- **Hover Effects**: Interactive transforms and glow effects
- **Loading Animations**: Smooth transitions and skeleton states

### Responsive Design
- **Mobile-first**: Optimized for mobile devices
- **Tablet Support**: Adaptive layouts for tablets
- **Desktop Enhancement**: Additional features for larger screens
- **Touch-friendly**: Proper touch targets and gestures

### Performance
- **Code Splitting**: Lazy loading for better performance
- **Hardware Acceleration**: CSS transforms for smooth animations
- **Optimized Images**: Efficient image loading and caching
- **Minimal Bundle**: Tree-shaking and dead code elimination

## Development

### Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject from Create React App (not recommended)
npm run eject
```

### Code Quality

- **ESLint**: Code linting and formatting
- **Prettier**: Automatic code formatting
- **Husky**: Pre-commit hooks for quality checks

## Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

### Deployment Options

- **Vercel**: Recommended for React apps
- **Netlify**: Alternative hosting platform
- **AWS S3 + CloudFront**: For scalable deployments
- **Docker**: Containerized deployment

## Contributing

1. Follow the existing code style and structure
2. Add proper TypeScript types (if migrating)
3. Write tests for new features
4. Update documentation as needed
5. Ensure responsive design works across devices

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is licensed under the MIT License.