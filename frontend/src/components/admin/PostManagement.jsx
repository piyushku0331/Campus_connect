import React, { useState, useEffect } from 'react';
import { FaTrash, FaUser, FaClock, FaHeart } from 'react-icons/fa';
import { postsAPI } from '../../services/api';

const PostManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await postsAPI.getFeed();
      setPosts(response.data.data || response.data);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await postsAPI.deletePost(postId);
      setPosts(posts.filter(post => post._id !== postId));
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  if (loading) {
    return (
      <div className="admin-panel">
        <h2>Manage Community Posts</h2>
        <div className="loading">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <h2>Manage Community Posts</h2>
      <div className="post-management">
        {posts.length === 0 ? (
          <div className="no-posts">
            <p>No posts found</p>
          </div>
        ) : (
          <div className="posts-list">
            {posts.map((post) => (
              <div key={post._id} className="post-item card">
                <div className="post-header">
                  <div className="post-author">
                    <FaUser className="author-icon" />
                    <span>{post.author?.name || 'Unknown User'}</span>
                  </div>
                  <div className="post-meta">
                    <span className="meta-item">
                      <FaClock className="meta-icon" />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <span className="meta-item">
                      <FaHeart className="meta-icon" />
                      {post.likes?.length || 0}
                    </span>
                  </div>
                </div>
                <div className="post-content">
                  <p>{post.content}</p>
                </div>
                <div className="post-actions">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeletePost(post._id)}
                  >
                    <FaTrash /> Delete Post
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostManagement;