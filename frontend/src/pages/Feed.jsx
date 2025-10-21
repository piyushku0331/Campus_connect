import React from 'react';
import { Heart, MessageCircle, Share, Plus } from 'lucide-react';
const Feed = () => {
  const posts = [
    {
      id: 1,
      type: 'note',
      title: 'Data Structures Notes - Chapter 5',
      author: 'Priya Sharma',
      department: 'CSE',
      content: 'Comprehensive notes on Binary Trees and BST operations. Includes implementation examples in C++.',
      likes: 24,
      comments: 5,
      timestamp: '2 hours ago',
      tags: ['CSE', 'Data Structures', 'Trees']
    },
    {
      id: 2,
      type: 'lost_found',
      title: 'Found: Black Wallet',
      author: 'Rahul Kumar',
      department: 'ECE',
      content: 'Found a black leather wallet near the library. Contains ID card and some cash. Please contact me to claim.',
      likes: 8,
      comments: 12,
      timestamp: '4 hours ago',
      tags: ['Lost & Found', 'Wallet']
    },
    {
      id: 3,
      type: 'alumni',
      title: 'Success Story: From Chitkara to Google',
      author: 'Ankit Gupta',
      department: 'CSE',
      content: 'After graduating in 2020, I joined Google as a Software Engineer. Here\'s my journey and tips for current students.',
      likes: 67,
      comments: 23,
      timestamp: '1 day ago',
      tags: ['Alumni', 'Success Story', 'Google']
    },
    {
      id: 4,
      type: 'event',
      title: 'Tech Fest 2024 - Registration Open',
      author: 'Student Council',
      department: 'Events',
      content: 'Join us for Tech Fest 2024! Workshops, hackathons, and networking opportunities. Register now!',
      likes: 45,
      comments: 18,
      timestamp: '6 hours ago',
      tags: ['Event', 'Tech Fest', 'Workshop']
    }
  ];
  const getPostIcon = (type) => {
    switch (type) {
      case 'note': return '📚';
      case 'lost_found': return '🔍';
      case 'alumni': return '🎓';
      case 'event': return '📅';
      default: return '📝';
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-8 animate-slide-down">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Campus Feed</h1>
          <p className="text-gray-600 dark:text-gray-400">Stay connected with your campus community</p>
        </div>
        <button className="btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl group">
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          Post Something
        </button>
      </div>
      <div className="space-y-6">
        {posts.map((post, index) => (
          <div
            key={post.id}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 card-hover animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">{getPostIcon(post.type)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{post.title}</h3>
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    {post.tags[0]}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <span className="font-medium">{post.author}</span>
                  <span>•</span>
                  <span>{post.department}</span>
                  <span>•</span>
                  <span>{post.timestamp}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                  {post.content}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                    <Heart size={16} />
                    {post.likes}
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                    <MessageCircle size={16} />
                    {post.comments}
                  </button>
                  <button className="flex items-center gap-1 hover:text-green-500 transition-colors">
                    <Share size={16} />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Feed;
