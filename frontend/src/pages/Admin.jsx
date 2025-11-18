import React, { useState } from 'react';
import { BarChart3, Users, Calendar, GraduationCap, Shield } from 'lucide-react';
import EventManagement from '../components/admin/EventManagement';
import UserManagement from '../components/admin/UserManagement';
import PostManagement from '../components/admin/PostManagement';
import EventPostingForm from '../components/admin/EventPostingForm';
import NoticeUploadForm from '../components/admin/NoticeUploadForm';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('analytics');

  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'alumni', label: 'Alumni', icon: GraduationCap },
    { id: 'moderation', label: 'Moderation', icon: Shield },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'analytics':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">1,234</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-500">Active Events</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">45</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-500">Community Posts</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">892</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-500">Uploaded Notices</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">67</p>
              </div>
            </div>
          </div>
        );
      case 'users':
        return <UserManagement />;
      case 'events':
        return (
          <div>
            <div className="mb-8">
              <EventPostingForm />
            </div>
            <EventManagement />
          </div>
        );
      case 'alumni':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Alumni Management</h2>
            <p className="text-gray-600">Alumni features coming soon...</p>
          </div>
        );
      case 'moderation':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Content Moderation</h2>
            <div className="space-y-8">
              <PostManagement />
              <NoticeUploadForm />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Administration Panel</h1>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;