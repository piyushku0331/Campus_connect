import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Users, Lightbulb, Bug } from 'lucide-react';

const Forum = () => {
  const categories = [
    {
      name: 'General Discussion',
      description: 'Talk about anything campus-related',
      icon: MessageSquare,
      color: 'from-primary to-secondary'
    },
    {
      name: 'Feature Requests',
      description: 'Suggest new features for the platform',
      icon: Lightbulb,
      color: 'from-secondary to-accent'
    },
    {
      name: 'Bug Reports',
      description: 'Report issues and get them fixed',
      icon: Bug,
      color: 'from-accent to-primary'
    }
  ];

  const sampleThreads = [
    {
      id: 1,
      title: 'Welcome to the Campus Connect Forum!',
      author: 'Admin',
      timestamp: '2 hours ago',
      category: 'General Discussion',
      replies: 15
    },
    {
      id: 2,
      title: 'How to make the most of networking events?',
      author: 'Sarah Chen',
      timestamp: '4 hours ago',
      category: 'General Discussion',
      replies: 8
    },
    {
      id: 3,
      title: 'Add dark mode toggle to profile settings',
      author: 'Mike Johnson',
      timestamp: '1 day ago',
      category: 'Feature Requests',
      replies: 12
    },
    {
      id: 4,
      title: 'Mobile app crashes on login screen',
      author: 'Emily Davis',
      timestamp: '2 days ago',
      category: 'Bug Reports',
      replies: 5
    },
    {
      id: 5,
      title: 'Study group formation feature idea',
      author: 'Alex Rodriguez',
      timestamp: '3 days ago',
      category: 'Feature Requests',
      replies: 20
    },
    {
      id: 6,
      title: 'Lost and Found section improvements',
      author: 'Lisa Wang',
      timestamp: '4 days ago',
      category: 'Feature Requests',
      replies: 7
    },
    {
      id: 7,
      title: 'Events page not loading on Firefox',
      author: 'David Kim',
      timestamp: '5 days ago',
      category: 'Bug Reports',
      replies: 3
    },
    {
      id: 8,
      title: 'Campus Connect success stories',
      author: 'Rachel Green',
      timestamp: '1 week ago',
      category: 'General Discussion',
      replies: 25
    },
    {
      id: 9,
      title: 'Add notification preferences',
      author: 'Tom Wilson',
      timestamp: '1 week ago',
      category: 'Feature Requests',
      replies: 9
    },
    {
      id: 10,
      title: 'Dashboard loading slowly on mobile',
      author: 'Anna Patel',
      timestamp: '2 weeks ago',
      category: 'Bug Reports',
      replies: 6
    }
  ];

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-dashboard-gradient"></div>
      <div className="relative z-10">
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-accent-gradient">
                Community Forum
              </h1>
              <p className="text-lg md:text-xl text-textMuted max-w-2xl mx-auto mb-8">
                Connect with fellow students, share ideas, and discuss campus life.
              </p>
            </motion.div>

            {/* Categories Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-semibold text-textPrimary mb-8 text-center">Categories</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="glass-card rounded-2xl p-6 hover:shadow-card-hover transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${category.color} shadow-lg`}>
                        <category.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-textPrimary mb-2 group-hover:text-primary transition-all duration-300">
                      {category.name}
                    </h3>
                    <p className="text-textMuted leading-relaxed">
                      {category.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recent Posts Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-3xl font-semibold text-textPrimary mb-8 text-center">Recent Posts</h2>
              <div className="space-y-4">
                {sampleThreads.map((thread, index) => (
                  <motion.div
                    key={thread.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                    className="glass-card rounded-2xl p-6 hover:shadow-card-hover transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-textPrimary mb-2 group-hover:text-primary transition-all duration-300">
                          {thread.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-textMuted">
                          <span>by {thread.author}</span>
                          <span>•</span>
                          <span>{thread.timestamp}</span>
                          <span>•</span>
                          <span>{thread.replies} replies</span>
                        </div>
                      </div>
                      <div className="text-xs bg-white/5 text-textMuted px-3 py-1 rounded-full backdrop-blur-md">
                        {thread.category}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Forum;