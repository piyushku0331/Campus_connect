import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Code, PlayCircle, HelpCircle, Users, Calendar, Search, FileText, Briefcase, MessageSquare } from 'lucide-react';

const Docs = () => {
  const docSections = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Getting Started',
      description: 'Learn the basics of Campus Connect and how to set up your account.',
      content: 'Campus Connect is your all-in-one platform for academic and social networking. Start by creating an account, verifying your email, and exploring the dashboard. Key features include event management, networking with peers, lost and found services, shared notes, and resource sharing.',
      action: 'Read Guide'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'User Guides',
      description: 'Detailed guides for using Campus Connect features.',
      subsections: [
        { icon: <Calendar />, title: 'Events', desc: 'Create, join, and manage campus events.' },
        { icon: <Users />, title: 'Networking', desc: 'Connect with alumni and peers.' },
        { icon: <Search />, title: 'Lost & Found', desc: 'Report and find lost items.' },
        { icon: <FileText />, title: 'Notes', desc: 'Share and access study materials.' },
        { icon: <Briefcase />, title: 'Placements', desc: 'Explore job opportunities and internships.' }
      ],
      action: 'View Guides'
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: 'API Documentation',
      description: 'Technical documentation for developers integrating with Campus Connect.',
      content: 'Our RESTful API allows third-party integrations. Endpoints include user authentication, event management, and data retrieval. Use JWT tokens for secure access. Base URL: https://api.campusconnect.edu/v1',
      action: 'View API Docs'
    },
    {
      icon: <PlayCircle className="w-8 h-8" />,
      title: 'Tutorials',
      description: 'Step-by-step tutorials to master Campus Connect features.',
      content: 'Follow our video and text tutorials to learn advanced features like creating study groups, organizing events, and maximizing your networking potential. New tutorials are added regularly.',
      action: 'Watch Tutorials'
    },
    {
      icon: <HelpCircle className="w-8 h-8" />,
      title: 'Troubleshooting',
      description: 'Solutions to common issues and frequently asked questions.',
      content: 'Having trouble logging in? Check your email verification. Issues with notifications? Review your settings. For technical problems, contact support or check our FAQ section.',
      action: 'Get Help'
    }
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-textPrimary mb-6 cinematic-heading">
              Documentation
            </h1>
            <p className="text-lg text-textMuted max-w-2xl mx-auto">
              Comprehensive guides and resources to help you make the most of Campus Connect.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {docSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="glass-card rounded-2xl p-6 hover:shadow-cinematic-glow hover:scale-105 transition-all duration-500 relative overflow-hidden group"
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
                  {section.icon}
                </div>
                <h3 className="text-xl font-semibold text-textPrimary mb-3 relative z-10">
                  {section.title}
                </h3>
                <p className="text-textMuted mb-4 leading-relaxed relative z-10">
                  {section.description}
                </p>
                {section.content && (
                  <p className="text-textMuted mb-4 leading-relaxed relative z-10 text-sm">
                    {section.content}
                  </p>
                )}
                {section.subsections && (
                  <div className="mb-4 relative z-10">
                    <h4 className="text-textPrimary font-medium mb-2">Key Topics:</h4>
                    <ul className="space-y-1">
                      {section.subsections.map((sub, subIndex) => (
                        <li key={subIndex} className="flex items-center text-textMuted text-sm">
                          {sub.icon} <span className="ml-2">{sub.title}: {sub.desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <button className="glass-effect border border-primary/30 text-primary hover:border-primary/60 px-4 py-2 rounded-full font-medium hover:bg-primary/10 transition-all duration-300 relative z-10 w-full">
                  {section.action}
                </button>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-16"
          >
            <h2 className="text-3xl font-semibold text-textPrimary mb-6 cinematic-heading">
              Need More Help?
            </h2>
            <p className="text-textMuted mb-8 max-w-2xl mx-auto">
              Can&rsquo;t find what you&rsquo;re looking for? Our support team is here to assist you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/support">
                <button className="glass-card text-white font-medium px-8 py-3 rounded-full hover:shadow-cinematic-glow hover:scale-105 transition-all duration-500">
                  Contact Support
                </button>
              </Link>
              <Link to="/faq">
                <button className="glass-effect border border-primary/30 text-primary hover:border-primary/60 px-8 py-3 rounded-full font-medium hover:bg-primary/10 transition-all duration-300">
                  Browse FAQ
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Docs;