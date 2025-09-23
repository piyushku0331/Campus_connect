# 🎓 Campus Connect

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19+-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8+-green.svg)](https://www.mongodb.com/)

A comprehensive, modern campus management platform that connects students, faculty, and administrators in a unified digital ecosystem. Built with cutting-edge technologies and designed with user experience in mind.

## ✨ Features

### 🎯 Core Functionality
- **User Authentication**: Secure JWT-based authentication with role-based access control
- **Real-time Communication**: Socket.io-powered messaging and notifications
- **Event Management**: Create, manage, and RSVP to campus events
- **Study Materials**: Share and access educational resources
- **Lost & Found**: Report and claim lost items
- **Placement Portal**: Job opportunities and career resources
- **Community Forum**: Student-to-student interaction platform
- **Notice Board**: Important announcements and updates

### 🔒 Security & Performance
- **Advanced Security**: Helmet, CORS, rate limiting, input validation
- **Data Protection**: XSS prevention, NoSQL injection protection
- **Performance**: Optimized queries, caching, and CDN-ready assets
- **Scalability**: Microservices-ready architecture

### 🎨 User Experience
- **Modern UI**: Glassmorphism design with smooth animations
- **Responsive Design**: Mobile-first approach with cross-device compatibility
- **Accessibility**: WCAG compliant with screen reader support
- **Dark Theme**: Eye-friendly dark mode interface

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (local or cloud instance)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/campus-connect.git
   cd campus-connect
   ```

2. **Backend Setup**
   ```bash
   cd campus-connect-backend
   npm install
   cp .env.example .env  # Configure your environment variables
   npm run dev  # Development mode
   ```

3. **Frontend Setup** (in a new terminal)
   ```bash
   cd campus-connect-frontend
   npm install
   npm start  # Development server on http://localhost:3000
   ```

4. **Database Setup**
   - Ensure MongoDB is running
   - The application will automatically create collections on first run

## 📁 Project Structure

```
campus-connect/
├── campus-connect-backend/          # Backend API server (Clean Architecture)
│   ├── src/
│   │   ├── core/                    # Application core
│   │   │   ├── application.js       # Main application bootstrapper
│   │   │   ├── config.js            # Centralized configuration
│   │   │   └── container.js         # Dependency injection container
│   │   └── utils/
│   │       └── helpers.js           # Utility functions and helpers
│   ├── config/                      # Database and logging config
│   ├── controllers/                 # Route controllers
│   ├── middleware/                  # Custom middleware
│   ├── models/                      # Mongoose schemas
│   ├── routes/                      # API route definitions
│   ├── templates/                   # Email templates
│   ├── tests/                       # Unit and integration tests
│   └── uploads/                     # File upload directory
├── campus-connect-frontend/         # React frontend application
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/              # Reusable React components
│   │   ├── pages/                   # Page components
│   │   ├── services/                # API service layer
│   │   └── assets/                  # Styles and media files
│   └── build/                       # Production build
├── .gitignore                       # Git ignore rules
├── LICENSE                          # MIT License
├── README.md                        # This file
└── CONTRIBUTING.md                  # Contribution guidelines
```

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt
- **Real-time**: Socket.io
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate Limiting
- **File Upload**: Multer
- **Email**: Nodemailer

### Frontend
- **Framework**: React 19 with Hooks
- **Routing**: React Router DOM
- **Styling**: CSS3 with Glassmorphism
- **State Management**: React Context
- **HTTP Client**: Fetch API
- **Build Tool**: Create React App

### DevOps & Tools
- **Version Control**: Git
- **Code Quality**: ESLint
- **Testing**: Jest
- **API Documentation**: RESTful standards
- **Deployment**: Ready for Docker/Vercel

## 🔧 Configuration

### Environment Variables

Create `.env` files in both backend and frontend directories:

**Backend (.env)**
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/Campus_Connect
JWT_SECRET=your_secure_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

**Frontend (.env)**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - User logout

### Events Management
- `GET /api/events` - List approved events
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Community Features
- `GET /api/posts` - Get community posts
- `POST /api/posts` - Create new post
- `GET /api/materials` - Access study materials

### Administrative
- `GET /api/analytics` - Platform analytics
- `PUT /api/events/:id/approve` - Approve events
- `GET /api/users` - User management

## 🎨 Design System

### Color Palette
- **Primary**: `#a855f7` (Purple)
- **Secondary**: `#06b6d4` (Cyan)
- **Accent**: `#f59e0b` (Amber)
- **Background**: `#0a0a0a` (Dark)
- **Surface**: `#1a1a1a` (Dark Gray)

### Typography
- **Primary Font**: System font stack
- **Headings**: 700 weight for impact
- **Body**: 400 weight for readability

### Components
- **Glassmorphism**: Backdrop blur with transparency
- **Smooth Animations**: CSS transitions and transforms
- **Responsive Grid**: Flexbox and CSS Grid layouts

## 🧪 Testing

```bash
# Backend tests
cd campus-connect-backend
npm test

# Frontend tests
cd campus-connect-frontend
npm test
```

## 🚀 Deployment

### Backend Deployment
```bash
cd campus-connect-backend
npm run build
npm start
```

### Frontend Deployment
```bash
cd campus-connect-frontend
npm run build
# Serve build/ directory with nginx or similar
```

### Docker Support
```bash
# Build and run with Docker
docker-compose up --build
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) to understand our community standards.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Icons**: React Icons library
- **Animations**: CSS3 transitions and transforms
- **Design Inspiration**: Modern web design trends
- **Community**: Open source contributors

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/campus-connect/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/campus-connect/discussions)
- **Email**: support@campusconnect.com

## 🔄 Version History

### v1.0.0 (Current)
- Initial release with core features
- Authentication and user management
- Event management system
- Community forum
- Study materials sharing
- Lost & found functionality
- Responsive design with glassmorphism

---

**Made with ❤️ for the campus community**

[⬆️ Back to Top](#-campus-connect)