import React, { useState, useEffect } from 'react';
import { Check, X, User, Clock, Download } from 'lucide-react';
import { adminAPI } from '../../services/api';
import BaseCard from './BaseCard';
import VisionButton from '../ui/VisionButton';
import toast, { Toaster } from 'react-hot-toast';

const ResourceManagement = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await adminAPI.getContentForModeration('resources');
      const resourcesData = response.data.content || [];
      setResources(resourcesData);
    } catch (err) {
      console.error('Failed to fetch resources:', err);
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveResource = async (resourceId) => {
    try {
      await adminAPI.moderateContent(resourceId, 'resource', 'approve');
      setResources(resources.filter(resource => resource._id !== resourceId));
      toast.success('Resource approved successfully');
    } catch (err) {
      console.error('Failed to approve resource:', err);
      toast.error('Failed to approve resource');
    }
  };

  const handleRejectResource = async (resourceId) => {
    try {
      await adminAPI.moderateContent(resourceId, 'resource', 'reject');
      setResources(resources.filter(resource => resource._id !== resourceId));
      toast.success('Resource rejected successfully');
    } catch (err) {
      console.error('Failed to reject resource:', err);
      toast.error('Failed to reject resource');
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-[0_0_10px_rgba(0,217,255,0.5)]">Manage Pending Resources</h2>
        <div className="text-[#0CEBFF] animate-pulse">Loading resources...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Toaster position="top-center" />
      <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-[0_0_10px_rgba(0,217,255,0.5)]">Manage Pending Resources</h2>
      <div className="space-y-4">
        {resources.length === 0 ? (
          <BaseCard className="text-center py-12">
            <p className="text-gray-300 text-lg">No pending resources to review</p>
            <p className="text-gray-400 text-sm mt-2">New resource submissions will appear here for approval.</p>
          </BaseCard>
        ) : (
          <div className="grid gap-4">
            {resources.map((resource) => (
              <BaseCard key={resource._id} className="transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,217,255,0.4)]">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-r from-[#8B5CF6] to-[#FF3CF0] rounded-full flex items-center justify-center shadow-lg shadow-[#8B5CF6]/50">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{resource.uploader_id?.name || 'Unknown User'}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-300">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-[#0CEBFF]" />
                          {new Date(resource.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="w-4 h-4 text-[#FF3CF0]" />
                          {resource.download_count || 0}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-gray-200 mb-4">
                  <h4 className="font-semibold">{resource.title}</h4>
                  <p className="text-sm mt-1">{resource.description}</p>
                  <div className="mt-2">
                    <span className="inline-block px-3 py-1 bg-linear-to-r from-[#8B5CF6]/20 to-[#FF3CF0]/20 text-[#06E1FF] rounded-full text-xs font-medium border border-[#8B5CF6]/30">
                      {resource.file_type}
                    </span>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <VisionButton
                    variant="success"
                    size="sm"
                    onClick={() => handleApproveResource(resource._id)}
                  >
                    <Check className="w-4 h-4" /> Approve
                  </VisionButton>
                  <VisionButton
                    variant="danger"
                    size="sm"
                    onClick={() => handleRejectResource(resource._id)}
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

export default ResourceManagement;