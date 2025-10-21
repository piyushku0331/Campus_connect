import React, { useState } from 'react';
import { Search, MapPin, Calendar, CheckCircle, AlertCircle, Plus, Filter } from 'lucide-react';
const LostFound = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showPostForm, setShowPostForm] = useState(false);
  const categories = ['All', 'Electronics', 'Books', 'Clothing', 'Accessories', 'Documents', 'Keys', 'Other'];
  const statuses = ['All', 'Lost', 'Found', 'Claimed'];
  const items = [
    {
      id: 1,
      type: 'lost',
      title: 'Black Leather Wallet',
      category: 'Accessories',
      description: 'Black leather wallet containing ID card, debit cards, and some cash. Lost near the library entrance.',
      location: 'Library Entrance',
      date: '2024-01-15',
      status: 'lost',
      postedBy: 'Rahul Kumar',
      contact: 'rahul.kumar@chitkara.edu.in',
      images: ['/api/placeholder/300/200'],
      reward: '₹500 reward',
      urgent: true
    },
    {
      id: 2,
      type: 'found',
      title: 'iPhone 13 Pro',
      category: 'Electronics',
      description: 'Found a silver iPhone 13 Pro in a black case. Screen is locked. Found in the cafeteria.',
      location: 'Cafeteria',
      date: '2024-01-14',
      status: 'found',
      postedBy: 'Priya Sharma',
      contact: 'priya.sharma@chitkara.edu.in',
      images: ['/api/placeholder/300/200'],
      reward: null,
      urgent: false
    },
    {
      id: 3,
      type: 'lost',
      title: 'Mathematics Textbook',
      category: 'Books',
      description: 'Engineering Mathematics book by B.S. Grewal. Lost during the last lecture in Room 201.',
      location: 'Room 201',
      date: '2024-01-13',
      status: 'lost',
      postedBy: 'Ankit Gupta',
      contact: 'ankit.gupta@chitkara.edu.in',
      images: ['/api/placeholder/300/200'],
      reward: null,
      urgent: false
    },
    {
      id: 4,
      type: 'claimed',
      title: 'Blue Backpack',
      category: 'Accessories',
      description: 'Blue Nike backpack with laptop compartment. Successfully returned to owner.',
      location: 'Hostel Block A',
      date: '2024-01-10',
      status: 'claimed',
      postedBy: 'Sneha Patel',
      contact: 'sneha.patel@chitkara.edu.in',
      images: ['/api/placeholder/300/200'],
      reward: null,
      urgent: false
    }
  ];
  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });
  const getStatusColor = (status) => {
    switch (status) {
      case 'lost': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'found': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'claimed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case 'lost': return <AlertCircle size={16} />;
      case 'found': return <CheckCircle size={16} />;
      case 'claimed': return <CheckCircle size={16} />;
      default: return null;
    }
  };
  return (
    <div className="max-w-7xl mx-auto p-6 animate-fade-in">
      {}
      <div className="flex justify-between items-center mb-8 animate-slide-down">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Lost & Found</h1>
          <p className="text-gray-600 dark:text-gray-400">Help reunite lost items with their owners</p>
        </div>
        <button
          onClick={() => setShowPostForm(!showPostForm)}
          className="btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          Post Item
        </button>
      </div>
      {}
      {showPostForm && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-lg animate-slide-down">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Post Lost/Found Item</h3>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Item Title</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Black Leather Wallet"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
              <select className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary">
                {categories.slice(1).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
              <textarea
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Detailed description of the item..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Where was it lost/found?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
              <select className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
            </div>
            <div className="md:col-span-2 flex gap-4">
              <button type="submit" className="btn-primary flex-1">Post Item</button>
              <button
                type="button"
                onClick={() => setShowPostForm(false)}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-lg animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search items by title, description, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, index) => (
          <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 card-hover overflow-hidden animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
            {}
            <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
              <img
                src={item.images[0]}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(item.status)}`}>
                {getStatusIcon(item.status)}
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </div>
              {item.urgent && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white rounded-full text-xs font-medium">
                  Urgent
                </div>
              )}
            </div>
            {}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                  {item.category}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                {item.description}
              </p>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>{item.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{new Date(item.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Posted by:</span>
                  <span>{item.postedBy}</span>
                </div>
              </div>
              {item.reward && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-3 mb-4">
                  <p className="text-yellow-800 dark:text-yellow-200 text-sm font-medium">{item.reward}</p>
                </div>
              )}
              <div className="flex gap-2">
                <button className="flex-1 btn-primary">
                  Contact Owner
                </button>
                {item.status === 'found' && (
                  <button className="flex-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded-xl hover:bg-green-200 dark:hover:bg-green-800 transition-colors">
                    Claim Item
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Search size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No items found</h3>
          <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};
export default LostFound;
