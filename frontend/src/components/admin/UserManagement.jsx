 import React, { useState, useEffect } from 'react';
 import { User, Mail, Calendar, Shield } from 'lucide-react';
 import { usersAPI } from '../../services/api';
 import BaseCard from './BaseCard';
 import VisionButton from '../ui/VisionButton';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getUsers();
      const allUsers = response.data.data || response.data;
      setUsers(allUsers.filter(user => user.role !== 'admin'));
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-[0_0_10px_rgba(0,217,255,0.5)]">Manage Users</h2>
        <div className="text-[#0CEBFF] animate-pulse">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-[0_0_10px_rgba(0,217,255,0.5)]">Manage Users</h2>
      <div className="space-y-4">
        {users.length === 0 ? (
          <BaseCard className="text-center py-12">
            <p className="text-gray-300 text-lg">No users found</p>
            <p className="text-gray-400 text-sm mt-2">User registrations will appear here.</p>
          </BaseCard>
        ) : (
          <div className="grid gap-4">
            {users.map((user) => (
              <BaseCard key={user._id || user.id} className="transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,217,255,0.4)]">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-linear-to-r from-[#2F4FFF] to-[#8B5CF6] rounded-full flex items-center justify-center shadow-lg shadow-[#2F4FFF]/50">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2 drop-shadow-[0_0_8px_rgba(0,217,255,0.3)]">{user.name}</h3>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-gray-200">
                        <Mail className="w-4 h-4 text-[#06E1FF]" />
                        <span className="text-sm">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-200">
                        <Calendar className="w-4 h-4 text-[#00F59B]" />
                        <span className="text-sm">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-200">
                        <Shield className="w-4 h-4 text-[#FF3CF0]" />
                        <span className="text-sm">{user.role || 'Student'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <VisionButton variant="primary" size="sm">
                    View Profile
                  </VisionButton>
                  <VisionButton variant="secondary" size="sm">
                    Edit User
                  </VisionButton>
                </div>
              </BaseCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;