const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const logger = require('./logger');

const createTransporter = () => {
  logger.info('Creating email transporter with config:', {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER ? 'SET' : 'NOT SET',
    pass: process.env.EMAIL_PASS ? 'SET' : 'NOT SET'
  });

  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    logger.error('Missing required email environment variables');
    throw new Error('Email configuration incomplete');
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 100
  });
};

const templateCache = new Map();

const loadTemplate = (templateName) => {
  if (templateCache.has(templateName)) {
    return templateCache.get(templateName);
  }

  try {
    const templatePath = path.join(__dirname, '../templates', `${templateName}.html`);
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const compiledTemplate = handlebars.compile(templateSource);
    templateCache.set(templateName, compiledTemplate);
    return compiledTemplate;
  } catch (error) {
    logger.error(`Error loading template ${templateName}:`, error);
    throw new Error(`Template ${templateName} not found`);
  }
};

const loadBaseTemplate = () => {
  return loadTemplate('base');
};

const sendTemplatedEmail = async (to, subject, templateName, templateData = {}) => {
  try {
    logger.info(`Attempting to send ${templateName} email to ${to}`);

    const transporter = createTransporter();

    const baseTemplate = loadBaseTemplate();
    const bodyTemplate = loadTemplate(templateName);

    const data = {
      ...templateData,
      email: to,
      year: new Date().getFullYear(),
      subject: subject,
      unsubscribe_url: templateData.unsubscribe_url || '#',
      preferences_url: templateData.preferences_url || '#'
    };

    const bodyContent = bodyTemplate(data);

    const html = baseTemplate({
      ...data,
      body: bodyContent
    });

    const text = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

    const mailOptions = {
      from: `"Campus Connect" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html,
      text: text,
      headers: {
        'X-Mailer': 'Campus Connect Mailer',
        'List-Unsubscribe': `<${data.unsubscribe_url}>`,
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal'
      }
    };

    const info = await transporter.sendMail(mailOptions);

    logger.info(`Email sent successfully to ${to}`, {
      messageId: info.messageId,
      template: templateName,
      subject: subject
    });

    return {
      success: true,
      messageId: info.messageId,
      template: templateName
    };

  } catch (error) {
    logger.error(`Error sending templated email to ${to}:`, error);
    throw error;
  }
};
const sendOTPEmail = async (email, otp, name) => {
  return sendTemplatedEmail(
    email,
    'Campus Connect - Email Verification',
    'verification',
    {
      name: name || 'User',
      otp: otp
    }
  );
};

const sendWelcomeEmail = async (email, name) => {
  return sendTemplatedEmail(
    email,
    'Welcome to Campus Connect!',
    'welcome',
    {
      name: name || 'User',
      dashboard_url: `${process.env.FRONTEND_URL}/home`,
      docs_url: `${process.env.FRONTEND_URL}/help`,
      community_url: `${process.env.FRONTEND_URL}/community`
    }
  );
};

const sendPasswordResetEmail = async (email, resetToken, userData) => {
  return sendTemplatedEmail(
    email,
    'Reset Your Password',
    'password-reset',
    {
      name: userData.name || 'User',
      reset_url: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
    }
  );
};

const sendAdminNewUserNotification = async (adminEmail, userData) => {
  return sendTemplatedEmail(
    adminEmail,
    'New User Registration',
    'announcement',
    {
      name: 'Admin',
      announcement_title: 'New User Registration',
      announcement_content: `A new user has registered: ${userData.name} (${userData.email}) from ${userData.department} ${userData.semester}`,
      announcement_date: new Date().toLocaleDateString(),
      announcement_priority: 'medium'
    }
  );
};
module.exports = {
  sendOTPEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendAdminNewUserNotification,
  sendTemplatedEmail
};
