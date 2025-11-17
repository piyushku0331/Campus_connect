import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Edit3, Save, X, Eye, EyeOff, Camera, Github, Linkedin, Globe, MapPin, Calendar, Award, Users, UserPlus } from 'lucide-react';
import { usersAPI, connectionsAPI } from '../services/api';
import toast, { Toaster } from 'react-hot-toast';

const Profile = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = searchParams.get('userId');
  const isOwnProfile = !userId;

  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    department: '',
    semester: '',
    campus: '',
    year: '',
    phone: '',
    linkedin: '',
    github: '',
    website: '',
    skills: [],
    interests: [],
    profilePicture: null,
    avatar_url: '',
    isPublic: true
  });

  useEffect(() => {
    if (isOwnProfile) {
      fetchProfile();
    } else {
      fetchUserProfile(userId);
    }
  }, [userId]);

  const fetchUserProfile = async (id) => {
    try {
      const response = await usersAPI.getUserById(id);
      setUser(response.data);
      setFormData({
        name: response.data.name || '',
        bio: '', // Not available in getUserById
        department: response.data.department || '',
        semester: response.data.semester || '',
        campus: '',
        year: '',
        phone: '',
        linkedin: '',
        github: '',
        website: '',
        skills: [],
        interests: [],
        profilePicture: null,
        avatar_url: response.data.avatar_url || '',
        isPublic: true
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await usersAPI.getProfile();
      setUser(response.data);
      setFormData({
        name: response.data.name || '',
        bio: response.data.bio || '',
        department: response.data.department || '',
        semester: response.data.semester || '',
        campus: response.data.campus || '',
        year: response.data.year || '',
        phone: response.data.phone || '',
        linkedin: response.data.linkedin || '',
        github: response.data.github || '',
        website: response.data.website || '',
        skills: response.data.skills || [],
        interests: response.data.interests || [],
        profilePicture: null,
        avatar_url: response.data.avatar_url || '',
        isPublic: response.data.isPublic ?? true
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, value) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({
      ...prev,
      [field]: array
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let dataToSend = formData;
      if (formData.profilePicture instanceof File) {
        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
          if (key === 'profilePicture' && formData[key]) {
            formDataToSend.append('profilePicture', formData[key]);
          } else if (key === 'skills' || key === 'interests') {
            formDataToSend.append(key, JSON.stringify(formData[key]));
          } else {
            formDataToSend.append(key, formData[key]);
          }
        });
        dataToSend = formDataToSend;
      }
      const response = await usersAPI.updateProfile(dataToSend);
      setUser(response.data);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePrivacy = async () => {
    try {
      await usersAPI.togglePrivacy(!formData.isPublic);
      setFormData(prev => ({
        ...prev,
        isPublic: !prev.isPublic
      }));
      toast.success(`Profile is now ${!formData.isPublic ? 'public' : 'private'}`);
    } catch (error) {
      console.error('Error toggling privacy:', error);
      toast.error('Failed to update privacy settings');
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profilePicture: file
      }));
    }
  };

  const handleSendFollowRequest = async (id) => {
    try {
      await connectionsAPI.sendConnectionRequest(id);
      toast.success('Follow request sent!');
    } catch (error) {
      console.error('Error sending follow request:', error);
      toast.error('Failed to send follow request');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="relative"
                >
                  <img
                    src={formData.profilePicture || formData.avatar_url || '/default-avatar.png'}
                    alt="Profile"
                    className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                  />
                  {isEditing && isOwnProfile && (
                    <label className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
                      <Camera className="w-4 h-4 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold">{formData.name || 'Your Name'}</h1>
                  <p className="text-blue-100">{formData.department} • {formData.semester}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1">
                      <Award className="w-4 h-4" />
                      <span className="text-sm">Level {Math.floor((user?.points || 0) / 100) + 1}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{user?.points || 0} points</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {isOwnProfile ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleTogglePrivacy}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        formData.isPublic
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : 'bg-gray-600 hover:bg-gray-700 text-white'
                      }`}
                    >
                      {formData.isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      <span>{formData.isPublic ? 'Public' : 'Private'}</span>
                    </motion.button>
                    <AnimatePresence mode="wait">
                      {isEditing ? (
                        <motion.div
                          key="edit-buttons"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex space-x-2"
                        >
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
                          >
                            <Save className="w-4 h-4" />
                            <span>{saving ? 'Saving...' : 'Save'}</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsEditing(false)}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                            <span>Cancel</span>
                          </motion.button>
                        </motion.div>
                      ) : (
                        <motion.button
                          key="edit-button"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIsEditing(true)}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                          <span>Edit Profile</span>
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSendFollowRequest(userId)}
                    className="flex items-center space-x-2 px-4 py-2 bg-accent hover:bg-accent/80 text-white rounded-lg transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Send Follow Request</span>
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div
                  key="edit-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Department
                      </label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Semester
                      </label>
                      <input
                        type="text"
                        value={formData.semester}
                        onChange={(e) => handleInputChange('semester', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Campus
                      </label>
                      <input
                        type="text"
                        value={formData.campus}
                        onChange={(e) => handleInputChange('campus', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Year
                      </label>
                      <input
                        type="text"
                        value={formData.year}
                        onChange={(e) => handleInputChange('year', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        LinkedIn
                      </label>
                      <input
                        type="url"
                        value={formData.linkedin}
                        onChange={(e) => handleInputChange('linkedin', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        GitHub
                      </label>
                      <input
                        type="url"
                        value={formData.github}
                        onChange={(e) => handleInputChange('github', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="https://github.com/yourusername"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Skills (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.skills.join(', ')}
                      onChange={(e) => handleArrayChange('skills', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="JavaScript, React, Node.js"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Interests (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.interests.join(', ')}
                      onChange={(e) => handleArrayChange('interests', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="AI, Web Development, Gaming"
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="profile-view"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Bio Section */}
                  {formData.bio && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">About</h3>
                      <p className="text-gray-600 dark:text-gray-300">{formData.bio}</p>
                    </div>
                  )}

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Academic Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-300">{formData.department} • {formData.semester}</span>
                        </div>
                        {formData.campus && (
                          <div className="flex items-center space-x-3">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-300">{formData.campus}</span>
                          </div>
                        )}
                        {formData.year && (
                          <div className="flex items-center space-x-3">
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-300">{formData.year}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Contact & Links</h3>
                      <div className="space-y-3">
                        {formData.phone && (
                          <div className="flex items-center space-x-3">
                            <User className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-300">{formData.phone}</span>
                          </div>
                        )}
                        {formData.linkedin && (
                          <a href={formData.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                            <Linkedin className="w-5 h-5" />
                            <span>LinkedIn Profile</span>
                          </a>
                        )}
                        {formData.github && (
                          <a href={formData.github} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                            <Github className="w-5 h-5" />
                            <span>GitHub Profile</span>
                          </a>
                        )}
                        {formData.website && (
                          <a href={formData.website} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300">
                            <Globe className="w-5 h-5" />
                            <span>Personal Website</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Skills & Interests */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {formData.skills.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {formData.skills.map((skill, index) => (
                            <motion.span
                              key={index}
                              whileHover={{ scale: 1.05 }}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm dark:bg-blue-900 dark:text-blue-200"
                            >
                              {skill}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    )}

                    {formData.interests.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Interests</h3>
                        <div className="flex flex-wrap gap-2">
                          {formData.interests.map((interest, index) => (
                            <motion.span
                              key={index}
                              whileHover={{ scale: 1.05 }}
                              className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm dark:bg-purple-900 dark:text-purple-200"
                            >
                              {interest}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
