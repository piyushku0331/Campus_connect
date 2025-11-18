import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share, Plus, Play, Pause, Volume2, VolumeX, MoreHorizontal, Send, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { postsAPI } from '../services/api';
import toast, { Toaster } from 'react-hot-toast';

// PostCard Component
const PostCard = ({ post, onLike, onComment }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false); // This should come from user data
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [commentCount, setCommentCount] = useState(post.commentCount || 0);

  const handleLike = async () => {
    try {
      const result = await onLike(post._id);
      setIsLiked(result.liked);
      setLikeCount(result.likeCount);
    } catch {
      toast.error('Failed to toggle like');
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;

    try {
      await onComment(post._id, { content: commentText.trim() });
      setCommentText('');
      setCommentCount(prev => prev + 1);
      toast.success('Comment added');
    } catch {
      toast.error('Failed to add comment');
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/post/${post._id}`);
      toast.success('Link copied to clipboard!');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="glass-card rounded-2xl border border-borderSubtle mb-6 hover:shadow-cinematic-glow transition-all duration-500 interactive-element">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="relative">
            <img
              src={post.creator?.profilePicture || '/default-avatar.png'}
              alt={post.creator?.displayName || 'Creator'}
              className="w-12 h-12 rounded-full border-2 border-primary/30 shadow-lg"
            />
            {post.creator?.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold text-textPrimary text-base">{post.creator?.displayName || 'Creator'}</p>
            <p className="text-xs text-textMuted">2h ago</p>
          </div>
        </div>

        {post.caption && (
          <p className="text-textPrimary text-base leading-relaxed mb-4">{post.caption}</p>
        )}

        {post.media && post.media.length > 0 && (
          <div className="mb-4 rounded-xl overflow-hidden shadow-lg">
            {post.media[0].type === 'video' ? (
              <video
                src={post.media[0].url}
                className="w-full max-h-96 object-cover"
                controls
                style={{ filter: 'brightness(1.05) contrast(1.1)' }}
              />
            ) : (
              <img
                src={post.media[0].url}
                alt="Post media"
                className="w-full max-h-96 object-cover hover:scale-105 transition-transform duration-500"
                style={{ filter: 'brightness(1.05) contrast(1.1)' }}
              />
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-6">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-300 hover:scale-105 ${
                isLiked
                  ? 'text-red-400 bg-red-500/10 hover:bg-red-500/20'
                  : 'text-textMuted hover:text-red-400 hover:bg-red-500/10'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">{likeCount}</span>
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 px-3 py-2 rounded-full text-textMuted hover:text-primary hover:bg-primary/10 transition-all duration-300 hover:scale-105"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{commentCount}</span>
            </button>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center space-x-2 px-3 py-2 rounded-full text-textMuted hover:text-success hover:bg-success/10 transition-all duration-300 hover:scale-105"
          >
            <Share className="w-5 h-5" />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="border-t border-borderSubtle pt-4 animate-fade-in">
            {/* Existing Comments */}
            {post.comments && post.comments.length > 0 && (
              <div className="space-y-3 mb-4">
                {post.comments.slice(0, 3).map((comment, index) => (
                  <div key={index} className="flex space-x-3 p-3 rounded-lg bg-surface/30">
                    <img
                      src={comment.user?.profilePhoto || '/default-avatar.png'}
                      alt={comment.userName || 'User'}
                      className="w-8 h-8 rounded-full border border-borderSubtle"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-textPrimary">
                        <span className="font-semibold text-primary">{comment.userName || 'User'}</span>{' '}
                        <span className="text-textSecondary">{comment.content}</span>
                      </p>
                    </div>
                  </div>
                ))}
                {post.comments.length > 3 && (
                  <button className="text-sm text-primary hover:text-primary/80 font-medium transition-colors hover:underline">
                    View all {post.comments.length} comments
                  </button>
                )}
              </div>
            )}

            {/* Add Comment */}
            <div className="flex space-x-3">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-4 py-3 text-sm bg-surface/50 border border-borderSubtle rounded-xl text-textPrimary placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                onKeyPress={(e) => e.key === 'Enter' && handleComment()}
              />
              <button
                onClick={handleComment}
                disabled={!commentText.trim()}
                className="p-3 text-primary hover:text-primary/80 disabled:text-textDisabled disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 rounded-xl hover:bg-primary/10"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Feed = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchFeed = useCallback(async () => {
    try {
      const response = await postsAPI.getFeed();
      if (page === 1) {
        setPosts(response.data.posts);
      } else {
        setPosts(prev => [...prev, ...response.data.posts]);
      }
      setHasMore(response.data.pagination.hasMore);
    } catch (error) {
      console.error('Error fetching feed:', error);
      toast.error('Failed to load feed');
    } finally {
      setLoading(false);
    }
  }, [page]);

  const handleLike = async (postId) => {
    const result = await postsAPI.toggleLike(postId);
    // Update local state
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post._id === postId
          ? { ...post, likeCount: result.data.likeCount }
          : post
      )
    );
    return result.data;
  };

  const handleComment = async (postId, commentData) => {
    await postsAPI.addComment(postId, commentData);
    // Optionally refetch post to get updated comments
    // For now, just increment count locally
  };


  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);



  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 bg-linear-to-br from-black/70 via-black/50 to-black/70"></div>
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-6">
        <Toaster position="top-center" />

        {/* Stories Section */}
        <div className="glass-card rounded-2xl border border-borderSubtle p-6 mb-6">
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
            {/* Add Story Button */}
            <div className="flex flex-col items-center space-y-2 shrink-0">
              <div className="w-16 h-16 rounded-full glass-effect border-2 border-primary/30 flex items-center justify-center hover:border-primary/60 transition-all duration-300 hover:scale-105 cursor-pointer">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs text-center text-textMuted font-medium">Add Story</span>
            </div>

            {/* Sample Stories */}
            {[1, 2, 3, 4, 5].map((story) => (
              <div key={story} className="flex flex-col items-center space-y-2 shrink-0">
                <div className="w-16 h-16 rounded-full bg-linear-to-br from-primary via-secondary to-accent p-0.5 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="w-full h-full rounded-full glass-effect flex items-center justify-center border border-white/10">
                    <img
                      src={`/api/placeholder/32/32`}
                      alt={`Story ${story}`}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  </div>
                </div>
                <span className="text-xs text-center text-textMuted font-medium">Creator {story}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Posts Feed */}
        <div className="pb-20">
          {loading && posts.length === 0 ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary/30 border-t-primary"></div>
            </div>
          ) : (
            <>
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onLike={handleLike}
                  onComment={handleComment}
                />
              ))}

              {hasMore && (
                <div className="text-center py-8">
                  <button
                    onClick={() => setPage(prev => prev + 1)}
                    className="glass-effect border border-primary/30 text-primary hover:border-primary/60 px-8 py-3 rounded-full font-medium hover:bg-primary/10 transition-all duration-300 hover:scale-105 hover:shadow-glow-primary"
                  >
                    Load More Posts
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Floating Create Button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="fixed bottom-20 right-4 w-14 h-14 glass-card border border-primary/30 rounded-full shadow-glow-primary hover:shadow-cinematic-glow hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        >
          <Plus className="w-6 h-6 text-primary group-hover:text-primary/80" />
        </button>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl border border-borderSubtle p-8 w-full max-w-lg"
          >
            <h2 className="text-2xl font-bold text-textPrimary mb-4">Create Post</h2>
            <p className="text-textMuted mb-6">
              Only verified educational content creators can post.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/creator/apply')}
                className="flex-1 bg-accent-gradient text-white font-medium py-3 px-6 rounded-xl hover:shadow-glow-accent hover:scale-105 transition-all duration-300"
              >
                Become a Creator
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-3 glass-effect border border-borderSubtle text-textPrimary rounded-xl hover:bg-surface/50 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
      </div>
    </div>
  );
};

// PropTypes validation
PostCard.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string,
    creator: PropTypes.shape({
      displayName: PropTypes.string,
      profilePicture: PropTypes.string,
      isVerified: PropTypes.bool
    }),
    caption: PropTypes.string,
    media: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.string,
      url: PropTypes.string
    })),
    likeCount: PropTypes.number,
    commentCount: PropTypes.number,
    comments: PropTypes.arrayOf(PropTypes.shape({
      user: PropTypes.shape({
        profilePhoto: PropTypes.string
      }),
      userName: PropTypes.string,
      content: PropTypes.string
    }))
  }).isRequired,
  onLike: PropTypes.func.isRequired,
  onComment: PropTypes.func.isRequired
};

export default Feed;
