import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FileText, Image, Video, Download, Upload, Star, Users, Search, Filter, X } from 'lucide-react';
// import { resourcesAPI } from '../services/api'; // Commented out for mock functionality
const Resources = () => {
  const [resources, setResources] = useState([
    {
      id: 1,
      title: "Data Structures & Algorithms Study Guide",
      description: "Comprehensive guide covering arrays, linked lists, trees, graphs, and sorting algorithms",
      file_type: "PDF",
      file_url: "https://example.com/dsa-guide.pdf",
      tags: ["study-materials", "computer-science", "algorithms"],
      uploader: { full_name: "Dr. Sarah Johnson" },
      download_count: 245,
      created_at: "2024-01-15T10:00:00Z"
    },
    {
      id: 2,
      title: "Machine Learning Fundamentals",
      description: "Introduction to ML concepts including supervised/unsupervised learning, neural networks",
      file_type: "PDF",
      file_url: "https://example.com/ml-fundamentals.pdf",
      tags: ["machine-learning", "ai", "tutorials"],
      uploader: { full_name: "Prof. Michael Chen" },
      download_count: 189,
      created_at: "2024-01-20T14:30:00Z"
    },
    {
      id: 3,
      title: "Database Design Principles",
      description: "Complete guide to relational database design, normalization, and SQL queries",
      file_type: "PDF",
      file_url: "https://example.com/database-design.pdf",
      tags: ["database", "sql", "reference"],
      uploader: { full_name: "Dr. Emily Rodriguez" },
      download_count: 156,
      created_at: "2024-01-25T09:15:00Z"
    },
    {
      id: 4,
      title: "Web Development Bootcamp Notes",
      description: "HTML, CSS, JavaScript, React, and Node.js comprehensive notes",
      file_type: "PDF",
      file_url: "https://example.com/web-dev-notes.pdf",
      tags: ["web-development", "javascript", "notes"],
      uploader: { full_name: "Alex Kumar" },
      download_count: 312,
      created_at: "2024-02-01T16:45:00Z"
    },
    {
      id: 5,
      title: "Calculus Problem Solutions",
      description: "Step-by-step solutions to common calculus problems and exercises",
      file_type: "PDF",
      file_url: "https://example.com/calculus-solutions.pdf",
      tags: ["mathematics", "calculus", "solutions"],
      uploader: { full_name: "Dr. Robert Wilson" },
      download_count: 98,
      created_at: "2024-02-05T11:20:00Z"
    },
    {
      id: 6,
      title: "Physics Lab Experiments Guide",
      description: "Detailed procedures and explanations for physics laboratory experiments",
      file_type: "PDF",
      file_url: "https://example.com/physics-lab-guide.pdf",
      tags: ["physics", "laboratory", "experiments"],
      uploader: { full_name: "Dr. Lisa Park" },
      download_count: 134,
      created_at: "2024-02-10T13:10:00Z"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    file_url: '',
    file_type: 'PDF',
    tags: []
  });
  const [uploading, setUploading] = useState(false);
  const plans = [
    {
      id: 1,
      name: 'Free Plan',
      price: '₹0',
      period: 'forever',
      features: ['Access to basic resources', '5 downloads per month', 'Community support'],
      popular: false,
      gradient: 'from-[#6B9FFF] to-[#7F40FF]',
      description: 'Perfect for getting started with Campus Connect resources.'
    },
    {
      id: 2,
      name: 'Pro Plan',
      price: '₹749',
      period: 'month',
      features: ['Unlimited downloads', 'Priority support', 'Exclusive premium resources', 'Upload custom resources'],
      popular: true,
      gradient: 'from-[#FF7F50] to-[#FF4500]',
      description: 'Ideal for serious learners who need comprehensive access.'
    },
    {
      id: 3,
      name: 'Enterprise Plan',
      price: '₹2,399',
      period: 'month',
      features: ['Everything in Pro', 'Team collaboration tools', 'Advanced analytics', 'Custom integrations'],
      popular: false,
      gradient: 'from-[#00CED1] to-[#6B9FFF]',
      description: 'For organizations and study groups requiring advanced features.'
    }
  ];
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);
  useEffect(() => {
    fetchResources();
  }, [debouncedSearchQuery, selectedTag, fetchResources]);

  const fetchResources = useCallback(async () => {
    try {
      // For now, filter the mock data based on search and tag
      let filteredResources = [...resources];

      if (debouncedSearchQuery) {
        filteredResources = filteredResources.filter(resource =>
          resource.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          resource.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        );
      }

      if (selectedTag && selectedTag !== '') {
        filteredResources = filteredResources.filter(resource =>
          resource.tags.includes(selectedTag)
        );
      }

      setResources(filteredResources);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchQuery, selectedTag, resources]);
  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      // Mock upload functionality
      const newResource = {
        id: resources.length + 1,
        title: uploadForm.title,
        description: uploadForm.description,
        file_type: uploadForm.file_type,
        file_url: uploadForm.file_url,
        tags: uploadForm.tags,
        uploader: { full_name: "Piyush" }, // Current user
        download_count: 0,
        created_at: new Date().toISOString()
      };
      setResources(prev => [...prev, newResource]);
      setShowUploadForm(false);
      setUploadForm({
        title: '',
        description: '',
        file_url: '',
        file_type: 'PDF',
        tags: []
      });
      // fetchResources(); // Not needed with mock data
    } catch (error) {
      console.error('Error uploading resource:', error);
    } finally {
      setUploading(false);
    }
  };
  const handleDownload = async (resourceId) => {
    try {
      // Mock download functionality
      setResources(prev => prev.map(resource =>
        resource.id === resourceId
          ? { ...resource, download_count: resource.download_count + 1 }
          : resource
      ));
      console.log('Download initiated for resource:', resourceId);
      // Show success message
      alert('Download started! (Mock functionality)');
    } catch (error) {
      console.error('Error downloading resource:', error);
    }
  };
  const getIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'pdf':
        return FileText;
      case 'image':
      case 'jpg':
      case 'png':
        return Image;
      case 'video':
      case 'mp4':
        return Video;
      default:
        return FileText;
    }
  };
  const getGradient = (index) => {
    const gradients = [
      'from-[#6B9FFF] to-[#7F40FF]',
      'from-[#FF7F50] to-[#FF4500]',
      'from-[#00CED1] to-[#6B9FFF]',
      'from-[#7F40FF] to-[#FF7F50]'
    ];
    return gradients[index % gradients.length];
  };
  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
      <div className="relative z-10">
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-accent-gradient">
              Learning Resources
            </h1>
            <p className="text-lg md:text-xl text-textMuted max-w-2xl mx-auto mb-8">
              Access study materials, tutorials, and tools to accelerate your learning journey.
            </p>
            {}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <div className="glass-card rounded-2xl px-6 py-3">
                <span className="text-textPrimary font-medium">247</span>
                <span className="text-textMuted ml-2">Total Resources</span>
              </div>
              <div className="glass-card rounded-2xl px-6 py-3">
                <span className="text-textPrimary font-medium">89</span>
                <span className="text-textMuted ml-2">Study Materials</span>
              </div>
              <div className="glass-card rounded-2xl px-6 py-3">
                <span className="text-textPrimary font-medium">156</span>
                <span className="text-textMuted ml-2">Downloads Today</span>
              </div>
            </div>
            {}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-textMuted w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-surface/80 backdrop-blur-xl border border-borderSubtle rounded-full text-textPrimary placeholder-textMuted focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="px-4 py-3 bg-surface/80 backdrop-blur-xl border border-borderSubtle rounded-full text-textPrimary focus:border-primary focus:outline-none transition-colors"
                >
                  <option value="">All Categories</option>
                  <option value="study-materials">Study Materials</option>
                  <option value="tutorials">Tutorials</option>
                  <option value="reference">Reference</option>
                  <option value="notes">Notes</option>
                </select>
              </div>
              <button
                onClick={() => setShowUploadForm(true)}
                className="bg-accent-gradient text-white font-medium px-8 py-3 rounded-full hover:shadow-[0_0_30px_#6B9FFF]/40 hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Upload Resource
              </button>
            </div>
          </div>
          {}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-gradient-to-br from-surface to-[#1A1A2A] border rounded-2xl p-8 text-center transition-all duration-300 hover:shadow-glow-primary ${
                  plan.popular ? 'border-primary/40 shadow-[0_0_30px_#6B9FFF]/20' : 'border-borderSubtle'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-accent-gradient text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-semibold text-textPrimary mb-2">{plan.name}</h3>
                <p className="text-textMuted text-sm mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="text-textMuted">/{plan.period}</span>
                </div>
                <ul className="text-left space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-textMuted">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${plan.gradient}`}></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full bg-gradient-to-r ${plan.gradient} text-white font-semibold py-3 px-6 rounded-full hover:shadow-[0_0_20px_#6B9FFF]/30 hover:scale-105 transition-all duration-300`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
          {}
          {showUploadForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-surface border border-borderSubtle rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-textPrimary">Upload Resource</h2>
                  <button
                    onClick={() => setShowUploadForm(false)}
                    className="text-textMuted hover:text-textPrimary transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleUpload} className="space-y-4">
                  <div>
                    <label className="block text-textPrimary mb-2">Title</label>
                    <input
                      type="text"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                      className="w-full px-4 py-3 bg-surface border border-borderSubtle rounded-lg text-textPrimary focus:border-primary focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-textPrimary mb-2">Description</label>
                    <textarea
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                      className="w-full px-4 py-3 bg-surface border border-borderSubtle rounded-lg text-textPrimary focus:border-primary focus:outline-none transition-colors"
                      rows="3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-textPrimary mb-2">File URL</label>
                    <input
                      type="url"
                      value={uploadForm.file_url}
                      onChange={(e) => setUploadForm({ ...uploadForm, file_url: e.target.value })}
                      className="w-full px-4 py-3 bg-surface border border-borderSubtle rounded-lg text-textPrimary focus:border-primary focus:outline-none transition-colors"
                      placeholder="https://example.com/file.pdf"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-textPrimary mb-2">File Type</label>
                    <select
                      value={uploadForm.file_type}
                      onChange={(e) => setUploadForm({ ...uploadForm, file_type: e.target.value })}
                      className="w-full px-4 py-3 bg-surface border border-borderSubtle rounded-lg text-textPrimary focus:border-primary focus:outline-none transition-colors"
                    >
                      <option value="PDF">PDF</option>
                      <option value="Image">Image</option>
                      <option value="Video">Video</option>
                      <option value="Document">Document</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-textPrimary mb-2">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={uploadForm.tags.join(', ')}
                      onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                      className="w-full px-4 py-3 bg-surface border border-borderSubtle rounded-lg text-textPrimary focus:border-primary focus:outline-none transition-colors"
                      placeholder="study-materials, notes, cs101"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="w-full bg-accent-gradient text-white font-medium py-3 px-6 rounded-lg hover:shadow-[0_0_20px_#6B9FFF]/30 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'Uploading...' : 'Upload Resource'}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
          {}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-textMuted mt-4">Loading resources...</p>
            </div>
          ) : resources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {resources.map((resource, index) => {
                const IconComponent = getIcon(resource.file_type);
                return (
                  <div
                    key={resource.id}
                    className="bg-gradient-to-br from-surface to-[#1A1A2A] border border-borderSubtle rounded-2xl p-6 hover:shadow-glow-primary transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${getGradient(index)} shadow-lg`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs bg-white/5 text-textMuted px-3 py-1 rounded-full backdrop-blur-md">
                        {resource.tags?.[0] || 'Resource'}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-textPrimary mb-3 group-hover:text-primary transition-colors duration-300">
                      {resource.title}
                    </h3>
                    <div className="space-y-2 mb-6">
                      <p className="text-textMuted text-sm">Type: {resource.file_type}</p>
                      <p className="text-textMuted text-sm">By: {resource.uploader?.full_name || 'Anonymous'}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Download className="w-4 h-4 text-textMuted" />
                          <span className="text-textMuted">{resource.download_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-textMuted">4.5</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(resource.id)}
                      className="w-full bg-accent-gradient text-white font-medium py-3 px-6 rounded-full hover:shadow-[0_0_20px_#6B9FFF]/30 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-textMuted mx-auto mb-4" />
              <p className="text-textMuted text-lg">No resources found.</p>
              <p className="text-textMuted text-sm">Be the first to upload a resource!</p>
            </div>
          )}
        </div>
      </section>
      </div>
    </div>
  );
};
export default Resources;
