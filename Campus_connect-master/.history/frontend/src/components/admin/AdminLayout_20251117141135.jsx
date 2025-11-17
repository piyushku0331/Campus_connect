import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Shield, BarChart3, Users, Calendar, UserCheck, FileText, Settings } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const AdminLayout = ({ children, activeTab }) => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const adminNavItems = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/admin' },
    { id: 'users', label: 'Users', icon: Users, href: '/admin' },
    { id: 'events', label: 'Events', icon: Calendar, href: '/admin' },
    { id: 'alumni', label: 'Alumni', icon: UserCheck, href: '/admin' },
    { id: 'moderation', label: 'Moderation', icon: FileText, href: '/admin' },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Admin Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-red-500 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                <p className="text-sm text-gray-400">Campus Connect Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">Welcome, {user?.name}</span>
              <button
                onClick={handleSignOut}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Admin Sidebar */}
        <nav className="w-64 bg-gray-800 min-h-screen border-r border-gray-700">
          <div className="p-4">
            <ul className="space-y-2">
              {adminNavItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => window.location.hash = item.id}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-red-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Admin Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;