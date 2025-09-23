import React, { useState } from 'react';
import '../assets/styles/pages/ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: '📧',
      title: 'Email',
      details: 'support@campusconnect.com',
      description: 'Send us an email anytime'
    },
    {
      icon: '📞',
      title: 'Phone',
      details: '+91 7988327875',
      description: 'Mon-Fri 9AM-6PM'
    },
    {
      icon: '📍',
      title: 'Address',
      details: 'Chitkara University',
      description: 'Visit our campus office'
    },
    {
      icon: '💬',
      title: 'Live Chat',
      details: 'Available 24/7',
      description: 'Chat with our support team'
    }
  ];

  return (
    <div className="page-container">
      <div className="contact-container">
      <div className="contact-hero">
        <h1>Get In Touch</h1>
        <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
      </div>

      <div className="contact-content">
        <div className="contact-form-section">
          <h2>Send us a Message</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="What's this about?"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Tell us more..."
                rows="5"
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary">Send Message</button>
          </form>
        </div>

        <div className="contact-info-section">
          <h2>Contact Information</h2>
          <div className="contact-info-grid">
            {contactInfo.map((info, index) => (
              <div key={index} className="contact-info-item card">
                <div className="info-icon">{info.icon}</div>
                <h3>{info.title}</h3>
                <p className="info-details">{info.details}</p>
                <p className="info-description">{info.description}</p>
              </div>
            ))}
          </div>

          <div className="maps-section">
            <h2>Find Us</h2>
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.123456789012!2d76.12345678901234!3d30.123456789012345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d123456789abc%3A0x123456789abcdef!2sChitkara%20University!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Chitkara University Location"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item card">
            <h3>How do I reset my password?</h3>
            <p>Click on "Forgot Password" on the login page and follow the instructions sent to your email.</p>
          </div>
          <div className="faq-item card">
            <h3>How can I report a lost item?</h3>
            <p>Use the Lost & Found section in the app to post details about lost or found items.</p>
          </div>
          <div className="faq-item card">
            <h3>Can I create events?</h3>
            <p>Yes! Students can create and manage events through the Events section.</p>
          </div>
          <div className="faq-item card">
            <h3>Is the app free to use?</h3>
            <p>Yes, Campus Connect is completely free for all students.</p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ContactPage;