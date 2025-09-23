const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const logger = require('../config/winston');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Additional options for better deliverability
    pool: true,
    maxConnections: 5,
    maxMessages: 100
  });
};

// Cache for compiled templates
const templateCache = new Map();

// Load and compile template
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

// Load base template
const loadBaseTemplate = () => {
  return loadTemplate('base');
};

// Send email with template
const sendTemplatedEmail = async (to, subject, templateName, templateData = {}) => {
  try {
    const transporter = createTransporter();

    // Load templates
    const baseTemplate = loadBaseTemplate();
    const bodyTemplate = loadTemplate(templateName);

    // Prepare template data
    const data = {
      ...templateData,
      email: to,
      year: new Date().getFullYear(),
      subject: subject,
      // Default URLs (should be configured in environment)
      unsubscribe_url: templateData.unsubscribe_url || '#',
      preferences_url: templateData.preferences_url || '#'
    };

    // Generate body content
    const bodyContent = bodyTemplate(data);

    // Generate full HTML
    const html = baseTemplate({
      ...data,
      body: bodyContent
    });

    // Generate text version (strip HTML tags)
    const text = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

    const mailOptions = {
      from: `"Campus Connect" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html,
      text: text,
      // Additional headers for better deliverability
      headers: {
        'X-Mailer': 'Campus Connect Mailer',
        'List-Unsubscribe': `<${data.unsubscribe_url}>`,
        'X-Priority': '3', // Normal priority
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

// Legacy function for backward compatibility
exports.sendVerificationEmail = async (email, otp) => {
  return sendTemplatedEmail(
    email,
    'Campus Connect - Email Verification',
    'verification',
    {
      name: 'User', // You might want to get the actual name from user data
      otp: otp,
      verification_url: `${process.env.FRONTEND_URL}/verify?otp=${otp}`
    }
  );
};

// New templated email functions
exports.sendWelcomeEmail = async (email, userData) => {
  return sendTemplatedEmail(
    email,
    'Welcome to Campus Connect!',
    'welcome',
    {
      name: userData.name || 'User',
      dashboard_url: `${process.env.FRONTEND_URL}/home`,
      docs_url: `${process.env.FRONTEND_URL}/help`,
      community_url: `${process.env.FRONTEND_URL}/community`
    }
  );
};

exports.sendPasswordResetEmail = async (email, resetToken, userData) => {
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

exports.sendEventNotification = async (email, eventData, userData) => {
  return sendTemplatedEmail(
    email,
    `New Event: ${eventData.title}`,
    'event-notification',
    {
      name: userData.name || 'User',
      event_title: eventData.title,
      event_date: new Date(eventData.date).toLocaleDateString(),
      event_location: eventData.campus,
      event_category: eventData.category,
      event_description: eventData.description,
      event_requirements: eventData.requirements || [],
      event_duration: eventData.duration || 'TBD',
      event_url: `${process.env.FRONTEND_URL}/events/${eventData._id}`,
      rsvp_url: `${process.env.FRONTEND_URL}/events/${eventData._id}/rsvp`,
      unsubscribe_events_url: `${process.env.FRONTEND_URL}/preferences`
    }
  );
};

exports.sendPlacementNotification = async (email, placementData, userData) => {
  return sendTemplatedEmail(
    email,
    `New Job Opportunity: ${placementData.jobTitle}`,
    'placement-notification',
    {
      name: userData.name || 'User',
      job_title: placementData.jobTitle,
      company_name: placementData.companyName,
      job_description: placementData.description,
      requirements: placementData.requirements || [],
      salary: placementData.salary,
      application_deadline: placementData.applicationDeadline ?
        new Date(placementData.applicationDeadline).toLocaleDateString() : 'Open until filled',
      apply_url: `${process.env.FRONTEND_URL}/placements/${placementData._id}/apply`,
      company_url: placementData.companyWebsite || '#'
    }
  );
};

exports.sendAnnouncement = async (email, announcementData, userData) => {
  return sendTemplatedEmail(
    email,
    `Important Announcement: ${announcementData.title}`,
    'announcement',
    {
      name: userData.name || 'User',
      announcement_title: announcementData.title,
      announcement_content: announcementData.content,
      announcement_date: new Date(announcementData.createdAt).toLocaleDateString(),
      announcement_priority: announcementData.priority,
      announcement_actions: announcementData.actions || [],
      announcement_deadline: announcementData.deadline ?
        new Date(announcementData.deadline).toLocaleDateString() : null,
      contact_email: announcementData.contactEmail || 'admin@campusconnect.com',
      contact_phone: announcementData.contactPhone,
      contact_office: announcementData.contactOffice,
      action_url: announcementData.actionUrl,
      action_text: announcementData.actionText || 'Learn More'
    }
  );
};

// Generic email sender for custom templates
exports.sendCustomEmail = async (to, subject, templateName, data = {}) => {
  return sendTemplatedEmail(to, subject, templateName, data);
};

// Test email function
exports.sendTestEmail = async (email) => {
  return sendTemplatedEmail(
    email,
    'Campus Connect - Test Email',
    'verification',
    {
      name: 'Test User',
      otp: '123456',
      verification_url: `${process.env.FRONTEND_URL}/verify?otp=123456`
    }
  );
};