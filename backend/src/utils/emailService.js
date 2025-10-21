const nodemailer = require('nodemailer');
const {
  otpVerificationTemplate,
  welcomeEmailTemplate,
  passwordResetTemplate,
  adminNewUserNotificationTemplate,
  eventReminderTemplate,
  achievementUnlockedTemplate,
  weeklyDigestTemplate
} = require('../utils/emailTemplates');
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD
    }
  });
};
const sendOTPEmail = async (to, otp, name = 'User') => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: {
        name: 'Campus Connect',
        address: process.env.EMAIL_USER
      },
      to,
      subject: 'Your OTP for Campus Connect',
      html: otpVerificationTemplate(otp, name)
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};
const sendWelcomeEmail = async (to, name) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: {
        name: 'Campus Connect',
        address: process.env.EMAIL_USER
      },
      to,
      subject: 'Welcome to Campus Connect!',
      html: welcomeEmailTemplate(name)
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw new Error('Failed to send welcome email');
  }
};
const sendPasswordResetEmail = async (to, resetToken, name) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: {
        name: 'Campus Connect',
        address: process.env.EMAIL_USER
      },
      to,
      subject: 'Password Reset Request',
      html: passwordResetTemplate(resetToken, name)
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};
const sendAdminNewUserNotification = async (adminEmail, userData) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: {
        name: 'Campus Connect System',
        address: process.env.EMAIL_USER
      },
      to: adminEmail,
      subject: 'New User Registration Notification',
      html: adminNewUserNotificationTemplate(userData)
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Admin notification email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    throw new Error('Failed to send admin notification email');
  }
};
const sendEventReminderEmail = async (to, eventData, userName) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: {
        name: 'Campus Connect Events',
        address: process.env.EMAIL_USER
      },
      to,
      subject: `Event Reminder: ${eventData.title}`,
      html: eventReminderTemplate(eventData, userName)
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Event reminder email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending event reminder email:', error);
    throw new Error('Failed to send event reminder email');
  }
};
const sendAchievementUnlockedEmail = async (to, achievementData, userName) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: {
        name: 'Campus Connect Achievements',
        address: process.env.EMAIL_USER
      },
      to,
      subject: `🏆 Achievement Unlocked: ${achievementData.title}`,
      html: achievementUnlockedTemplate(achievementData, userName)
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Achievement unlocked email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending achievement unlocked email:', error);
    throw new Error('Failed to send achievement unlocked email');
  }
};
const sendWeeklyDigestEmail = async (to, userName, stats) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: {
        name: 'Campus Connect Weekly Digest',
        address: process.env.EMAIL_USER
      },
      to,
      subject: 'Your Weekly Campus Connect Digest',
      html: weeklyDigestTemplate(userName, stats)
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Weekly digest email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending weekly digest email:', error);
    throw new Error('Failed to send weekly digest email');
  }
};
module.exports = {
  sendOTPEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendAdminNewUserNotification,
  sendEventReminderEmail,
  sendAchievementUnlockedEmail,
  sendWeeklyDigestEmail
};
