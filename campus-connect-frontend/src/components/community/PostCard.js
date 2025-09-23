import React, { useState } from 'react';
import { FaHeart, FaRegHeart, FaCommentAlt, FaPaperPlane } from 'react-icons/fa';
import '../../assets/styles/components/community/PostCard.css';

const PostCard = ({ post }) => {
  const { author, content, likes, comments, createdAt } = post;

  // In a real app, you'd check if the current user's ID is in the `likes` array.
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes.length);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentList, setCommentList] = useState(comments);

  // Function to get user initials
  const getUserInitials = (name) => {
    const words = name.trim().split(' ').filter(word => word.length > 0);
    if (words.length === 0) return '?';

    // Take first letter of first word and first letter of last word (if multiple words)
    const firstInitial = words[0].charAt(0).toUpperCase();
    const lastInitial = words.length > 1 ? words[words.length - 1].charAt(0).toUpperCase() : '';

    return (firstInitial + lastInitial).slice(0, 2);
  };

  // Function to get avatar color based on name
  const getAvatarColor = (name) => {
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Purple
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', // Pink-Red
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', // Blue-Cyan
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', // Green
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', // Pink-Yellow
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', // Mint-Pink
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', // Coral-Pink
      'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', // Peach
    ];

    // Use name length to determine color index
    const index = name.length % colors.length;
    return colors[index];
  };

  // Function to get profile image or initials
  const getProfileDisplay = () => {
    if (author.profilePicture) {
      return <img src={author.profilePicture} alt={`${author.name}'s profile`} className="post-author-img" />;
    } else {
      const avatarStyle = {
        background: getAvatarColor(author.name),
        backgroundSize: '200% 200%',
        animation: 'gradientShift 3s ease-in-out infinite'
      };

      return (
        <div className="post-author-initials" style={avatarStyle}>
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

  const handleCommentToggle = () => {
    setShowComments(!showComments);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      const comment = {
        _id: `c${Date.now()}`,
        author: { name: 'Current User' }, // In a real app, this would be the logged-in user
        content: newComment.trim(),
        createdAt: new Date().toISOString()
      };
      setCommentList(prev => [...prev, comment]);
      setNewComment('');
    }
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
        <span>{commentList.length} Comments</span>
      </div>
      <div className="post-actions">
        <button onClick={handleLike} className={`action-btn ${isLiked ? 'liked' : ''}`}>
          {isLiked ? <FaHeart /> : <FaRegHeart />}
          Like
        </button>
        <button onClick={handleCommentToggle} className="action-btn">
          <FaCommentAlt />
          Comment
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="comments-section">
          <div className="comments-list">
            {commentList.map(comment => (
              <div key={comment._id} className="comment-item">
                <div className="comment-header">
                  <div className="comment-author-avatar">
                    {getUserInitials(comment.author.name)}
                  </div>
                  <div className="comment-author-info">
                    <span className="comment-author-name">{comment.author.name}</span>
                    <span className="comment-timestamp">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="comment-content">
                  <p>{comment.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Comment Input Form */}
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <div className="comment-input-container">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="comment-input"
                maxLength={200}
              />
              <button type="submit" className="comment-submit-btn" disabled={!newComment.trim()}>
                <FaPaperPlane />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostCard;