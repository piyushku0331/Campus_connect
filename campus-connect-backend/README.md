# Campus Connect Backend

A comprehensive backend API for the Campus Connect platform, built with Node.js, Express, and MongoDB.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Real-time Communication**: Socket.io integration for real-time messaging
- **File Upload**: Multer-based file upload system
- **Security**: Helmet, CORS, rate limiting, input validation, and sanitization
- **Logging**: Winston-based logging system
- **Error Handling**: Comprehensive error handling with custom error classes
- **API Documentation**: RESTful API with consistent response formats
- **Code Optimization**: All comments removed from JavaScript files for cleaner codebase

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.io
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Winston
- **File Upload**: Multer
- **Email**: Nodemailer

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd campus-connect-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env` file and update the values:
   ```bash
   cp .env .env.local
   ```
   - Update the following variables:
     - `MONGO_URI`: Your MongoDB connection string
     - `JWT_SECRET`: A secure random string for JWT signing
     - `EMAIL_USER` & `EMAIL_PASS`: Your email credentials

4. **Start MongoDB**
   Make sure MongoDB is running on your system or update `MONGO_URI` for cloud instance.

5. **Run the application**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000` (or the port specified in `.env`).

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Events
- `GET /api/events` - Get all approved events
- `POST /api/events` - Create new event (authenticated)
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Placements
- `GET /api/placements` - Get all placements
- `POST /api/placements` - Create placement opportunity

### Notices
- `GET /api/notices` - Get all notices
- `POST /api/notices` - Create notice (admin)

### Study Materials
- `GET /api/materials` - Get study materials
- `POST /api/materials` - Upload study material

### Lost & Found
- `GET /api/lost-items` - Get lost/found items
- `POST /api/lost-items` - Report lost/found item

### Community
- `GET /api/posts` - Get community posts
- `POST /api/posts` - Create new post

### Analytics
- `GET /api/analytics` - Get platform analytics (admin)

## Project Structure (Clean Architecture)

```
campus-connect-backend/
├── src/
│   ├── core/              # Application core (Clean Architecture)
│   │   ├── application.js # Main application bootstrapper
│   │   ├── config.js      # Centralized configuration management
│   │   └── container.js   # Dependency injection container
│   └── utils/
│       └── helpers.js     # Utility functions and helpers
├── config/                # Database and logging configuration
│   ├── db.js             # Database connection
│   └── winston.js        # Logging configuration
├── controllers/           # Route controllers (Business Logic)
├── middleware/            # Custom middleware (Cross-cutting concerns)
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   ├── rateLimitMiddleware.js
│   ├── securityMiddleware.js
│   └── validationMiddleware.js
├── models/                # Mongoose models (Data Layer)
├── routes/                # API routes (Presentation Layer)
├── templates/             # Email templates
├── tests/                 # Unit and integration tests
├── uploads/               # File uploads directory
├── .env                   # Environment variables
├── .eslintrc.js          # ESLint configuration
├── package.json
├── server.js              # Clean entry point
└── README.md
```

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing configuration
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Comprehensive input validation and sanitization
- **XSS Protection**: Cross-site scripting prevention
- **NoSQL Injection Protection**: MongoDB query sanitization
- **Parameter Pollution Protection**: HPP protection

## Error Handling

The API uses consistent error response formats:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"] // for validation errors
}
```

## Logging

Application logs are stored in:
- `combined.log` - All logs
- `error.log` - Error logs only

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Development

```bash
# Run in development mode with auto-restart
npm run dev

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## Deployment

1. Set `NODE_ENV=production` in your environment
2. Ensure all environment variables are properly set
3. Use a process manager like PM2 for production
4. Set up MongoDB replica set for production use

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support, please contact the development team or create an issue in the repository.