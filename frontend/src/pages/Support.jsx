import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HelpCircle, MessageCircle, FileText, Users, Mail, Phone } from 'lucide-react';
const Support = () => {
  const supportOptions = [
    {
      icon: <HelpCircle className="w-8 h-8" />,
      title: 'FAQ',
      description: 'Find answers to commonly asked questions about Campus Connect.',
      action: 'Browse FAQ'
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: 'Live Chat',
      description: 'Get instant help from our support team through live chat.',
      action: 'Start Chat'
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'Documentation',
      description: 'Access detailed guides and tutorials for using the platform.',
      action: 'View Docs'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Community Forum',
      description: 'Connect with other users and share solutions in our community.',
      action: 'Join Forum'
    }
  ];
  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      method: 'Email Support',
      detail: 'support@campusconnect.edu',
      description: 'Send us an email and we\'ll respond within 24 hours'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      method: 'Phone Support',
      detail: '+91 123-456-7890',
      description: 'Call us during business hours (9 AM - 6 PM IST)'
    }
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
            Support Center
          </h1>
          <p className="text-lg text-textMuted max-w-2xl mx-auto">
            Get the help you need to make the most of Campus Connect. We&rsquo;re here to support your learning journey.
          </p>
        </motion.div>
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {supportOptions.map((option, index) => (
            <motion.div
              key={option.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="glass-card rounded-2xl p-6 hover:shadow-cinematic-glow hover:scale-105 transition-all duration-500 text-center relative overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                '--glow-x': '50%',
                '--glow-y': '50%',
                '--glow-intensity': '0',
                '--glow-radius': '200px',
                '--glow-color': '107, 159, 255'
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                e.currentTarget.style.setProperty('--glow-x', `${x}%`);
                e.currentTarget.style.setProperty('--glow-y', `${y}%`);
                e.currentTarget.style.setProperty('--glow-intensity', '0.3');
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.setProperty('--glow-intensity', '0');
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'radial-gradient(circle at var(--glow-x) var(--glow-y), rgba(107, 159, 255, 0.1) 0%, transparent 70%)',
                  borderRadius: 'inherit'
                }}
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'radial-gradient(circle at var(--glow-x) var(--glow-y), rgba(127, 64, 255, 0.05) 0%, transparent 80%)',
                  borderRadius: 'inherit',
                  animation: 'pulse 2s infinite'
                }}
              />
              <div className="text-primary mb-4 flex justify-center relative z-10">
                {option.icon}
              </div>
              <h3 className="text-xl font-semibold text-textPrimary mb-3 relative z-10">
                {option.title}
              </h3>
              <p className="text-textMuted mb-4 leading-relaxed relative z-10">
                {option.description}
              </p>
              <button className="glass-effect border border-primary/30 text-primary hover:border-primary/60 px-4 py-2 rounded-full font-medium hover:bg-primary/10 transition-all duration-300 relative z-10">
                {option.action}
              </button>
            </motion.div>
          ))}
        </motion.div>
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-semibold text-textPrimary text-center mb-8 cinematic-heading">
            Contact Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.method}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 * index }}
                className="glass-card rounded-2xl p-6 hover:shadow-cinematic-glow transition-all duration-500 relative overflow-hidden group"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  '--glow-x': '50%',
                  '--glow-y': '50%',
                  '--glow-intensity': '0',
                  '--glow-radius': '200px',
                  '--glow-color': '107, 159, 255'
                }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  e.currentTarget.style.setProperty('--glow-x', `${x}%`);
                  e.currentTarget.style.setProperty('--glow-y', `${y}%`);
                  e.currentTarget.style.setProperty('--glow-intensity', '0.3');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.setProperty('--glow-intensity', '0');
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'radial-gradient(circle at var(--glow-x) var(--glow-y), rgba(107, 159, 255, 0.1) 0%, transparent 70%)',
                    borderRadius: 'inherit'
                  }}
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'radial-gradient(circle at var(--glow-x) var(--glow-y), rgba(127, 64, 255, 0.05) 0%, transparent 80%)',
                    borderRadius: 'inherit',
                    animation: 'pulse 2s infinite'
                  }}
                />
                <div className="flex items-center mb-4 relative z-10">
                  <div className="text-primary mr-4">
                    {method.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-textPrimary">
                      {method.method}
                    </h3>
                    <p className="text-primary font-medium">
                      {method.detail}
                    </p>
                  </div>
                </div>
                <p className="text-textMuted leading-relaxed relative z-10">
                  {method.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-semibold text-textPrimary mb-6 cinematic-heading">
            Need Immediate Help?
          </h2>
          <p className="text-textMuted mb-8 max-w-2xl mx-auto">
            Our support team is available to help you with any questions or issues you might have.
            Don&rsquo;t hesitate to reach out - we&rsquo;re here to help you succeed on Campus Connect.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="glass-card text-white font-medium px-8 py-3 rounded-full hover:shadow-cinematic-glow hover:scale-105 transition-all duration-500">
              Start Live Chat
            </button>
            <button className="glass-effect border border-primary/30 text-primary hover:border-primary/60 px-8 py-3 rounded-full font-medium hover:bg-primary/10 transition-all duration-300">
              Submit Ticket
            </button>
            <Link
              to="/login"
              className="glass-effect border border-primary/30 text-primary hover:border-primary/60 px-8 py-3 rounded-full font-medium hover:bg-primary/10 transition-all duration-500 animate-shimmer interactive-element"
            >
              Get Started Today
            </Link>
          </div>
        </motion.div>
      </div>
      </div>
    </div>
  );
};
export default Support;
