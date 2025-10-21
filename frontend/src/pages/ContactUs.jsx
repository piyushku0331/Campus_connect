import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Clock, Globe } from 'lucide-react';
const ContactUs = () => {
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
    console.log('Form submitted:', formData);
  };
  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email',
      details: ['support@campusconnect.edu', 'info@campusconnect.edu'],
      description: 'Send us an email anytime'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Phone',
      details: ['+91 123-456-7890', '+91 123-456-7891'],
      description: 'Mon-Fri 9AM-6PM IST'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Address',
      details: ['Chitkara University', 'Punjab 140401, India'],
      description: 'Visit our campus'
    }
  ];
  const officeHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM IST' },
    { day: 'Saturday', hours: '10:00 AM - 4:00 PM IST' },
    { day: 'Sunday', hours: 'Closed' }
  ];
  return (
    <div className="min-h-screen pt-20 pb-12 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
      <div className="relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-textPrimary mb-6 cinematic-heading">
            Contact Us
          </h1>
          <p className="text-lg text-textMuted max-w-2xl mx-auto">
            Have questions or need assistance? We&rsquo;d love to hear from you.
            Get in touch with our team and we&rsquo;ll respond as soon as possible.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="text-2xl font-semibold text-textPrimary mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-textPrimary mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-4 pr-4 py-3 bg-white/5 border border-borderSubtle rounded-xl text-textPrimary placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary/70 transition-all duration-300"
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-textPrimary mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-4 pr-4 py-3 bg-white/5 border border-borderSubtle rounded-xl text-textPrimary placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary/70 transition-all duration-300"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-textPrimary mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full pl-4 pr-4 py-3 bg-white/5 border border-borderSubtle rounded-xl text-textPrimary placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary/70 transition-all duration-300"
                  placeholder="What's this about?"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-textPrimary mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full pl-4 pr-4 py-3 bg-white/5 border border-borderSubtle rounded-xl text-textPrimary placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary/70 transition-all duration-300 resize-none"
                  placeholder="Tell us how we can help you..."
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full glass-card text-white font-medium px-8 py-3 rounded-xl hover:shadow-cinematic-glow hover:scale-105 transition-all duration-500 flex items-center justify-center"
              >
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </button>
            </form>
          </motion.div>
          {}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            {}
            <div>
              <h2 className="text-2xl font-semibold text-textPrimary mb-6">Get in Touch</h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className="glass-card rounded-xl p-6 hover:shadow-cinematic-glow transition-all duration-500"
                  >
                    <div className="flex items-start">
                      <div className="text-primary mr-4 mt-1">
                        {info.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-textPrimary mb-2">
                          {info.title}
                        </h3>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-primary font-medium">
                            {detail}
                          </p>
                        ))}
                        <p className="text-textMuted text-sm mt-1">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            {}
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Clock className="w-6 h-6 text-primary mr-3" />
                <h3 className="text-lg font-semibold text-textPrimary">Office Hours</h3>
              </div>
              <div className="space-y-2">
                {officeHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-textMuted">{schedule.day}</span>
                    <span className="text-textPrimary font-medium">{schedule.hours}</span>
                  </div>
                ))}
              </div>
            </div>
            {}
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Globe className="w-6 h-6 text-primary mr-3" />
                <h3 className="text-lg font-semibold text-textPrimary">Global Campus Network</h3>
              </div>
              <p className="text-textMuted mb-4">
                Campus Connect serves students from universities worldwide. Our platform supports multiple languages and time zones.
              </p>
              <div className="flex flex-wrap gap-2">
                {['English', 'Spanish', 'French', 'German', 'Chinese', 'Hindi'].map((lang) => (
                  <span key={lang} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      </div>
    </div>
  );
};
export default ContactUs;
