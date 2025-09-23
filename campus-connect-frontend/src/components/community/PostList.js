import React from 'react';
import PostCard from './PostCard';

const PostList = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return <p style={{ textAlign: 'center' }}>No posts yet. Be the first to share!</p>;
  }

  return (
    <div className="post-list">
      {posts.map(post => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
};

export default PostList;