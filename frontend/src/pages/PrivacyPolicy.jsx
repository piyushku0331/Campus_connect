import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Lock, Users, FileText } from 'lucide-react';
const PrivacyPolicy = () => {
  const sections = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Information We Collect',
      content: 'We collect information you provide directly to us, such as when you create an account, participate in events, or contact us for support. This includes your name, email address, university information, and any content you share on the platform.'
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: 'How We Use Your Information',
      content: 'We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and communicate with you about products, services, and promotional offers.'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Information Sharing',
      content: 'We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share your information in response to legal requests or to protect our rights.'
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'Data Security',
      content: 'We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.'
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Your Rights',
      content: 'You have the right to access, update, or delete your personal information. You can also opt out of receiving promotional communications from us by following the unsubscribe instructions in those communications.'
    }
  ];
  return (
    <div className="min-h-screen pt-24 pb-12 floating-particles depth-layer-1 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
      <div className="relative z-10">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Link
            to="/"
            className="inline-flex items-center text-textMuted hover:text-primary transition-colors duration-300 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold cinematic-heading mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-textMuted animate-fade-in-up">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </motion.div>
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card rounded-2xl p-8 mb-8"
        >
          <p className="text-textMuted leading-relaxed">
            This Privacy Policy describes how Campus Connect (&rdquo;we,&rdquo; &rdquo;us,&rdquo; or &rdquo;our&rdquo;) collects, uses, and protects your personal information when you use our website and services. By using Campus Connect, you agree to the collection and use of information in accordance with this policy.
          </p>
        </motion.div>
        {}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="glass-card rounded-2xl p-8"
            >
              <div className="flex items-start space-x-4">
                <div className="text-primary mt-1 animate-float">
                  {section.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-textPrimary mb-4">{section.title}</h3>
                  <p className="text-textMuted leading-relaxed">{section.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="glass-card rounded-2xl p-8 mt-8"
        >
          <h3 className="text-2xl font-semibold text-textPrimary mb-4">Contact Us</h3>
          <p className="text-textMuted mb-4">
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <div className="space-y-2 text-textMuted">
            <p>Email: privacy@campusconnect.com</p>
            <p>Address: Chitkara University, Punjab 140401, India</p>
          </div>
        </motion.div>
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="glass-card rounded-2xl p-8 mt-8"
        >
          <h3 className="text-2xl font-semibold text-textPrimary mb-4">Changes to This Policy</h3>
          <p className="text-textMuted leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &rdquo;Last updated&rdquo; date. You are advised to review this Privacy Policy periodically for any changes.
          </p>
        </motion.div>
      </div>
      </div>
    </div>
  );
};
export default PrivacyPolicy;
