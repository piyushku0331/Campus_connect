import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileCheck, Users, AlertTriangle, Scale } from 'lucide-react';
import MagicBento from '../components/magicBento/magicbento';
const TermsOfService = () => {
  const sections = [
    {
      icon: <FileCheck className="w-6 h-6" />,
      title: 'Acceptance of Terms',
      content: 'By accessing and using Campus Connect, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'User Accounts',
      content: 'You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account or password. You must immediately notify us of any unauthorized uses of your account or any other breaches of security.'
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: 'Prohibited Uses',
      content: 'You may not use our service for any unlawful purpose or to solicit others to perform unlawful acts. You may not violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances.'
    },
    {
      icon: <Scale className="w-6 h-6" />,
      title: 'Content and Conduct',
      content: 'You are solely responsible for the content you post and your conduct on our platform. You agree not to post content that is harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or invasive of anothers privacy.'
    }
  ];
  return (
    <div className="min-h-screen pt-24 pb-12 floating-particles depth-layer-1 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>

      {/* Magic Bento Section */}
      <div className="relative z-20 mb-16">
        <MagicBento
          textAutoHide={false}
          enableStars={true}
          enableSpotlight={true}
          enableBorderGlow={true}
          disableAnimations={false}
          spotlightRadius={350}
          particleCount={15}
          enableTilt={true}
          glowColor="107, 159, 255"
          clickEffect={true}
          enableMagnetism={true}
        />
      </div>

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
            Terms of Service
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
            These Terms of Service govern your use of Campus Connect and any related services provided by us. By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the service.
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
          transition={{ duration: 0.6, delay: 0.6 }}
          className="glass-card rounded-2xl p-8 mt-8"
        >
          <h3 className="text-2xl font-semibold text-textPrimary mb-4">Intellectual Property</h3>
          <p className="text-textMuted leading-relaxed">
            The service and its original content, features, and functionality are and will remain the exclusive property of Campus Connect and its licensors. The service is protected by copyright, trademark, and other laws. You may not duplicate, copy, or reuse any portion of the HTML/CSS, JavaScript, or visual design elements or concepts without express written permission from us.
          </p>
        </motion.div>
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="glass-card rounded-2xl p-8 mt-8"
        >
          <h3 className="text-2xl font-semibold text-textPrimary mb-4">Termination</h3>
          <p className="text-textMuted leading-relaxed">
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the service will cease immediately.
          </p>
        </motion.div>
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="glass-card rounded-2xl p-8 mt-8"
        >
          <h3 className="text-2xl font-semibold text-textPrimary mb-4">Contact Us</h3>
          <p className="text-textMuted mb-4">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <div className="space-y-2 text-textMuted">
            <p>Email: legal@campusconnect.com</p>
            <p>Address: Chitkara University, Punjab 140401, India</p>
          </div>
        </motion.div>
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="glass-card rounded-2xl p-8 mt-8"
        >
          <h3 className="text-2xl font-semibold text-textPrimary mb-4">Changes to Terms</h3>
          <p className="text-textMuted leading-relaxed">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>
        </motion.div>
      </div>
      </div>
    </div>
  );
};
export default TermsOfService;
