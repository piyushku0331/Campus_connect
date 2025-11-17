import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Bell, Shield, Palette, Globe, Save, Eye, EyeOff } from 'lucide-react';
const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      events: true,
      connections: true,
      achievements: true
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showConnections: true,
      allowMessages: true
    },
    appearance: {
      theme: 'dark',
      language: 'en'
    },
    account: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });
  const [saving, setSaving] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const handleNotificationChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };
  const handlePrivacyChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
  };
  const handleAppearanceChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [key]: value
      }
    }));
  };
  const handleAccountChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      account: {
        ...prev.account,
        [key]: value
      }
    }));
  };
  const handleSave = async (section) => {
    setSaving(true);
    try {
      // TODO: Implement actual API call to save specific section
      console.log(`Saving ${section} settings:`, settings[section]);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };
  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
      <div className="relative z-10">
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-accent-gradient">
              Settings
            </h1>
            <p className="text-lg md:text-xl text-textMuted max-w-2xl mx-auto">
              Customize your experience and manage your account preferences.
            </p>
          </motion.div>
          <div className="space-y-8">
            {}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gradient-to-br from-surface to-[#1A1A2A] border border-borderSubtle rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-r from-[#6B9FFF] to-[#7F40FF] shadow-lg">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-textPrimary">Notifications</h2>
              </div>
              <div className="space-y-4">
                {Object.entries(settings.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-surface/50 rounded-lg">
                    <div>
                      <label className="text-textPrimary font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </label>
                      <p className="text-textMuted text-sm">
                        Receive notifications for {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => handleNotificationChange(key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-surface peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleSave('notifications')}
                disabled={saving}
                className="mt-6 bg-accent-gradient text-white font-medium px-6 py-3 rounded-lg hover:shadow-[0_0_20px_#6B9FFF]/30 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Notification Settings'}
              </button>
            </motion.div>
            {}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-surface to-[#1A1A2A] border border-borderSubtle rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-r from-[#FF7F50] to-[#FF4500] shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-textPrimary">Privacy</h2>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-surface/50 rounded-lg">
                  <label className="block text-textPrimary font-medium mb-2">Profile Visibility</label>
                  <select
                    value={settings.privacy.profileVisibility}
                    onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                    className="w-full px-4 py-3 bg-surface border border-borderSubtle rounded-lg text-textPrimary focus:border-primary focus:outline-none transition-colors"
                  >
                    <option value="public">Public - Anyone can see your profile</option>
                    <option value="connections">Connections - Only your connections can see</option>
                    <option value="private">Private - Only you can see your profile</option>
                  </select>
                </div>
                {Object.entries(settings.privacy).filter(([key]) => key !== 'profileVisibility').map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-surface/50 rounded-lg">
                    <div>
                      <label className="text-textPrimary font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </label>
                      <p className="text-textMuted text-sm">
                        {key === 'showEmail' && 'Display your email address on your profile'}
                        {key === 'showConnections' && 'Show your connections to others'}
                        {key === 'allowMessages' && 'Allow other users to send you messages'}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => handlePrivacyChange(key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-surface peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleSave('privacy')}
                disabled={saving}
                className="mt-6 bg-accent-gradient text-white font-medium px-6 py-3 rounded-lg hover:shadow-[0_0_20px_#6B9FFF]/30 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Privacy Settings'}
              </button>
            </motion.div>
            {}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-br from-surface to-[#1A1A2A] border border-borderSubtle rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-r from-[#00CED1] to-[#6B9FFF] shadow-lg">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-textPrimary">Appearance</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-surface/50 rounded-lg">
                  <label className="block text-textPrimary font-medium mb-2">Theme</label>
                  <select
                    value={settings.appearance.theme}
                    onChange={(e) => handleAppearanceChange('theme', e.target.value)}
                    className="w-full px-4 py-3 bg-surface border border-borderSubtle rounded-lg text-textPrimary focus:border-primary focus:outline-none transition-colors"
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="auto">Auto (System)</option>
                  </select>
                </div>
                <div className="p-4 bg-surface/50 rounded-lg">
                  <label className="block text-textPrimary font-medium mb-2">Language</label>
                  <select
                    value={settings.appearance.language}
                    onChange={(e) => handleAppearanceChange('language', e.target.value)}
                    className="w-full px-4 py-3 bg-surface border border-borderSubtle rounded-lg text-textPrimary focus:border-primary focus:outline-none transition-colors"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
              </div>
              <button
                onClick={() => handleSave('appearance')}
                disabled={saving}
                className="mt-6 bg-accent-gradient text-white font-medium px-6 py-3 rounded-lg hover:shadow-[0_0_20px_#6B9FFF]/30 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Appearance Settings'}
              </button>
            </motion.div>
            {}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-br from-surface to-[#1A1A2A] border border-borderSubtle rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-r from-[#7F40FF] to-[#FF7F50] shadow-lg">
                  <SettingsIcon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-textPrimary">Account Security</h2>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-surface/50 rounded-lg">
                  <label className="block text-textPrimary font-medium mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={settings.account.currentPassword}
                      onChange={(e) => handleAccountChange('currentPassword', e.target.value)}
                      className="w-full px-4 py-3 bg-surface border border-borderSubtle rounded-lg text-textPrimary focus:border-primary focus:outline-none transition-colors pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-textMuted hover:text-textPrimary"
                    >
                      {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-surface/50 rounded-lg">
                  <label className="block text-textPrimary font-medium mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={settings.account.newPassword}
                      onChange={(e) => handleAccountChange('newPassword', e.target.value)}
                      className="w-full px-4 py-3 bg-surface border border-borderSubtle rounded-lg text-textPrimary focus:border-primary focus:outline-none transition-colors pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-textMuted hover:text-textPrimary"
                    >
                      {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-surface/50 rounded-lg">
                  <label className="block text-textPrimary font-medium mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={settings.account.confirmPassword}
                      onChange={(e) => handleAccountChange('confirmPassword', e.target.value)}
                      className="w-full px-4 py-3 bg-surface border border-borderSubtle rounded-lg text-textPrimary focus:border-primary focus:outline-none transition-colors pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-textMuted hover:text-textPrimary"
                    >
                      {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleSave('account')}
                disabled={saving}
                className="mt-6 bg-accent-gradient text-white font-medium px-6 py-3 rounded-lg hover:shadow-[0_0_20px_#6B9FFF]/30 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Updating...' : 'Update Password'}
              </button>
            </motion.div>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
};
export default Settings;
