const logger = require('../config/winston');

class EmailQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
    this.maxRetries = 3;
    this.retryDelay = 1000;
  }

  async add(emailData) {
    this.queue.push({
      ...emailData,
      id: Date.now() + Math.random(),
      retries: 0,
      timestamp: Date.now()
    });

    logger.info(`Email added to queue. Queue length: ${this.queue.length}`);

    if (!this.processing) {
      this.process();
    }
  }

  async process() {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;
    logger.info('Starting email queue processing');

    while (this.queue.length > 0) {
      const emailJob = this.queue.shift();

      try {
        await this.sendEmail(emailJob);
        logger.info(`Email sent successfully: ${emailJob.to}`);
      } catch (error) {
        logger.error(`Failed to send email to ${emailJob.to}:`, error.message);

        if (emailJob.retries < this.maxRetries) {
          emailJob.retries++;
          const delay = this.retryDelay * Math.pow(2, emailJob.retries - 1);
          setTimeout(() => {
            this.queue.unshift(emailJob);
            logger.info(`Retrying email to ${emailJob.to} (attempt ${emailJob.retries})`);
          }, delay);
        } else {
          logger.error(`Email to ${emailJob.to} failed after ${this.maxRetries} retries`);
        }
      }

      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.processing = false;
    logger.info('Email queue processing completed');
  }

  async sendEmail(emailData) {
    const nodemailer = require('nodemailer');
    const logger = require('../config/winston');

    const { to, subject, templateName, transporter, mailOptions } = emailData;

    try {
      let emailTransporter = transporter;
      if (!emailTransporter) {
        emailTransporter = nodemailer.createTransporter({
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
      }

      const info = await emailTransporter.sendMail(mailOptions);

      logger.info(`Email sent successfully to ${to}`, {
        messageId: info.messageId,
        template: templateName,
        subject: subject
      });

      if (process.env.NODE_ENV === 'development' && emailTransporter.getTestMessageUrl) {
        logger.info(`Email preview: ${emailTransporter.getTestMessageUrl(info)}`);
      }

      return {
        success: true,
        messageId: info.messageId,
        template: templateName
      };

    } catch (error) {
      logger.error(`Error sending email to ${to}:`, error);
      throw error;
    }
  }

  getStatus() {
    return {
      queueLength: this.queue.length,
      processing: this.processing,
      queuedEmails: this.queue.map(job => ({
        to: job.to,
        subject: job.subject,
        retries: job.retries,
        timestamp: job.timestamp
      }))
    };
  }

  clear() {
    const cleared = this.queue.length;
    this.queue = [];
    logger.info(`Email queue cleared. ${cleared} emails removed.`);
    return cleared;
  }
}

// Create singleton instance
const emailQueue = new EmailQueue();

module.exports = emailQueue;