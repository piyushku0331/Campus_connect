import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Users, Calendar, BookOpen, Bell, Settings } from 'lucide-react';
import GamificationWidget from '../components/gamification/GamificationWidget';
import UserProgress from '../components/gamification/UserProgress';
import AchievementBadges from '../components/gamification/AchievementBadges';
import Leaderboard from '../components/gamification/Leaderboard';
const Dashboard = () => {
  const portfolioItems = [
    {
      title: 'My Profile',
      description: 'Update your personal information',
      icon: User,
      link: '/profile',
      gradient: 'from-[#6B9FFF] to-[#7F40FF]',
      category: 'Personal'
    },
    {
      title: 'Connections',
      description: 'Manage your network connections',
      icon: Users,
      link: '/networking',
      gradient: 'from-[#FF7F50] to-[#FF4500]',
      category: 'Network'
    },
    {
      title: 'Events',
      description: 'View upcoming events',
      icon: Calendar,
      link: '/events',
      gradient: 'from-[#6B9FFF] to-[#00CED1]',
      category: 'Events'
    },
    {
      title: 'Resources',
      description: 'Access shared resources',
      icon: BookOpen,
      link: '/resources',
      gradient: 'from-[#7F40FF] to-[#FF7F50]',
      category: 'Learning'
    },
    {
      title: 'Notifications',
      description: 'Check your latest updates',
      icon: Bell,
      link: '/notifications',
      gradient: 'from-[#00CED1] to-[#6B9FFF]',
      category: 'Updates'
    },
    {
      title: 'Settings',
      description: 'Configure your preferences',
      icon: Settings,
      link: '/settings',
      gradient: 'from-[#FF4500] to-[#7F40FF]',
      category: 'Config'
    }
  ];
  return (
    <div className="min-h-screen pt-16 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
      <div className="relative z-10">
      {}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-accent-gradient">
              Your Dashboard
            </h1>
            <p className="text-lg md:text-xl text-textMuted max-w-2xl mx-auto mb-8">
              Track your progress, connect with peers, and unlock achievements in your campus journey.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="glass-card rounded-2xl p-6">
                <div className="text-3xl font-bold text-primary mb-2">42</div>
                <p className="text-textMuted">Points Earned</p>
              </div>
              <div className="glass-card rounded-2xl p-6">
                <div className="text-3xl font-bold text-secondary mb-2">8</div>
                <p className="text-textMuted">Connections Made</p>
              </div>
              <div className="glass-card rounded-2xl p-6">
                <div className="text-3xl font-bold text-accent mb-2">3</div>
                <p className="text-textMuted">Events Attended</p>
              </div>
            </div>
          </motion.div>
          {}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <GamificationWidget />
          </motion.div>
          {}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {portfolioItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <Link to={item.link} className="block">
                  <div className="bg-gradient-to-br from-surface to-[#1A1A2A] border border-borderSubtle rounded-2xl p-6 h-full hover:shadow-glow-primary transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${item.gradient} shadow-lg`}>
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs bg-white/5 text-textMuted px-3 py-1 rounded-full backdrop-blur-md">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-textPrimary mb-2 group-hover:text-primary transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-textMuted leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          {}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-semibold text-textPrimary mb-4">Achievements & Progress</h2>
              <p className="text-textMuted max-w-2xl mx-auto">Your journey through Campus Connect</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <div className="lg:col-span-1">
                <UserProgress />
              </div>
              <div className="lg:col-span-2">
                <AchievementBadges />
              </div>
            </div>
          </motion.div>
          {}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-surface/50 rounded-2xl p-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-semibold text-textPrimary mb-2">Campus Leaderboard</h2>
              <p className="text-textMuted">See how you rank among your peers</p>
            </div>
            <Leaderboard />
          </motion.div>
        </div>
      </section>
      </div>
    </div>
  );
};
export default Dashboard;
