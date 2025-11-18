import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I create an account on Campus Connect?",
      answer: "To create an account, click on the 'Sign Up' button on the homepage. Fill in your details including your university email, name, and create a password. You'll receive a verification email to activate your account."
    },
    {
      question: "What features does Campus Connect offer?",
      answer: "Campus Connect offers networking with peers and alumni, event discovery and participation, access to study materials and resources, lost and found services, gamification with points and achievements, and a leaderboard to track your engagement."
    },
    {
      question: "How can I reset my password?",
      answer: "If you've forgotten your password, click on 'Forgot Password' on the login page. Enter your registered email address, and we'll send you a reset link. Follow the instructions in the email to create a new password."
    },
    {
      question: "How do I connect with other students?",
      answer: "You can connect with other students through the Networking page. Browse profiles, send connection requests, and start conversations. You can also join study groups and participate in events to meet new people."
    },
    {
      question: "What is the leaderboard and how does it work?",
      answer: "The leaderboard ranks users based on points earned through activities like posting, commenting, attending events, and completing challenges. Higher engagement leads to more points and better rankings."
    },
    {
      question: "How do I report a lost item?",
      answer: "Go to the Lost & Found page and click 'Report Lost Item'. Provide details like item description, location lost, and contact information. You can also browse found items to claim yours."
    },
    {
      question: "How can I access study materials?",
      answer: "Visit the Resources or Notes page to access shared study materials. You can upload your own notes and materials to help others, and download resources shared by the community."
    },
    {
      question: "How do I get support if I have issues?",
      answer: "For support, visit the Help Center or Support page. You can also contact us through the Contact Us page or use the helpline feature for immediate assistance with campus-related queries."
    },
    {
      question: "Is Campus Connect free to use?",
      answer: "Yes, Campus Connect is completely free for all students. You can access all features, participate in events, and connect with others without any subscription fees."
    },
    {
      question: "How do I update my profile information?",
      answer: "Go to your Profile page by clicking on your avatar or name in the navigation. You can edit your personal details, add a bio, update your profile picture, and manage your privacy settings."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col floating-particles floating-particles-enhanced dynamic-bg-elements depth-layer-1 relative overflow-hidden">
      {/* Enhanced ambient lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-primary/10 via-secondary/5 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-radial from-secondary/8 via-primary/4 to-transparent rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-radial from-accent/6 via-transparent to-transparent rounded-full blur-2xl animate-pulse-slow animation-delay-4000"></div>
      </div>

      <section className="min-h-screen flex items-center justify-center relative overflow-hidden depth-layer-2 py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/75 to-black/85"></div>
        <div className="absolute inset-0 bg-ambient-overlay animate-breathe"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight mb-4 sm:mb-6 cinematic-heading max-w-4xl mx-auto">
              <span className="bg-gradient-to-r from-white via-primary/90 to-secondary/90 bg-clip-text text-transparent animate-gradient-x">
                Frequently Asked Questions
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-textMuted max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-12 animate-fade-in-up px-4 relative z-10">
              Find answers to common questions about Campus Connect and get the most out of your experience.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-black/90"></div>
        <div className="absolute inset-0 bg-ambient-overlay opacity-20"></div>
        <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="rounded-2xl overflow-hidden interactive-element"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-6 md:p-8 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-2xl"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg md:text-xl font-semibold text-textPrimary pr-4">
                      {faq.question}
                    </h3>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-6 h-6 text-primary flex-shrink-0" />
                    </motion.div>
                  </div>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 md:px-8 pb-6 md:pb-8">
                        <p className="text-textMuted leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Faq;