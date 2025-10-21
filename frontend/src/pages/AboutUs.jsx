import React from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Heart, Award, Globe, BookOpen, Zap, Shield } from 'lucide-react';
const AboutUs = () => {
  const teamMembers = [
    { name: 'Piyush', role: 'Lead Developer', avatar: 'P' },
    { name: 'Pranav', role: 'UI/UX Designer', avatar: 'P' },
    { name: 'Pranjal', role: 'Backend Engineer', avatar: 'P' },
    { name: 'Prachi', role: 'Project Manager', avatar: 'P' }
  ];
  const values = [
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Community First',
      description: 'Building meaningful connections between students worldwide'
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Learning Focus',
      description: 'Empowering students with tools and resources for academic success'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Innovation',
      description: 'Continuously improving our platform with cutting-edge features'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Trust & Security',
      description: 'Ensuring a safe and secure environment for all users'
    }
  ];
  const milestones = [
    { year: '2024', event: 'Platform Launch', description: 'Campus Connect goes live with core features' },
    { year: '2024', event: '10,000+ Users', description: 'Reached our first major user milestone' },
    { year: '2024', event: 'Gamification System', description: 'Introduced points and achievements system' },
    { year: '2025', event: 'Global Expansion', description: 'Supporting multiple languages and regions' }
  ];
  return (
    <div className="min-h-screen pt-20 pb-12 relative">
      <div className="absolute inset-0 bg-about-bg bg-cover bg-center"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-textPrimary mb-6 cinematic-heading">
            About Campus Connect
          </h1>
          <p className="text-lg text-textMuted max-w-3xl mx-auto leading-relaxed">
            We&rsquo;re revolutionizing campus life by connecting students, fostering collaboration,
            and creating opportunities for academic and personal growth. Join thousands of
            students who are already part of our vibrant community.
          </p>
        </motion.div>
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
        >
          <div className="glass-card rounded-2xl p-8">
            <div className="flex items-center mb-6">
              <Target className="w-8 h-8 text-primary mr-4" />
              <h2 className="text-2xl font-semibold text-textPrimary">Our Mission</h2>
            </div>
            <p className="text-textMuted leading-relaxed">
              To create a unified platform where students can seamlessly connect, share knowledge,
              and grow together. We believe that collaboration and community are the keys to
              unlocking every student&rsquo;s potential.
            </p>
          </div>
          <div className="glass-card rounded-2xl p-8">
            <div className="flex items-center mb-6">
              <Heart className="w-8 h-8 text-secondary mr-4" />
              <h2 className="text-2xl font-semibold text-textPrimary">Our Vision</h2>
            </div>
            <p className="text-textMuted leading-relaxed">
              A world where every student has access to a supportive network of peers,
              mentors, and resources. We&rsquo;re building the future of education, one connection
              at a time.
            </p>
          </div>
        </motion.div>
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-semibold text-textPrimary text-center mb-12 cinematic-heading">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="glass-card rounded-2xl p-6 text-center hover:shadow-cinematic-glow hover:scale-105 transition-all duration-500"
              >
                <div className="text-primary mb-4 flex justify-center">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-textPrimary mb-3">
                  {value.title}
                </h3>
                <p className="text-textMuted leading-relaxed">
                  {value.description}
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
          className="mb-16"
        >
          <h2 className="text-3xl font-semibold text-textPrimary text-center mb-12 cinematic-heading">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="glass-card rounded-2xl p-6 text-center hover:shadow-cinematic-glow hover:scale-105 transition-all duration-500"
              >
                <div className="text-4xl mb-4 animate-float bg-primary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  {member.avatar}
                </div>
                <h3 className="text-xl font-semibold text-textPrimary mb-2">
                  {member.name}
                </h3>
                <p className="text-textMuted">
                  {member.role}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-semibold text-textPrimary text-center mb-12 cinematic-heading">
            Our Journey
          </h2>
          <div className="glass-card rounded-2xl p-8">
            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={`${milestone.year}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="flex items-center space-x-6"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center space-x-4 mb-2">
                      <span className="text-primary font-semibold">{milestone.year}</span>
                      <h3 className="text-lg font-semibold text-textPrimary">{milestone.event}</h3>
                    </div>
                    <p className="text-textMuted">{milestone.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="text-center"
        >
          <h2 className="text-3xl font-semibold text-textPrimary mb-12 cinematic-heading">
            Campus Connect by Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: '10,000+', label: 'Active Students' },
              { number: '500+', label: 'Universities' },
              { number: '50,000+', label: 'Resources Shared' },
              { number: '24/7', label: 'Support Available' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="glass-card rounded-2xl p-6 hover:shadow-cinematic-glow transition-all duration-500"
              >
                <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-textMuted">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
export default AboutUs;
