import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, CheckCircle, AlertCircle, Plus, Filter, Upload } from 'lucide-react';
import { lostItemsAPI } from '../services/api';
import toast from 'react-hot-toast';

const LostFound = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showPostForm, setShowPostForm] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    location: '',
    category: 'Other',
    status: 'Lost'
  });
  const [selectedImage, setSelectedImage] = useState(null);

  const categories = ['All', 'Electronics', 'Books', 'Clothing', 'Accessories', 'Documents', 'Keys', 'Other'];
  const statuses = ['All', 'Lost', 'Found', 'Claimed'];

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      console.log('Fetching items...');
      const response = await lostItemsAPI.getAllItems(1, 50);
      console.log('Fetched items:', response.data.items);
      setItems(response.data.items || []);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error('Failed to load items');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('itemName', formData.itemName);
      submitData.append('description', formData.description);
      submitData.append('location', formData.location);
      submitData.append('category', formData.category);
      submitData.append('status', formData.status);

      if (selectedImage) {
        submitData.append('image', selectedImage);
      }

      await lostItemsAPI.reportItem(submitData);

      toast.success('Item reported successfully!');
      setShowPostForm(false);
      setFormData({
        itemName: '',
        description: '',
        location: '',
        category: 'Other',
        status: 'Lost'
      });
      setSelectedImage(null);
      fetchItems(); // Refresh the list
    } catch (error) {
      console.error('Error submitting item:', error);
      toast.error('Failed to report item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleClaimItem = async (itemId) => {
    try {
      console.log('Attempting to claim item:', itemId);
      const response = await lostItemsAPI.claimItem(itemId);
      console.log('Claim response:', response);
      toast.success('Item claimed successfully!');
      // Update the item in the state immediately
      setItems(prevItems =>
        prevItems.map(item =>
          item._id === itemId ? response.data.item : item
        )
      );
    } catch (error) {
      console.error('Error claiming item:', error);
      toast.error(error.response?.data?.error || 'Failed to claim item');
    }
  };
  const filteredItems = items.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.location && item.location.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'lost': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'found': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'claimed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };
  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
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
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Report Lost/Found Item</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Item Name</label>
              <input
                type="text"
                value={formData.itemName}
                onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Black Leather Wallet"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {categories.slice(1).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Detailed description of the item..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Where was it lost/found?"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Lost">Lost</option>
                <option value="Found">Found</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image (Optional)</label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <Upload size={20} />
                  {selectedImage ? selectedImage.name : 'Choose Image'}
                </label>
                {selectedImage && (
                  <button
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Reporting...' : 'Report Item'}
              </button>
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
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4">Loading items...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <div key={item._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 card-hover overflow-hidden animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              {}
              <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                {item.imagePath ? (
                  <img
                    src={`http://localhost:5000/${item.imagePath}`}
                    alt={item.itemName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Search size={48} />
                  </div>
                )}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(item.status)}`}>
                  {getStatusIcon(item.status)}
                  {item.status}
                </div>
              </div>
              {}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{item.itemName}</h3>
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                    {item.category}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                  {item.description}
                </p>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {item.location && (
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span>{item.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                  {item.reporter && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Posted by:</span>
                      <span>{item.reporter.name}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 btn-primary">
                    Contact Owner
                  </button>
                  {item.status === 'Found' && (
                    <button
                      className="flex-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded-xl hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                      onClick={() => handleClaimItem(item._id)}
                    >
                      Claim Item
                    </button>
                  )}
                  {item.status === 'Claimed' && item.claimant && (
                    <div className="flex-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-xl text-center">
                      Claimed by {item.claimant.name}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
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
