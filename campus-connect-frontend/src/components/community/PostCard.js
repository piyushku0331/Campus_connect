import React, { useState } from 'react';
import { FaHeart, FaRegHeart, FaCommentAlt } from 'react-icons/fa';
import '../../assets/styles/components/community/PostCard.css';

const PostCard = ({ post }) => {
  const { author, content, likes, comments, createdAt } = post;

  // In a real app, you'd check if the current user's ID is in the `likes` array.
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes.length);

  // Function to get user initials
  const getUserInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  // Function to get profile image or initials
  const getProfileDisplay = () => {
    if (author.profilePicture) {
      return <img src={author.profilePicture} alt={`${author.name}'s profile`} className="post-author-img" />;
    } else {
      return (
        <div className="post-author-initials">
          {getUserInitials(author.name)}
        </div>
      );
    }
  };

  const handleLike = () => {
    // This is where you would make an API call to like/unlike the post.
    if (isLiked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setIsLiked(prev => !prev);
  };

  return (
    <div className="post-card">
      <div className="post-header">
        {getProfileDisplay()}
        <div className="post-author-info">
          <span className="post-author-name">{author.name}</span>
          <span className="post-timestamp">{new Date(createdAt).toLocaleString()}</span>
        </div>
      </div>
      <div className="post-content">
        <p>{content}</p>
      </div>
      <div className="post-stats">
        <span>{likeCount} Likes</span>
        <span>{comments.length} Comments</span>
      </div>
      <div className="post-actions">
        <button onClick={handleLike} className={`action-btn ${isLiked ? 'liked' : ''}`}>
          {isLiked ? <FaHeart /> : <FaRegHeart />}
          Like
        </button>
        <button className="action-btn">
          <FaCommentAlt />
          Comment
        </button>
      </div>
    </div>
  );
};

export default PostCard;