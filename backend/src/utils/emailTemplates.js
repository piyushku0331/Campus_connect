const otpVerificationTemplate = (otp, name) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification - Campus Connect</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
      .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
      .header { text-align: center; padding: 20px 0; background-color: #6B9FFF; color: white; border-radius: 8px 8px 0 0; }
      .content { padding: 20px; text-align: center; }
      .otp-code { font-size: 32px; font-weight: bold; color: #6B9FFF; margin: 20px 0; letter-spacing: 5px; }
      .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Campus Connect</h1>
        <p>OTP Verification</p>
      </div>
      <div class="content">
        <h2>Hello ${name},</h2>
        <p>Your One-Time Password (OTP) for verification is:</p>
        <div class="otp-code">${otp}</div>
        <p>This OTP will expire in 10 minutes. Please do not share this code with anyone.</p>
        <p>If you didn't request this OTP, please ignore this email.</p>
      </div>
      <div class="footer">
        <p>&copy; 2024 Campus Connect. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
`;

const welcomeEmailTemplate = (name) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Campus Connect</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
      .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
      .header { text-align: center; padding: 20px 0; background-color: #6B9FFF; color: white; border-radius: 8px 8px 0 0; }
      .content { padding: 20px; }
      .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Welcome to Campus Connect!</h1>
      </div>
      <div class="content">
        <h2>Hello ${name},</h2>
        <p>Welcome to Campus Connect! We're excited to have you join our community.</p>
        <p>Start exploring:</p>
        <ul>
          <li>Connect with fellow students</li>
          <li>Discover campus events</li>
          <li>Share and access study resources</li>
          <li>Earn points and unlock achievements</li>
        </ul>
        <p>Let's make your campus experience amazing!</p>
      </div>
      <div class="footer">
        <p>&copy; 2024 Campus Connect. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
`;

const passwordResetTemplate = (resetToken, name) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset - Campus Connect</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
      .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
      .header { text-align: center; padding: 20px 0; background-color: #6B9FFF; color: white; border-radius: 8px 8px 0 0; }
      .content { padding: 20px; }
      .reset-link { display: inline-block; padding: 10px 20px; background-color: #6B9FFF; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
      .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Password Reset Request</h1>
      </div>
      <div class="content">
        <h2>Hello ${name},</h2>
        <p>You have requested to reset your password for Campus Connect.</p>
        <p>Please click the link below to reset your password:</p>
        <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}" class="reset-link">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this password reset, please ignore this email.</p>
      </div>
      <div class="footer">
        <p>&copy; 2024 Campus Connect. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
`;

const adminNewUserNotificationTemplate = (userData) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New User Registration - Campus Connect</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
      .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
      .header { text-align: center; padding: 20px 0; background-color: #6B9FFF; color: white; border-radius: 8px 8px 0 0; }
      .content { padding: 20px; }
      .user-info { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; }
      .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>New User Registration</h1>
      </div>
      <div class="content">
        <p>A new user has registered on Campus Connect:</p>
        <div class="user-info">
          <p><strong>Name:</strong> ${userData.name}</p>
          <p><strong>Email:</strong> ${userData.email}</p>
          <p><strong>Registration Date:</strong> ${new Date().toLocaleString()}</p>
        </div>
      </div>
      <div class="footer">
        <p>&copy; 2024 Campus Connect. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
`;

const eventReminderTemplate = (eventData, userName) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event Reminder - Campus Connect</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
      .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
      .header { text-align: center; padding: 20px 0; background-color: #6B9FFF; color: white; border-radius: 8px 8px 0 0; }
      .content { padding: 20px; }
      .event-info { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; }
      .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Event Reminder</h1>
      </div>
      <div class="content">
        <h2>Hello ${userName},</h2>
        <p>This is a reminder for an upcoming event:</p>
        <div class="event-info">
          <h3>${eventData.title}</h3>
          <p><strong>Date:</strong> ${new Date(eventData.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${eventData.time}</p>
          <p><strong>Location:</strong> ${eventData.location}</p>
          <p><strong>Description:</strong> ${eventData.description}</p>
        </div>
        <p>We look forward to seeing you there!</p>
      </div>
      <div class="footer">
        <p>&copy; 2024 Campus Connect. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
`;

const achievementUnlockedTemplate = (achievementData, userName) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Achievement Unlocked - Campus Connect</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
      .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
      .header { text-align: center; padding: 20px 0; background-color: #FFD700; color: #333; border-radius: 8px 8px 0 0; }
      .content { padding: 20px; text-align: center; }
      .achievement-icon { font-size: 48px; margin: 20px 0; }
      .achievement-info { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; }
      .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🏆 Achievement Unlocked!</h1>
      </div>
      <div class="content">
        <h2>Congratulations ${userName}!</h2>
        <div class="achievement-icon">🎉</div>
        <div class="achievement-info">
          <h3>${achievementData.title}</h3>
          <p>${achievementData.description}</p>
          <p><strong>Points Earned:</strong> ${achievementData.points}</p>
        </div>
        <p>Keep up the great work and unlock more achievements!</p>
      </div>
      <div class="footer">
        <p>&copy; 2024 Campus Connect. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
`;

const weeklyDigestTemplate = (userName, stats) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Weekly Digest - Campus Connect</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
      .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
      .header { text-align: center; padding: 20px 0; background-color: #6B9FFF; color: white; border-radius: 8px 8px 0 0; }
      .content { padding: 20px; }
      .stats { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; }
      .stat-item { display: flex; justify-content: space-between; margin: 10px 0; }
      .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Your Weekly Digest</h1>
      </div>
      <div class="content">
        <h2>Hello ${userName},</h2>
        <p>Here's your weekly activity summary on Campus Connect:</p>
        <div class="stats">
          <div class="stat-item">
            <span>Points Earned:</span>
            <strong>${stats.pointsEarned || 0}</strong>
          </div>
          <div class="stat-item">
            <span>Events Attended:</span>
            <strong>${stats.eventsAttended || 0}</strong>
          </div>
          <div class="stat-item">
            <span>Connections Made:</span>
            <strong>${stats.connectionsMade || 0}</strong>
          </div>
          <div class="stat-item">
            <span>Resources Shared:</span>
            <strong>${stats.resourcesShared || 0}</strong>
          </div>
          <div class="stat-item">
            <span>Achievements Unlocked:</span>
            <strong>${stats.achievementsUnlocked || 0}</strong>
          </div>
        </div>
        <p>Keep engaging with the community to earn more points and achievements!</p>
      </div>
      <div class="footer">
        <p>&copy; 2024 Campus Connect. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
`;

module.exports = {
  otpVerificationTemplate,
  welcomeEmailTemplate,
  passwordResetTemplate,
  adminNewUserNotificationTemplate,
  eventReminderTemplate,
  achievementUnlockedTemplate,
  weeklyDigestTemplate
};