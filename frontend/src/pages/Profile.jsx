import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, BookOpen, Calendar, MapPin, Edit, Save, X } from 'lucide-react';
import UserProgress from '../components/gamification/UserProgress';
import AchievementBadges from '../components/gamification/AchievementBadges';
import { usersAPI } from '../services/api';
const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    major: '',
    year: '',
    interests: [],
    avatar_url: '',
    age: ''
  });
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    fetchProfile();
  }, []);
  const fetchProfile = async () => {
    try {
      const response = await usersAPI.getProfile();
      const userData = response.data;
      setProfile(userData);
      setFormData({
        full_name: userData.full_name || '',
        bio: userData.bio || '',
        major: userData.major || '',
        year: userData.year || '',
        interests: userData.interests || [],
        avatar_url: userData.avatar_url || '',
        age: userData.age || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleSave = async () => {
    setSaving(true);
    try {
      await usersAPI.updateProfile(formData);
      setEditing(false);
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };
  const handleCancel = () => {
    setFormData({
      full_name: profile?.full_name || '',
      bio: profile?.bio || '',
      major: profile?.major || '',
      year: profile?.year || '',
      interests: profile?.interests || [],
      avatar_url: profile?.avatar_url || '',
      age: profile?.age || ''
    });
    setEditing(false);
  };
  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen pt-16 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
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
              My Profile
            </h1>
            <p className="text-lg md:text-xl text-textMuted max-w-2xl mx-auto">
              Manage your personal information and track your campus journey.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {}
            <div className="lg:col-span-1">
              <UserProgress />
            </div>
            {}
            <div className="lg:col-span-2 space-y-8">
              {}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gradient-to-br from-surface to-[#1A1A2A] border border-borderSubtle rounded-2xl p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-textPrimary">Personal Information</h2>
                  {!editing ? (
                    <button
                      onClick={() => setEditing(true)}
                      className="bg-accent-gradient text-white px-4 py-2 rounded-full font-medium hover:shadow-[0_0_20px_#6B9FFF]/30 hover:scale-105 transition-all duration-300 flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full font-medium hover:scale-105 transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-medium hover:scale-105 transition-all duration-300 flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
                <div className="text-center mb-8">
                  <div className="w-24 h-24 bg-accent-gradient rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                    {profile?.avatar_url || profile?.full_name?.charAt(0) || 'U'}
                  </div>
                  <h3 className="text-xl font-semibold text-textPrimary">{profile?.full_name}</h3>
                  <p className="text-textMuted">{profile?.major} Student</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-textPrimary mb-2 font-medium">Full Name</label>
                    {editing ? (
                      <input
                        type="text"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        className="w-full px-4 py-3 bg-surface border border-borderSubtle rounded-lg text-textPrimary focus:border-primary focus:outline-none transition-colors"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-surface/50 rounded-lg">
                        <User className="w-5 h-5 text-textMuted" />
                        <span className="text-textPrimary">{profile?.full_name}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-textPrimary mb-2 font-medium">Email</label>
                    <div className="flex items-center gap-3 p-3 bg-surface/50 rounded-lg">
                      <Mail className="w-5 h-5 text-textMuted" />
                      <span className="text-textPrimary">{profile?.email}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-textPrimary mb-2 font-medium">Major</label>
                    {editing ? (
                      <input
                        type="text"
                        value={formData.major}
                        onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                        className="w-full px-4 py-3 bg-surface border border-borderSubtle rounded-lg text-textPrimary focus:border-primary focus:outline-none transition-colors"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-surface/50 rounded-lg">
                        <BookOpen className="w-5 h-5 text-textMuted" />
                        <span className="text-textPrimary">{profile?.major}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-textPrimary mb-2 font-medium">Year</label>
                    {editing ? (
                      <select
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        className="w-full px-4 py-3 bg-surface border border-borderSubtle rounded-lg text-textPrimary focus:border-primary focus:outline-none transition-colors"
                      >
                        <option value="">Select Year</option>
                        <option value="Freshman">Freshman</option>
                        <option value="Sophomore">Sophomore</option>
                        <option value="Junior">Junior</option>
                        <option value="Senior">Senior</option>
                        <option value="Graduate">Graduate</option>
                      </select>
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-surface/50 rounded-lg">
                        <Calendar className="w-5 h-5 text-textMuted" />
                        <span className="text-textPrimary">{profile?.year}</span>
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-textPrimary mb-2 font-medium">Bio</label>
                    {editing ? (
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="w-full px-4 py-3 bg-surface border border-borderSubtle rounded-lg text-textPrimary focus:border-primary focus:outline-none transition-colors"
                        rows="4"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <div className="p-3 bg-surface/50 rounded-lg">
                        <p className="text-textPrimary">{profile?.bio || 'No bio added yet.'}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
              {}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <AchievementBadges />
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
};
export default Profile;
