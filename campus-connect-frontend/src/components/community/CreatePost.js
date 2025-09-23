import React, { useState } from 'react';
import '../../assets/styles/components/community/CreatePost.css';

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) {
      alert('Post cannot be empty!');
      return;
    }

    // In a real application, you would make an API call here.
    // For now, we'll simulate it and pass the new post data to the parent.
    const newPost = {
      _id: Date.now().toString(), // temporary unique ID
      author: { name: 'Current User', profilePicture: 'https://via.placeholder.com/50' }, // Replace with actual logged-in user data
      content: content,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
    };

    onPostCreated(newPost);
    setContent(''); // Clear the textarea after posting
  };

  return (
    <div className="create-post-container">
      <form onSubmit={handleSubmit} className="create-post-form">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          rows="4"
        />
        <button type="submit" className="btn-post">Post</button>
      </form>
    </div>
  );
};

export default CreatePost;