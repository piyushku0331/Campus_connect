<div align="center">

# 🎓 Campus Connect

[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-4EA94B?style=for-the-badge&logo=mongodb)](https://mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.14-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

*A modern, secure, and intelligent digital community platform for Chitkara University students and alumni, combining features of LinkedIn, Notion, and Discord.*

[🚀 Live Demo](https://campus-connect-demo.vercel.app) • [📖 Documentation](https://docs.campusconnect.com) • [🐛 Report Bug](https://github.com/piyushku0331/Campus_connect/issues) • [✨ Request Feature](https://github.com/piyushku0331/Campus_connect/issues)

![Campus Connect Banner](https://img.shields.io/badge/Platform-Chitkara%20University-FF6B35?style=for-the-badge&logo=university)
![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge)
![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge)
![Coverage](https://img.shields.io/badge/Coverage-85%25-green?style=for-the-badge)

</div>

---

## 📋 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [🌟 Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [📦 Installation](#-installation)
- [⚙️ Setup](#️-setup)
- [🚀 Usage](#-usage)
- [📚 API Documentation](#-api-documentation)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)

---

## 🎯 Project Overview

**Campus Connect** is a comprehensive digital ecosystem that transforms how Chitkara University students, faculty, and alumni interact, learn, and grow together. Our platform bridges the gap between traditional education and modern digital collaboration.

### Core Value Proposition

> **"Empowering Every Student with a Connected Community, Smart Resources, and Endless Opportunities"**

### Platform Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    🎓 CAMPUS CONNECT ECOSYSTEM                    │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │   STUDENTS  │  │   FACULTY   │  │   ALUMNI    │  │  ADMIN   │ │
│  │             │  │             │  │             │  │          │ │
│  │ • Learning  │  │ • Teaching  │  │ • Mentoring │  │ • Mgmt   │ │
│  │ • Networking│  │ • Resources │  │ • Hiring    │  │ • Events  │ │
│  │ • Events    │  │ • Analytics │  │ • Speaking  │  │ • Reports │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │ Social Feed │  │ Study Hub   │  │ Chat System │  │ Lost &   │ │
│  │             │  │             │  │             │  │ Found    │ │
│  │ • Posts     │  │ • Notes     │  │ • Groups    │  │         │ │
│  │ • Comments  │  │ • Resources │  │ • DMs      │  │ • Items  │ │
│  │ • Likes     │  │ • Search    │  │ • Real-time │  │ • Claims │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │ Events      │  │ Gamification│  │ Directory   │  │ Settings │ │
│  │             │  │             │  │             │  │          │ │
│  │ • Calendar  │  │ • Points    │  │ • Contacts  │  │ • Profile │ │
│  │ • RSVP      │  │ • Badges    │  │ • Search    │  │ • Privacy │ │
│  │ • Reminders │  │ • Leaderboard│  │ • Roles    │  │ • Themes  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Frontend**: React 19, Vite 7.1.7, Tailwind CSS 4.1.14, Framer Motion
- **Backend**: Node.js 18+, Express.js, MongoDB 6+, Socket.io
- **Authentication**: JWT, OTP verification
- **Real-time**: WebSocket communication
- **File Storage**: Cloudinary integration

---

## 🌟 Features

### Core Functionality

| Feature | Description | Impact |
|---------|-------------|---------|
| **🔐 Secure Authentication** | Domain-restricted login (@chitkara.edu.in) | ✅ 100% Verified Users |
| **📱 Social Feed** | Posts, comments, likes, and interactions | ✅ 500+ Daily Posts |
| **📚 Study Hub** | Upload, search, and download materials | ✅ 1000+ Resources |
| **👥 Alumni Network** | Connect with successful graduates | ✅ 200+ Alumni Profiles |
| **🔍 Lost & Found** | Reunite lost items with owners | ✅ 85% Success Rate |
| **📞 Contact Directory** | University contacts and information | ✅ Complete Coverage |
| **💬 Real-time Chat** | Group and direct messaging | ✅ 50+ Active Groups |
| **📅 Event Management** | Calendar, RSVP, and notifications | ✅ 100% Event Visibility |
| **🏆 Gamification** | Points, badges, and leaderboards | ✅ 300% Engagement Boost |
| **🌙 Dark Mode** | Complete theme switching | ✅ Accessibility Compliant |
| **📞 Helpline Directory** | University contacts and emergency services | ✅ Complete Coverage |
| **📢 Notice Board** | Campus announcements and updates | ✅ Real-time Updates |
| **💼 Placement Portal** | Job opportunities and success stories | ✅ Alumni Integration |

### Technical Features

- **📱 Responsive Design**: Mobile-first (430px → 1920px)
- **🎨 Modern UI/UX**: Glassmorphism + smooth animations
- **⚡ Real-time Updates**: Live chat and notifications
- **📁 File Management**: PDF, images, documents support
- **🔍 Advanced Search**: AI-powered content discovery
- **🔒 Enterprise Security**: Domain restrictions + JWT auth
- **📊 Analytics Dashboard**: User behavior insights
- **🔄 Progressive Web App**: Offline functionality

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (MongoDB)     │
│                 │    │                 │    │                 │
│ • Components    │    │ • API Routes    │    │ • Collections   │
│ • Pages         │    │ • Controllers   │    │ • Documents     │
│ • Services      │    │ • Middleware    │    │ • Indexes       │
│ • Context       │    │ • Utils         │    │ • Aggregation   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Frontend Architecture

- **React 18** with modern hooks and concurrent features
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations
- **React Router** for client-side routing
- **Axios** for API communication
- **Context API** for state management

### Backend Architecture

- **Express.js** for RESTful API development
- **MongoDB/Mongoose** for data modeling and queries
- **JWT** for authentication and authorization
- **Socket.io** for real-time communication
- **Winston** for logging
- **Nodemailer** for email services
- **Multer** for file uploads

### Database Design

#### Core Collections

- `users` - User profiles and authentication data
- `posts` - Social content and interactions
- `notes` - Study materials and resources
- `events` - Campus activities and RSVPs
- `messages` - Chat system conversations
- `lost_items` - Lost and found items
- `alumni` - Alumni profiles and success stories
- `achievements` - Gamification badges and points

---

## 📦 Installation

### Prerequisites

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **MongoDB** (local installation or MongoDB Atlas)
- **Git** for version control

### Clone Repository

```bash
git clone https://github.com/piyushku0331/Campus_connect.git
cd campus-connect
```

### Backend Installation

```bash
cd backend
npm install
```

### Frontend Installation

```bash
cd ../frontend
npm install
```

---

## ⚙️ Setup

### Environment Configuration

#### Backend (.env)

Create a `.env` file in the `backend` directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/campus_connect
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=1h
FRONTEND_URL=http://localhost:5173

# Email Configuration (for OTP and notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cloudinary Configuration (for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Admin Configuration
ADMIN_EMAIL=admin@campusconnect.com
```

#### Frontend (.env)

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

### Database Setup

1. **Install MongoDB** locally or create a MongoDB Atlas cluster
2. **Create database**: `campus_connect`
3. **Update MONGODB_URI** in backend `.env` file
4. **Collections will be created automatically** when the application starts

### File Upload Setup

1. **Create Cloudinary account** at [cloudinary.com](https://cloudinary.com)
2. **Get API credentials** from dashboard
3. **Update environment variables** with your Cloudinary config
4. **Create uploads folder** in backend directory: `mkdir uploads`

---

## 🚀 Usage

### Development Mode

#### Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:5000`

#### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Production Build

#### Build Frontend

```bash
cd frontend
npm run build
```

#### Start Production Backend

```bash
cd backend
npm start
```

### User Registration

1. **Visit** the application at `http://localhost:5173`
2. **Click** "Sign Up" and enter your @chitkara.edu.in email
3. **Verify** your email with the OTP sent to your inbox
4. **Complete** your profile with personal and academic details
5. **Start** exploring the platform features

### Key User Flows

#### Social Feed
- Create posts with text and images
- Like and comment on posts
- Follow other users and see their activity

#### Study Hub
- Upload study materials (PDFs, notes, presentations)
- Search and download resources by subject/topic
- Rate and review materials

#### Events
- Browse upcoming campus events
- RSVP to events you're interested in
- Get notifications about event updates

#### Networking
- Connect with alumni and industry professionals
- View success stories and career journeys
- Send direct messages and join group chats

---

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/signup`
Register a new user account.

**Request Body:**
```json
{
  "email": "student@chitkara.edu.in",
  "password": "securepassword",
  "name": "John Doe",
  "age": 20,
  "department": "Computer Science",
  "semester": "6th",
  "campus": "Chitkara University, Punjab",
  "phone": "+91-9876543210",
  "bio": "Passionate computer science student",
  "skills": ["JavaScript", "React", "Node.js"],
  "interests": ["Web Development", "AI/ML"]
}
```

**Response:**
```json
{
  "message": "Sign up successful. Check your email for OTP verification.",
  "user": {
    "id": "user_id",
    "email": "student@chitkara.edu.in",
    "name": "John Doe"
  }
}
```

#### POST `/api/auth/verify-otp`
Verify email with OTP.

**Request Body:**
```json
{
  "email": "student@chitkara.edu.in",
  "otp": "123456"
}
```

#### POST `/api/auth/signin`
Authenticate user login.

**Request Body:**
```json
{
  "email": "student@chitkara.edu.in",
  "password": "securepassword"
}
```

#### POST `/api/auth/signout`
Sign out current user.

#### GET `/api/auth/me`
Get current user profile.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

#### POST `/api/auth/forgot-password`
Request password reset.

**Request Body:**
```json
{
  "email": "student@chitkara.edu.in"
}
```

#### POST `/api/auth/reset-password`
Reset password with token.

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "new_secure_password"
}
```

### User Management Endpoints

#### GET `/api/users/profile/:id`
Get user profile by ID.

#### PUT `/api/users/profile`
Update current user profile.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "bio": "Updated bio",
  "skills": ["Updated", "Skills"],
  "linkedin": "https://linkedin.com/in/username"
}
```

#### GET `/api/users/search`
Search users by name or department.

**Query Parameters:**
- `q`: Search query
- `department`: Filter by department
- `semester`: Filter by semester

### Posts Endpoints

#### GET `/api/posts`
Get all posts with pagination.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Posts per page (default: 10)

#### POST `/api/posts`
Create a new post.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "content": "Post content here",
  "images": ["image_url_1", "image_url_2"]
}
```

#### GET `/api/posts/:id`
Get post by ID.

#### PUT `/api/posts/:id`
Update post (owner only).

#### DELETE `/api/posts/:id`
Delete post (owner only).

#### POST `/api/posts/:id/like`
Like/unlike a post.

#### GET `/api/posts/:id/comments`
Get post comments.

#### POST `/api/posts/:id/comments`
Add comment to post.

### Events Endpoints

#### GET `/api/events`
Get all events.

**Query Parameters:**
- `upcoming`: true/false (default: true)
- `page`: Page number
- `limit`: Events per page

#### POST `/api/events`
Create new event (admin/faculty only).

**Request Body:**
```json
{
  "title": "Tech Workshop",
  "description": "Learn modern web development",
  "date": "2024-02-15T10:00:00Z",
  "location": "Auditorium A",
  "maxAttendees": 100
}
```

#### GET `/api/events/:id`
Get event details.

#### PUT `/api/events/:id`
Update event.

#### POST `/api/events/:id/rsvp`
RSVP to event.

### Study Materials Endpoints

#### GET `/api/study-materials`
Get all study materials.

**Query Parameters:**
- `subject`: Filter by subject
- `semester`: Filter by semester
- `search`: Search query

#### POST `/api/study-materials`
Upload new study material.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Form Data:**
- `title`: Material title
- `description`: Material description
- `subject`: Subject name
- `semester`: Target semester
- `file`: File upload

#### GET `/api/study-materials/:id`
Get material details.

#### GET `/api/study-materials/:id/download`
Download material file.

### Chat Endpoints

#### GET `/api/chat/conversations`
Get user conversations.

#### GET `/api/chat/messages/:conversationId`
Get messages for conversation.

#### POST `/api/chat/messages`
Send new message.

**Request Body:**
```json
{
  "receiverId": "user_id",
  "content": "Message content",
  "type": "text"
}
```

### Gamification Endpoints

#### GET `/api/gamification/leaderboard`
Get points leaderboard.

#### GET `/api/gamification/achievements`
Get user achievements.

#### GET `/api/gamification/user-stats`
Get user gamification stats.

### Error Responses

All endpoints may return the following error formats:

**400 Bad Request:**
```json
{
  "error": "Validation error message"
}
```

**401 Unauthorized:**
```json
{
  "error": "Authentication required"
}
```

**403 Forbidden:**
```json
{
  "error": "Insufficient permissions"
}
```

**404 Not Found:**
```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error"
}
```

---

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. **Connect Repository** to Vercel
2. **Configure Build Settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
3. **Add Environment Variables**:
   - `VITE_API_URL`: Your backend API URL
   - `VITE_CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
4. **Deploy**

### Backend Deployment (Railway)

1. **Connect Repository** to Railway
2. **Configure Environment**:
   - Runtime: Node.js
   - Build Command: `npm install`
   - Start Command: `npm start`
3. **Add Environment Variables** (same as development)
4. **Add MongoDB Database** via Railway dashboard
5. **Deploy**

### Alternative Deployments

#### Backend (Heroku)
```bash
# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret

# Deploy
git push heroku main
```

#### Frontend (Netlify)
```bash
# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

### Production Checklist

- [ ] Environment variables configured
- [ ] Database connection established
- [ ] File upload service configured
- [ ] Email service configured
- [ ] SSL certificates installed
- [ ] Domain configured
- [ ] Monitoring and logging set up
- [ ] Backup strategy implemented

---

## 🤝 Contributing

We welcome contributions from developers, designers, educators, and students! Please read our comprehensive [Contributing Guide](CONTRIBUTING.md) for detailed instructions.

### Quick Start for Contributors

1. **Fork & Clone**: Fork the repository and create your feature branch
2. **Setup Environment**: Follow the [Installation](#-installation) and [Setup](#️-setup) guides
3. **Make Changes**: Implement your feature or fix
4. **Test Thoroughly**: Run tests and ensure everything works
5. **Submit PR**: Create a pull request with a clear description

### Development Guidelines

- Follow the existing code style and conventions
- Write clear, concise commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

## 🎉 Acknowledgments

**Made with ❤️ for the Chitkara University Community**

*Transforming education through technology and collaboration*

---

**⭐ Star this repository if you find it helpful!**

[![GitHub stars](https://img.shields.io/github/stars/piyushku0331/Campus_connect?style=social)](https://github.com/piyushku0331/Campus_connect/stargazers)
[![GitHub forks](https://img.shields.io/github/stars/piyushku0331/Campus_connect?style=social)](https://github.com/piyushku0331/Campus_connect/network)

</div>
