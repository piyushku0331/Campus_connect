import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
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
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-3">
          <img
            src={post.creator?.profilePicture || '/default-avatar.png'}
            alt={post.creator?.displayName || 'Creator'}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <p className="font-semibold text-sm">{post.creator?.displayName || 'Creator'}</p>
            <p className="text-xs text-gray-500">2h ago</p>
          </div>
        </div>

        {post.caption && (
          <p className="text-sm mb-3">{post.caption}</p>
        )}

        {post.media && post.media.length > 0 && (
          <div className="mb-3">
            {post.media[0].type === 'video' ? (
              <video
                src={post.media[0].url}
                className="w-full rounded-lg"
                controls
              />
            ) : (
              <img
                src={post.media[0].url}
                alt="Post media"
                className="w-full rounded-lg"
              />
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 ${isLiked ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'} hover:text-red-500 transition-colors`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">{likeCount}</span>
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">{commentCount}</span>
            </button>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors"
          >
            <Share className="w-5 h-5" />
            <span className="text-sm">Share</span>
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            {/* Existing Comments */}
            {post.comments && post.comments.length > 0 && (
              <div className="space-y-2 mb-3">
                {post.comments.slice(0, 3).map((comment, index) => (
                  <div key={index} className="flex space-x-2">
                    <img
                      src={comment.user?.profilePhoto || '/default-avatar.png'}
                      alt={comment.userName || 'User'}
                      className="w-6 h-6 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-semibold">{comment.userName || 'User'}</span>{' '}
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
                {post.comments.length > 3 && (
                  <button className="text-sm text-blue-500 hover:underline">
                    View all {post.comments.length} comments
                  </button>
                )}
              </div>
            )}

            {/* Add Comment */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                onKeyPress={(e) => e.key === 'Enter' && handleComment()}
              />
              <button
                onClick={handleComment}
                disabled={!commentText.trim()}
                className="p-2 text-blue-500 hover:text-blue-600 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
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
    <div className="max-w-md mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Toaster position="top-center" />

      {/* Stories Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex space-x-4 overflow-x-auto">
          {/* Add Story Button */}
          <div className="flex flex-col items-center space-y-1">
            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-gray-300 dark:border-gray-600">
              <Plus className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </div>
            <span className="text-xs text-center">Add Story</span>
          </div>

          {/* Sample Stories */}
          {[1, 2, 3, 4, 5].map((story) => (
            <div key={story} className="flex flex-col items-center space-y-1">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-500 p-0.5">
                <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                  <img
                    src={`/api/placeholder/32/32`}
                    alt={`Story ${story}`}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                </div>
              </div>
              <span className="text-xs text-center">Creator {story}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Posts Feed */}
      <div className="pb-16">
        {loading && posts.length === 0 ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
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
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating Create Button */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-20 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create Post</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Only verified educational content creators can post.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/creator/apply')}
                className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Become a Creator
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
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
