import React, { useState, useEffect } from 'react';
import { Check, X, User, Clock, FileText } from 'lucide-react';
import { adminAPI } from '../../services/api';
import BaseCard from './BaseCard';
import VisionButton from '../ui/VisionButton';
import toast, { Toaster } from 'react-hot-toast';

const NoticeManagement = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await adminAPI.getContentForModeration('notices');
      const noticesData = response.data.content || [];
      setNotices(noticesData);
    } catch (err) {
      console.error('Failed to fetch notices:', err);
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveNotice = async (noticeId) => {
    try {
      await adminAPI.moderateContent(noticeId, 'notice', 'approve');
      setNotices(notices.filter(notice => notice._id !== noticeId));
      toast.success('Notice approved successfully');
    } catch (err) {
      console.error('Failed to approve notice:', err);
      toast.error('Failed to approve notice');
    }
  };

  const handleRejectNotice = async (noticeId) => {
    try {
      await adminAPI.moderateContent(noticeId, 'notice', 'reject');
      setNotices(notices.filter(notice => notice._id !== noticeId));
      toast.success('Notice rejected successfully');
    } catch (err) {
      console.error('Failed to reject notice:', err);
      toast.error('Failed to reject notice');
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-[0_0_10px_rgba(0,217,255,0.5)]">Manage Pending Notices</h2>
        <div className="text-[#0CEBFF] animate-pulse">Loading notices...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Toaster position="top-center" />
      <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-[0_0_10px_rgba(0,217,255,0.5)]">Manage Pending Notices</h2>
      <div className="space-y-4">
        {notices.length === 0 ? (
          <BaseCard className="text-center py-12">
            <p className="text-gray-300 text-lg">No pending notices to review</p>
            <p className="text-gray-400 text-sm mt-2">New notice submissions will appear here for approval.</p>
          </BaseCard>
        ) : (
          <div className="grid gap-4">
            {notices.map((notice) => (
              <BaseCard key={notice._id} className="transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,217,255,0.4)]">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-r from-[#8B5CF6] to-[#FF3CF0] rounded-full flex items-center justify-center shadow-lg shadow-[#8B5CF6]/50">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Admin</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-300">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-[#0CEBFF]" />
                          {new Date(notice.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-gray-200 mb-4">
                  <h4 className="font-semibold">{notice.title}</h4>
                  <div className="mt-2">
                    <span className="inline-block px-3 py-1 bg-linear-to-r from-[#8B5CF6]/20 to-[#FF3CF0]/20 text-[#06E1FF] rounded-full text-xs font-medium border border-[#8B5CF6]/30">
                      {notice.category}
                    </span>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <VisionButton
                    variant="success"
                    size="sm"
                    onClick={() => handleApproveNotice(notice._id)}
                  >
                    <Check className="w-4 h-4" /> Approve
                  </VisionButton>
                  <VisionButton
                    variant="danger"
                    size="sm"
                    onClick={() => handleRejectNotice(notice._id)}
                  >
                    <X className="w-4 h-4" /> Reject
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

export default NoticeManagement;