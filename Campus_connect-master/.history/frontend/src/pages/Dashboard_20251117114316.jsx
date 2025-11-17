import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Users, Calendar, BookOpen, Bell, Settings } from 'lucide-react';
import GamificationWidget from '../components/gamification/GamificationWidget';
import UserProgress from '../components/gamification/UserProgress';
import AchievementBadges from '../components/gamification/AchievementBadges';
import Leaderboard from '../components/gamification/Leaderboard';
import { AuroraBackground } from '../components/lightswind/aurora-background';
import { GlowingCards, GlowingCard } from '../components/lightswind/glowing-cards';
import ParticleOrbitEffect from '../components/lightswind/particle-orbit-effect';
import GlowCard from '../components/ui/GlowCard';
import { PORTFOLIO_ITEMS } from '../utils/constants';
const Dashboard = () => {
  // Create icon map for dynamic icon rendering
  const iconMap = {
    User,
    Users,
    Calendar,
    BookOpen,
    Bell,
    Settings
  };

  // Map portfolio items with actual icon components
  const portfolioItems = PORTFOLIO_ITEMS.map(item => ({
    ...item,
    icon: iconMap[item.icon]
  }));
  return (
    <AuroraBackground>
      <div className="min-h-screen relative">
        <div className="absolute inset-0 bg-dashboard-gradient"></div>
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
                  <div className="bg-card-gradient border border-borderMedium rounded-2xl p-6 h-full hover:shadow-card-hover hover:transform hover:-translate-y-1 transition-all duration-300 animate-fade-in">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${item.gradient} shadow-lg`}>
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs bg-white/5 text-textMuted px-3 py-1 rounded-full backdrop-blur-md">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-textPrimary mb-2 group-hover:text-primary transition-all duration-300 animate-hover-lift">
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
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-semibold text-textPrimary mb-4">Quick Actions</h2>
              <p className="text-textMuted max-w-2xl mx-auto">Explore powerful features at your fingertips</p>
            </div>
            <div className="mb-12">
              <GlowCard className="text-center">
                <div className="text-4xl mb-4 text-primary">⚡</div>
                <h3 className="text-xl font-semibold text-textPrimary mb-2">Quick Actions</h3>
                <p className="text-textMuted">Explore powerful features at your fingertips</p>
              </GlowCard>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link to="/home" className="block">
                <GlowCard className="text-center">
                  <div className="text-3xl mb-4 text-primary">🏠</div>
                  <h3 className="text-lg font-semibold text-textPrimary mb-2">Home</h3>
                  <p className="text-textMuted text-sm">Return to main page</p>
                </GlowCard>
              </Link>
              <Link to="/events" className="block">
                <GlowCard className="text-center">
                  <div className="text-3xl mb-4 text-primary">📅</div>
                  <h3 className="text-lg font-semibold text-textPrimary mb-2">Events</h3>
                  <p className="text-textMuted text-sm">Browse campus events</p>
                </GlowCard>
              </Link>
              <Link to="/networking" className="block">
                <GlowCard className="text-center">
                  <div className="text-3xl mb-4 text-primary">🤝</div>
                  <h3 className="text-lg font-semibold text-textPrimary mb-2">Networking</h3>
                  <p className="text-textMuted text-sm">Connect with peers</p>
                </GlowCard>
              </Link>
              <Link to="/resources" className="block">
                <GlowCard className="text-center">
                  <div className="text-3xl mb-4 text-primary">📚</div>
                  <h3 className="text-lg font-semibold text-textPrimary mb-2">Resources</h3>
                  <p className="text-textMuted text-sm">Access study materials</p>
                </GlowCard>
              </Link>
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
      <ParticleOrbitEffect />
    </AuroraBackground>
  );
};
export default Dashboard;