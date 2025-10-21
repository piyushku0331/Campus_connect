const createBaseTemplate = (content, title = 'Campus Connect') => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} - Campus Connect</title>
      <style>
        body {
          font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .email-container {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #6B9FFF 0%, #7F40FF 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .header p {
          margin: 8px 0 0 0;
          opacity: 0.9;
          font-size: 16px;
        }
        .content {
          padding: 40px 30px;
        }
        .footer {
          background: #f8f9fa;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e9ecef;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #6B9FFF 0%, #7F40FF 100%);
          color: white;
          padding: 14px 32px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          margin: 20px 0;
          box-shadow: 0 4px 12px rgba(107, 159, 255, 0.3);
          transition: all 0.3s ease;
        }
        .button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(107, 159, 255, 0.4);
        }
        .otp-code {
          font-size: 36px;
          font-weight: 700;
          color: #6B9FFF;
          text-align: center;
          margin: 24px 0;
          letter-spacing: 8px;
          font-family: 'Courier New', monospace;
          background: #f8f9fa;
          padding: 16px;
          border-radius: 8px;
          border: 2px dashed #6B9FFF;
        }
        .warning {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          color: #856404;
          padding: 16px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .success {
          background: #d4edda;
          border: 1px solid #c3e6cb;
          color: #155724;
          padding: 16px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .info {
          background: #d1ecf1;
          border: 1px solid #bee5eb;
          color: #0c5460;
          padding: 16px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .features {
          background: #f8f9fa;
          padding: 24px;
          border-radius: 8px;
          margin: 24px 0;
        }
        .feature-list {
          list-style: none;
          padding: 0;
        }
        .feature-list li {
          margin: 12px 0;
          padding-left: 24px;
          position: relative;
        }
        .feature-list li:before {
          content: "✓";
          color: #6B9FFF;
          font-weight: bold;
          position: absolute;
          left: 0;
        }
        .social-links {
          margin: 20px 0;
        }
        .social-links a {
          display: inline-block;
          margin: 0 8px;
          color: #6B9FFF;
          text-decoration: none;
          font-weight: 500;
        }
        .divider {
          height: 1px;
          background: #e9ecef;
          margin: 30px 0;
        }
        @media (max-width: 600px) {
          body { padding: 10px; }
          .header { padding: 30px 20px; }
          .header h1 { font-size: 24px; }
          .content { padding: 30px 20px; }
          .footer { padding: 20px; }
          .otp-code { font-size: 28px; letter-spacing: 4px; }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>🎓 Campus Connect</h1>
          <p>${title}</p>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <div class="divider"></div>
          <p><strong>Campus Connect</strong> - Your Digital Community Platform</p>
          <p>Chitkara University, Punjab, India</p>
          <div class="social-links">
            <a href="#">Website</a> |
            <a href="#">Support</a> |
            <a href="#">Privacy Policy</a>
          </div>
          <p style="font-size: 12px; color: #6c757d; margin-top: 20px;">
            This is an automated message. Please do not reply to this email.<br>
            If you have any questions, contact us at <a href="mailto:support@campusconnect.com">support@campusconnect.com</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};
const otpVerificationTemplate = (otp, name) => {
  const content = `
    <h2>Hello ${name}!</h2>
    <p>Welcome to <strong>Campus Connect</strong>! To complete your account verification, please use the following One-Time Password (OTP):</p>
    <div class="otp-code">${otp}</div>
    <div class="warning">
      <strong>Important Security Information:</strong>
      <ul style="margin: 8px 0; padding-left: 20px;">
        <li>This OTP is valid for <strong>10 minutes</strong> only</li>
        <li>Do not share this code with anyone</li>
        <li>If you didn't request this, please ignore this email</li>
        <li>Each OTP can only be used once</li>
      </ul>
    </div>
    <p>If you're having trouble copying the code, you can also enter it manually in the verification form.</p>
    <p>Once verified, you'll have full access to all Campus Connect features including study materials, events, networking, and much more!</p>
    <p>Best regards,<br><strong>The Campus Connect Team</strong></p>
  `;
  return createBaseTemplate(content, 'Account Verification');
};
const welcomeEmailTemplate = (name) => {
  const content = `
    <div class="success">
      <h3 style="margin-top: 0;">🎉 Welcome to Campus Connect, ${name}!</h3>
      <p>Your account has been successfully verified. You're now part of the Chitkara University community!</p>
    </div>
    <h3>What can you do now?</h3>
    <div class="features">
      <h4>🚀 Explore These Amazing Features:</h4>
      <ul class="feature-list">
        <li><strong>Study Materials:</strong> Access and share notes, PDFs, and resources</li>
        <li><strong>Events & Calendar:</strong> Discover campus events and RSVP</li>
        <li><strong>Alumni Network:</strong> Connect with successful graduates</li>
        <li><strong>Lost & Found:</strong> Help reunite lost items with their owners</li>
        <li><strong>Real-time Chat:</strong> Group and direct messaging</li>
        <li><strong>Gamification:</strong> Earn points and unlock achievements</li>
        <li><strong>University Directory:</strong> Find contacts and resources</li>
      </ul>
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.FRONTEND_URL || 'http:
        🚀 Start Exploring Campus Connect
      </a>
    </div>
    <h3>Getting Started Tips:</h3>
    <div class="info">
      <ul style="margin: 0; padding-left: 20px;">
        <li>Complete your profile to get personalized recommendations</li>
        <li>Upload your study materials to help fellow students</li>
        <li>Join events and connect with alumni in your field</li>
        <li>Earn points by contributing to the community</li>
      </ul>
    </div>
    <p>We're excited to have you join our community! If you have any questions or need assistance, don't hesitate to reach out to our support team.</p>
    <p>Welcome aboard! 🎓✨</p>
    <p>Best regards,<br><strong>The Campus Connect Team</strong></p>
  `;
  return createBaseTemplate(content, 'Welcome to Campus Connect');
};
const passwordResetTemplate = (resetToken, name) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http:
  const content = `
    <h2>Password Reset Request</h2>
    <p>Hello ${name},</p>
    <p>We received a request to reset your password for your Campus Connect account. If you made this request, click the button below to reset your password:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" class="button">
        🔐 Reset My Password
      </a>
    </div>
    <div class="warning">
      <strong>Security Notice:</strong>
      <ul style="margin: 8px 0; padding-left: 20px;">
        <li>This link is valid for <strong>1 hour</strong> only</li>
        <li>The link can only be used once</li>
        <li>If you didn't request this reset, please ignore this email</li>
        <li>Your password will remain unchanged until you click the link</li>
      </ul>
    </div>
    <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
    <p style="word-break: break-all; background: #f8f9fa; padding: 12px; border-radius: 4px; font-family: monospace; font-size: 14px;">
      ${resetUrl}
    </p>
    <p>For security reasons, we recommend changing your password regularly and using a strong, unique password.</p>
    <p>If you have any questions or concerns, please contact our support team immediately.</p>
    <p>Best regards,<br><strong>The Campus Connect Security Team</strong></p>
  `;
  return createBaseTemplate(content, 'Password Reset');
};
const adminNewUserNotificationTemplate = (userData) => {
  const content = `
    <h2>🎉 New User Registration</h2>
    <p>A new user has successfully registered and verified their account on Campus Connect!</p>
    <div class="info">
      <h3>User Details:</h3>
      <ul style="margin: 8px 0; padding-left: 20px;">
        <li><strong>Name:</strong> ${userData.name}</li>
        <li><strong>Email:</strong> ${userData.email}</li>
        <li><strong>Department:</strong> ${userData.department}</li>
        <li><strong>Semester:</strong> ${userData.semester}</li>
        <li><strong>Age:</strong> ${userData.age}</li>
        <li><strong>Registration Date:</strong> ${new Date().toLocaleString()}</li>
      </ul>
    </div>
    <p>The user has completed the email verification process and is now active on the platform.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.FRONTEND_URL || 'http:
        👥 View All Users
      </a>
    </div>
    <p>Keep up the great work building our community! 🌟</p>
    <p>Best regards,<br><strong>Campus Connect System</strong></p>
  `;
  return createBaseTemplate(content, 'New User Registration');
};
const eventReminderTemplate = (eventData, userName) => {
  const content = `
    <h2>📅 Event Reminder</h2>
    <p>Hello ${userName},</p>
    <p>This is a friendly reminder about an upcoming event you're registered for:</p>
    <div class="features">
      <h3>${eventData.title}</h3>
      <ul style="margin: 8px 0; padding-left: 20px;">
        <li><strong>📅 Date:</strong> ${new Date(eventData.date).toLocaleDateString()}</li>
        <li><strong>🕐 Time:</strong> ${eventData.time}</li>
        <li><strong>📍 Location:</strong> ${eventData.location}</li>
        <li><strong>👥 Organizer:</strong> ${eventData.organizer}</li>
      </ul>
      ${eventData.description ? `<p><strong>Description:</strong> ${eventData.description}</p>` : ''}
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.FRONTEND_URL || 'http:
        📋 View Event Details
      </a>
    </div>
    <p>We look forward to seeing you there! If you can no longer attend, please update your RSVP status.</p>
    <p>Best regards,<br><strong>The Campus Connect Events Team</strong></p>
  `;
  return createBaseTemplate(content, 'Event Reminder');
};
const achievementUnlockedTemplate = (achievementData, userName) => {
  const content = `
    <div class="success">
      <h2>🏆 Achievement Unlocked!</h2>
      <p>Congratulations ${userName}! You've earned a new achievement!</p>
    </div>
    <div class="features" style="text-align: center;">
      <h3 style="color: #6B9FFF; margin-bottom: 16px;">${achievementData.icon} ${achievementData.title}</h3>
      <p style="font-size: 18px; margin: 16px 0;">${achievementData.description}</p>
      <p style="color: #6B9FFF; font-weight: bold; font-size: 20px;">+${achievementData.points} Points</p>
    </div>
    <p>You've earned <strong>${achievementData.points} points</strong> for this achievement! Keep up the great work contributing to our community.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.FRONTEND_URL || 'http:
        🏆 View My Achievements
      </a>
    </div>
    <h3>Recent Activity:</h3>
    <p>Continue engaging with the platform to unlock more achievements and climb the leaderboard!</p>
    <p>Amazing work! 🎉</p>
    <p>Best regards,<br><strong>The Campus Connect Team</strong></p>
  `;
  return createBaseTemplate(content, 'Achievement Unlocked');
};
const weeklyDigestTemplate = (userName, stats) => {
  const content = `
    <h2>📊 Your Weekly Campus Connect Digest</h2>
    <p>Hello ${userName},</p>
    <p>Here's a summary of your activity and community updates from the past week:</p>
    <div class="features">
      <h3>📈 Your Activity This Week:</h3>
      <ul class="feature-list">
        <li><strong>Points Earned:</strong> ${stats.pointsEarned || 0} points</li>
        <li><strong>Materials Shared:</strong> ${stats.materialsShared || 0} documents</li>
        <li><strong>Events Attended:</strong> ${stats.eventsAttended || 0} events</li>
        <li><strong>Connections Made:</strong> ${stats.connectionsMade || 0} new connections</li>
        <li><strong>Current Rank:</strong> #${stats.currentRank || 'N/A'}</li>
      </ul>
    </div>
    <div class="features">
      <h3>🌟 Community Highlights:</h3>
      <ul class="feature-list">
        <li><strong>New Study Materials:</strong> ${stats.newMaterials || 0} uploaded this week</li>
        <li><strong>Upcoming Events:</strong> ${stats.upcomingEvents || 0} scheduled</li>
        <li><strong>Active Discussions:</strong> ${stats.activeDiscussions || 0} ongoing</li>
      </ul>
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.FRONTEND_URL || 'http:
        🚀 Continue Your Journey
      </a>
    </div>
    <p>Keep up the excellent work! Your contributions make our community stronger. 💪</p>
    <p>Best regards,<br><strong>The Campus Connect Team</strong></p>
  `;
  return createBaseTemplate(content, 'Weekly Digest');
};
module.exports = {
  otpVerificationTemplate,
  welcomeEmailTemplate,
  passwordResetTemplate,
  adminNewUserNotificationTemplate,
  eventReminderTemplate,
  achievementUnlockedTemplate,
  weeklyDigestTemplate
};
