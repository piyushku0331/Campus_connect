import React, { useState, useEffect } from 'react';
import { Trash2, User, Clock, Heart, Check, X } from 'lucide-react';
import { adminAPI } from '../../services/api';
import BaseCard from './BaseCard';
import VisionButton from '../ui/VisionButton';
import toast, { Toaster } from 'react-hot-toast';

const PostManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await adminAPI.getContentForModeration('posts');
      const postsData = response.data.content || [];
      setPosts(postsData);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePost = async (postId) => {
    try {
      await adminAPI.moderateContent(postId, 'post', 'approve');
      setPosts(posts.filter(post => post._id !== postId));
      toast.success('Post approved successfully');
    } catch (err) {
      console.error('Failed to approve post:', err);
      toast.error('Failed to approve post');
    }
  };

  const handleRejectPost = async (postId) => {
    try {
      await adminAPI.moderateContent(postId, 'post', 'reject');
      setPosts(posts.filter(post => post._id !== postId));
      toast.success('Post rejected successfully');
    } catch (err) {
      console.error('Failed to reject post:', err);
      toast.error('Failed to reject post');
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-[0_0_10px_rgba(0,217,255,0.5)]">Manage Community Posts</h2>
        <div className="text-[#0CEBFF] animate-pulse">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Toaster position="top-center" />
      <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-[0_0_10px_rgba(0,217,255,0.5)]">Manage Pending Posts</h2>
      <div className="space-y-4">
        {posts.length === 0 ? (
          <BaseCard className="text-center py-12">
            <p className="text-gray-300 text-lg">No posts found</p>
            <p className="text-gray-400 text-sm mt-2">Posts will appear here once users start sharing content.</p>
          </BaseCard>
        ) : (
          <div className="grid gap-4">
            {posts.map((post) => (
              <BaseCard key={post._id || post.id} className="transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,217,255,0.4)]">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-r from-[#8B5CF6] to-[#FF3CF0] rounded-full flex items-center justify-center shadow-lg shadow-[#8B5CF6]/50">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{post.creator?.displayName || 'Unknown User'}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-300">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-[#0CEBFF]" />
                          {new Date(post.createdAt || post.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4 text-[#FF3CF0]" />
                          {post.likes?.length || 0}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-gray-200 mb-4">
                  <p>{post.caption || post.content}</p>
                </div>
                <div className="flex justify-end gap-2">
                  <VisionButton
                    variant="success"
                    size="sm"
                    onClick={() => handleApprovePost(post._id)}
                  >
                    <Check className="w-4 h-4" /> Approve
                  </VisionButton>
                  <VisionButton
                    variant="danger"
                    size="sm"
                    onClick={() => handleRejectPost(post._id)}
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

export default PostManagement;