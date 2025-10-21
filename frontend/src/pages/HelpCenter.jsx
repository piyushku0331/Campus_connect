import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, MessageCircle, Book, Users, Settings } from 'lucide-react';
const helpCategories = [
  {
    icon: <MessageCircle className="w-8 h-8" />,
    title: 'Getting Started',
    description: 'Learn the basics of Campus Connect',
    items: ['Creating an account', 'Setting up your profile', 'Navigating the platform']
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Networking',
    description: 'Connect with other students and professionals',
    items: ['Finding connections', 'Sending messages', 'Joining groups']
  },
  {
    icon: <Book className="w-8 h-8" />,
    title: 'Events & Resources',
    description: 'Discover and participate in campus activities',
    items: ['Browsing events', 'Registering for events', 'Sharing resources']
  },
  {
    icon: <Settings className="w-8 h-8" />,
    title: 'Account & Settings',
    description: 'Manage your account and preferences',
    items: ['Profile settings', 'Privacy options', 'Notification preferences']
  }
];
const faqs = [
  {
    question: 'How do I create an account?',
    answer: 'Click on the "Sign Up" button in the top right corner and fill in your details including your university email.',
    tags: ['account', 'signup', 'registration', 'create']
  },
  {
    question: 'How can I find events on campus?',
    answer: 'Navigate to the Events page from the main menu or use the search bar to find specific events.',
    tags: ['events', 'find', 'search', 'campus']
  },
  {
    question: 'How do I connect with other students?',
    answer: 'Use the Networking page to browse profiles, send connection requests, and join study groups.',
    tags: ['networking', 'connect', 'students', 'profiles']
  },
  {
    question: 'Can I share resources with others?',
    answer: 'Yes! Go to the Resources page to upload and share study materials, notes, and other helpful content.',
    tags: ['resources', 'share', 'upload', 'materials']
  },
  {
    question: 'How do I reset my password?',
    answer: 'Go to the login page and click "Forgot Password" to receive a reset link via email.',
    tags: ['password', 'reset', 'login', 'forgot']
  },
  {
    question: 'How can I edit my profile?',
    answer: 'Navigate to your Profile page and click the "Edit" button to update your information.',
    tags: ['profile', 'edit', 'update', 'information']
  },
  {
    question: 'What are achievement badges?',
    answer: 'Badges are earned by completing challenges and reaching milestones in your campus journey.',
    tags: ['achievements', 'badges', 'challenges', 'milestones']
  },
  {
    question: 'How do I join a study group?',
    answer: 'Visit the Networking page and look for study groups, or create your own group.',
    tags: ['study', 'groups', 'join', 'networking']
  }
];
const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);
  const filteredFAQs = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return faqs;
    const query = debouncedSearchQuery.toLowerCase();
    return faqs.filter(faq =>
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query) ||
      faq.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }, [debouncedSearchQuery]);
  const filteredCategories = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return helpCategories;
    const query = debouncedSearchQuery.toLowerCase();
    return helpCategories.filter(category =>
      category.title.toLowerCase().includes(query) ||
      category.description.toLowerCase().includes(query) ||
      category.items.some(item => item.toLowerCase().includes(query))
    );
  }, [debouncedSearchQuery]);
  return (
    <div className="min-h-screen pt-24 pb-12 floating-particles depth-layer-1 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
      <div className="relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Link
            to="/"
            className="inline-flex items-center text-textMuted hover:text-primary transition-all duration-500 ease-out mb-6 hover:scale-105 hover:-translate-x-1"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold cinematic-heading mb-4">
            Help Center
          </h1>
          <p className="text-xl text-textMuted max-w-2xl mx-auto animate-fade-in-up">
            Find answers to your questions and get the help you need
          </p>
        </motion.div>
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-textMuted w-5 h-5" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 glass-card rounded-2xl text-textPrimary placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
            />
          </div>
        </motion.div>
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {filteredCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="glass-card rounded-2xl p-6 hover:shadow-cinematic-glow hover:scale-105 hover:-translate-y-2 transition-all duration-800 ease-in-out cursor-pointer"
            >
              <div className="text-primary mb-4 animate-float group-hover:animate-bounce">
                {category.icon}
              </div>
              <h3 className="text-xl font-semibold text-textPrimary mb-3 group-hover:text-primary transition-colors duration-500 ease-out">{category.title}</h3>
              <p className="text-textMuted mb-4">{category.description}</p>
              <ul className="space-y-2">
                {category.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-sm text-textMuted">
                    • {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-textPrimary mb-8 text-center cinematic-heading">
            Frequently Asked Questions
          </h2>
          {filteredFAQs.length === 0 && debouncedSearchQuery ? (
            <div className="text-center py-8">
              <p className="text-textMuted text-lg">No results found for &rdquo;{debouncedSearchQuery}&rdquo;</p>
              <p className="text-textMuted text-sm mt-2">Try searching with different keywords</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredFAQs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="glass-card rounded-2xl p-6 hover:shadow-cinematic-glow hover:scale-105 hover:-translate-y-1 transition-all duration-500 ease-out cursor-pointer"
                >
                  <h3 className="text-lg font-semibold text-textPrimary mb-3 group-hover:text-primary transition-colors duration-500 ease-out">{faq.question}</h3>
                  <p className="text-textMuted">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
        </div>
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="glass-card rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-textPrimary mb-4">Still need help?</h3>
            <p className="text-textMuted mb-6">
              Can&rsquo;t find what you&rsquo;re looking for? Our support team is here to help.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-3 glass-card border border-primary/30 text-primary hover:border-primary/60 rounded-full font-medium hover:bg-primary/10 transition-all duration-500 ease-out hover:shadow-cinematic-glow hover:scale-105 hover:-translate-y-1"
            >
              Contact Support
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
export default HelpCenter;
