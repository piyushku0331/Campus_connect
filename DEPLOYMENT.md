# 🚀 Deployment Guide for Campus Connect

This guide provides comprehensive instructions for deploying Campus Connect to production environments.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Deployment Options](#deployment-options)
- [Frontend Deployment](#frontend-deployment)
- [Backend Deployment](#backend-deployment)
- [Database Deployment](#database-deployment)
- [Environment Configuration](#environment-configuration)
- [SSL/TLS Setup](#ssltls-setup)
- [Monitoring & Analytics](#monitoring--analytics)
- [Backup & Recovery](#backup--recovery)
- [Performance Optimization](#performance-optimization)
- [Troubleshooting](#troubleshooting)

## 📋 Prerequisites

### System Requirements

- **Node.js**: v16 or higher
- **NPM**: v7 or higher
- **Git**: Latest version
- **SSL Certificate**: For HTTPS deployment

### Cloud Accounts

- **Vercel/Netlify**: For frontend hosting
- **Railway/Render**: For backend hosting
- **Supabase**: For database and authentication
- **Cloudflare**: For CDN and DNS (optional)

### Domain & DNS

- Custom domain (recommended)
- DNS management access
- SSL certificate management

## 🌐 Deployment Options

### Recommended Production Stack

| Component | Provider | Why Chosen |
|-----------|----------|------------|
| **Frontend** | Vercel | Global CDN, automatic deployments, great DX |
| **Backend** | Railway | Simple deployment, good performance, affordable |
| **Database** | Supabase | Managed PostgreSQL, real-time features, auth |
| **CDN** | Cloudflare | Global edge network, security, analytics |

### Alternative Stacks

#### **AWS Stack**
- **Frontend**: AWS Amplify / S3 + CloudFront
- **Backend**: AWS Elastic Beanstalk / Lambda
- **Database**: AWS RDS PostgreSQL

#### **Google Cloud Stack**
- **Frontend**: Firebase Hosting
- **Backend**: Google Cloud Run
- **Database**: Google Cloud SQL

#### **DIY Stack**
- **Frontend**: Nginx + static hosting
- **Backend**: PM2 + Node.js
- **Database**: Self-hosted PostgreSQL

## 🎨 Frontend Deployment

### Vercel Deployment (Recommended)

#### **One-Click Deploy**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/campus-connect)

#### **Manual Deployment**

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login to Vercel
   vercel login

   # Deploy from project root
   cd frontend
   vercel --prod
   ```

2. **Vercel Configuration**
   ```json
   // vercel.json
   {
     "version": 2,
     "builds": [
       {
         "src": "package.json",
         "use": "@vercel/static-build",
         "config": {
           "distDir": "dist"
         }
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "https://your-backend-url.com/api/$1"
       },
       {
         "src": "/(.*)",
         "dest": "/index.html"
       }
     ],
     "env": {
       "VITE_SUPABASE_URL": "@supabase-url",
       "VITE_SUPABASE_ANON_KEY": "@supabase-anon-key"
     }
   }
   ```

3. **Environment Variables**
   ```bash
   # Set environment variables in Vercel dashboard
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_API_URL=https://your-backend-domain.com/api
   ```

### Netlify Deployment

1. **Connect Repository**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Build Configuration**
   ```toml
   # netlify.toml
   [build]
     publish = "dist"
     command = "npm run build"

   [build.environment]
     NODE_VERSION = "18"

   [[redirects]]
     from = "/api/*"
     to = "https://your-backend-url.com/api/:splat"
     status = 200

   [context.production.environment]
     VITE_SUPABASE_URL = "your-supabase-url"
     VITE_SUPABASE_ANON_KEY = "your-anon-key"
   ```

## 🖥️ Backend Deployment

### Railway Deployment (Recommended)

#### **One-Click Deploy**

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/your-username/campus-connect&envs=PORT,DATABASE_URL,JWT_SECRET,SUPABASE_URL,SUPABASE_SERVICE_ROLE_KEY,FRONTEND_URL)

#### **Manual Deployment**

1. **Connect Repository**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli

   # Login to Railway
   railway login

   # Initialize project
   cd backend
   railway init

   # Deploy
   railway deploy
   ```

2. **Railway Configuration**
   ```json
   // package.json scripts for Railway
   {
     "scripts": {
       "start": "node src/server.js",
       "build": "echo 'No build step required'",
       "railway:start": "npm start"
     }
   }
   ```

3. **Environment Variables**
   ```bash
   # Set in Railway dashboard
   PORT=5000
   NODE_ENV=production
   DATABASE_URL=postgresql://...
   JWT_SECRET=your-jwt-secret
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   FRONTEND_URL=https://your-frontend-domain.com
   ```

### Render Deployment

1. **Create Web Service**
   - Go to [Render](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your repository

2. **Service Configuration**
   ```
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Environment: Production
   ```

3. **Environment Variables**
   ```
   PORT=10000
   NODE_ENV=production
   DATABASE_URL=your-database-url
   JWT_SECRET=your-jwt-secret
   SUPABASE_URL=your-supabase-url
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   FRONTEND_URL=your-frontend-url
   ```

## 🗄️ Database Deployment

### Supabase Setup

#### **Project Creation**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose organization and region
4. Set project name and password

#### **Database Schema Deployment**
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push

# Apply RLS policies
supabase db reset
```

#### **Environment Variables**
```bash
# Copy from Supabase dashboard → Settings → API
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Database Backup Strategy

#### **Automated Backups**
```sql
-- Enable point-in-time recovery
ALTER DATABASE your_database SET wal_level = replica;

-- Create backup schedule
CREATE EXTENSION pg_cron;
SELECT cron.schedule('daily-backup', '0 2 * * *', 'SELECT pg_backup_start()');
```

#### **Manual Backup**
```bash
# Using pg_dump
pg_dump -h your-host -U your-user -d your-database > backup.sql

# Using Supabase CLI
supabase db dump --db-url your-connection-string > backup.sql
```

## ⚙️ Environment Configuration

### Production Environment Variables

#### **Frontend (.env.production)**
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# API Configuration
VITE_API_URL=https://your-backend-domain.com/api

# Analytics (Optional)
VITE_GA_TRACKING_ID=GA-XXXXXXXXXX
VITE_MIXPANEL_TOKEN=your-mixpanel-token

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true
```

#### **Backend (.env.production)**
```env
# Server Configuration
PORT=5000
NODE_ENV=production
HOST=0.0.0.0

# Database Configuration
DATABASE_URL=postgresql://user:password@host:5432/database

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-here
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# CORS Configuration
FRONTEND_URL=https://your-frontend-domain.com
ALLOWED_ORIGINS=https://your-frontend-domain.com,https://www.your-frontend-domain.com

# Security
SESSION_SECRET=your-session-secret-here
ENCRYPTION_KEY=your-32-character-encryption-key

# Monitoring
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=info
```

### Environment Validation

```javascript
// backend/src/utils/envValidation.js
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'FRONTEND_URL'
];

export const validateEnvironment = () => {
  const missing = requiredEnvVars.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  console.log('✅ All environment variables validated');
};
```

## 🔒 SSL/TLS Setup

### Automatic SSL (Recommended)

#### **Vercel + Railway**
- SSL certificates are automatically provisioned
- Renewals handled automatically
- Custom domains supported

#### **Cloudflare SSL**
```bash
# Enable Always Use HTTPS
# Set SSL/TLS encryption mode to "Full (strict)"

# Page Rules for security headers
# URL: https://your-domain.com/*
# Setting: Security Header
```

### Manual SSL Setup

#### **Certbot (Let's Encrypt)**
```bash
# Install Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Automatic renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 Monitoring & Analytics

### Application Monitoring

#### **Sentry Setup**
```javascript
// frontend/src/utils/sentry.js
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

#### **Backend Monitoring**
```javascript
// backend/src/middleware/monitoring.js
const responseTime = require('response-time');
const logger = require('../utils/logger');

app.use(responseTime((req, res, time) => {
  logger.info(`${req.method} ${req.url} - ${time}ms`);
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### Performance Monitoring

#### **Core Web Vitals Tracking**
```javascript
// frontend/src/utils/analytics.js
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

#### **Database Performance**
```sql
-- Query performance monitoring
CREATE EXTENSION pg_stat_statements;

-- Slow query log
SET log_min_duration_statement = '1000'; -- Log queries > 1 second

-- Index usage analysis
SELECT
  schemaname, tablename, attname, n_distinct,
  correlation
FROM pg_stats
WHERE schemaname = 'public'
ORDER BY n_distinct DESC;
```

### Analytics Setup

#### **Google Analytics 4**
```html
<!-- frontend/index.html -->
<head>
  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=GA-XXXXXXXXXX"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA-XXXXXXXXXX');
  </script>
</head>
```

#### **Custom Analytics**
```javascript
// frontend/src/utils/analytics.js
export const trackEvent = (eventName, properties = {}) => {
  // Send to multiple analytics services
  if (window.gtag) {
    window.gtag('event', eventName, properties);
  }

  if (window.mixpanel) {
    window.mixpanel.track(eventName, properties);
  }

  // Custom analytics endpoint
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event: eventName, properties, timestamp: Date.now() })
  });
};
```

## 💾 Backup & Recovery

### Automated Backup Strategy

#### **Database Backups**
```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="campus_connect"
DB_USER="postgres"

pg_dump -U $DB_USER -h localhost $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete

# Upload to cloud storage
aws s3 cp $BACKUP_DIR/backup_$DATE.sql s3://your-backup-bucket/
```

#### **File Backups**
```bash
# User uploaded files backup
#!/bin/bash
SOURCE_DIR="/uploads"
BACKUP_DIR="/backups/files"
DATE=$(date +%Y%m%d)

tar -czf $BACKUP_DIR/files_$DATE.tar.gz $SOURCE_DIR

# Upload to cloud
rclone copy $BACKUP_DIR/files_$DATE.tar.gz remote:backups/
```

### Disaster Recovery

#### **Recovery Procedures**
```bash
# Database recovery
psql -U postgres -d campus_connect < backup_file.sql

# File recovery
tar -xzf files_backup.tar.gz -C /uploads

# Application rollback
git checkout previous-working-commit
npm run build
pm2 restart all
```

## ⚡ Performance Optimization

### Frontend Optimizations

#### **Bundle Analysis**
```bash
# Analyze bundle size
cd frontend
npm install --save-dev webpack-bundle-analyzer
npm run build -- --analyze

# Or use vite-bundle-analyzer
npx vite-bundle-analyzer dist
```

#### **Code Splitting**
```javascript
// Dynamic imports for route-based splitting
const Home = lazy(() => import('../pages/Home'));
const Dashboard = lazy(() => import('../pages/Dashboard'));

// Component-based splitting
const HeavyComponent = lazy(() => import('../components/HeavyComponent'));
```

#### **Image Optimization**
```javascript
// Automatic image optimization
import image from '../assets/hero.jpg?webp&w=800&h=600&quality=80';

// Lazy loading
<img
  loading="lazy"
  src={image}
  alt="Hero image"
  width="800"
  height="600"
/>
```

### Backend Optimizations

#### **Database Query Optimization**
```javascript
// Use indexes effectively
const getPosts = async (userId, limit = 10) => {
  const posts = await db.query(`
    SELECT p.*, u.full_name, u.avatar
    FROM posts p
    JOIN users u ON p.author_id = u.id
    WHERE p.author_id = $1 OR p.author_id IN (
      SELECT friend_id FROM friendships WHERE user_id = $1
    )
    ORDER BY p.created_at DESC
    LIMIT $2
  `, [userId, limit]);

  return posts;
};
```

#### **Caching Strategy**
```javascript
// Redis caching for frequently accessed data
const cache = require('redis').createClient();

const getCachedUser = async (userId) => {
  const cacheKey = `user:${userId}`;

  // Try cache first
  const cached = await cache.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // Fetch from database
  const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);

  // Cache for 5 minutes
  await cache.setex(cacheKey, 300, JSON.stringify(user));

  return user;
};
```

### CDN & Edge Computing

#### **Cloudflare Configuration**
```toml
# wrangler.toml for Cloudflare Workers
name = "campus-connect"
main = "src/index.js"
compatibility_date = "2024-01-01"

[build]
command = "npm run build"

[[build.upload]]
format = "service-worker"
```

## 🔧 Troubleshooting

### Common Deployment Issues

#### **Build Failures**
```bash
# Clear cache and rebuild
rm -rf node_modules/.cache
npm run clean
npm install
npm run build
```

#### **Environment Variable Issues**
```bash
# Check environment variables
node -e "console.log(process.env)"

# Validate required variables
node -e "require('./src/utils/envValidation.js').validateEnvironment()"
```

#### **Database Connection Issues**
```bash
# Test database connection
psql "postgresql://user:password@host:5432/database" -c "SELECT 1"

# Check Supabase connection
curl -H "apikey: your-anon-key" https://your-project.supabase.co/rest/v1/
```

#### **SSL Certificate Issues**
```bash
# Check certificate validity
openssl s_client -connect your-domain.com:443 -servername your-domain.com

# Renew certificate
certbot renew --dry-run
certbot renew
```

### Performance Issues

#### **High Memory Usage**
```bash
# Monitor memory usage
pm2 monit

# Check for memory leaks
node --inspect --max-old-space-size=4096 src/server.js

# Implement memory monitoring
const memUsage = process.memoryUsage();
console.log(`Memory usage: ${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`);
```

#### **Slow API Responses**
```javascript
// Add response time logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} - ${duration}ms`);
  });
  next();
});
```

### Monitoring Dashboards

#### **Uptime Monitoring**
- **UptimeRobot**: Free tier for basic monitoring
- **Pingdom**: Advanced uptime and performance monitoring
- **New Relic**: Comprehensive application monitoring

#### **Error Tracking**
- **Sentry**: Real-time error tracking and alerting
- **Rollbar**: Error monitoring with deployment tracking
- **Bugsnag**: Crash reporting and stability monitoring

---

## 📞 Support & Resources

### Documentation Links

- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Node.js Deployment Guide](https://nodejs.org/en/docs/guides/)

### Community Support

- **GitHub Issues**: Bug reports and feature requests
- **Discord Community**: Real-time support and discussions
- **Stack Overflow**: Technical questions with `campus-connect` tag

### Emergency Contacts

- **Critical Issues**: security@campusconnect.com
- **Infrastructure**: infra@campusconnect.com
- **Database**: db-admin@campusconnect.com

---

**Happy Deploying! 🚀**

*This guide is continuously updated. Last updated: January 2024*