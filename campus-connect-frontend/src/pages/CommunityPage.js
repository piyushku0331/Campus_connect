import React, { useState, useEffect } from 'react';
// Import the new, structured components
import CreatePost from '../components/community/CreatePost';
import PostList from '../components/community/PostList';
import '../assets/styles/pages/CommunityPage.css'; // Make sure this CSS file exists and styles .page-container if needed

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // This effect simulates fetching initial posts from an API when the component mounts.
  useEffect(() => {
    // In a real application, you would make an API call like this:
    // fetch('/api/posts')
    //   .then(res => res.json())
    //   .then(data => {
    //     setPosts(data);
    //     setLoading(false);
    //   })
    //   .catch(err => console.error("Failed to fetch posts:", err));

    // For now, we'll use the mock data.
    const mockPosts = [
      {
        _id: '1',
        author: { name: 'Jane Doe', profilePicture: 'https://via.placeholder.com/50' },
        content: 'Excited for the upcoming hackathon! Who is participating?',
        likes: [],
        comments: [],
        createdAt: '2025-08-20T10:00:00Z' // Added timestamp for PostCard
      },
      {
        _id: '2',
        author: { name: 'John Smith', profilePicture: 'https://via.placeholder.com/50' },
        content: 'Anyone have notes for the CS305 final exam?',
        likes: [],
        comments: [],
        createdAt: '2025-08-19T15:30:00Z' // Added timestamp for PostCard
      },
    ];
    
    setPosts(mockPosts);
    setLoading(false);
  }, []); // The empty dependency array ensures this runs only once on mount.

  // This function is passed to the CreatePost component.
  // It adds the newly created post to the top of our posts list.
  const handlePostCreated = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  return (
    // It's good practice to use a consistent container class for pages.
    <div className="page-container"> 
      <div className="page-header">
        <h1>Community Wall</h1>
      </div>
      
      {/* The CreatePost component handles the form for new posts */}
      <CreatePost onPostCreated={handlePostCreated} />

      {/* The PostList component handles the rendering of the post feed */}
      {loading ? <p>Loading posts...</p> : <PostList posts={posts} />}
    </div>
  );
};

export default CommunityPage;