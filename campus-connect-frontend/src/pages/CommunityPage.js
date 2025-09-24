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
    // For now, we'll use the mock data.
    const mockPosts = [
      {
        _id: '1',
        author: { name: 'Jane Doe' },
        content: 'Excited for the upcoming hackathon! Who is participating?',
        likes: [],
        comments: [
          {
            _id: 'c1',
            author: { name: 'John Smith' },
            content: 'Count me in! I\'m bringing my laptop and energy drinks.',
            createdAt: '2025-08-20T10:15:00Z'
          },
          {
            _id: 'c2',
            author: { name: 'Alice Johnson' },
            content: 'Me too! What time does it start?',
            createdAt: '2025-08-20T10:30:00Z'
          }
        ],
        createdAt: '2025-08-20T10:00:00Z'
      },
      {
        _id: '2',
        author: { name: 'John Smith' },
        content: 'Anyone have notes for the CS305 final exam?',
        likes: [],
        comments: [
          {
            _id: 'c3',
            author: { name: 'Sarah Chen' },
            content: 'I have detailed notes on data structures. DM me if you need them!',
            createdAt: '2025-08-19T16:00:00Z'
          }
        ],
        createdAt: '2025-08-19T15:30:00Z'
      },
      {
        _id: '3',
        author: { name: 'Alice Johnson' },
        content: 'Great session on machine learning today! The professor explained neural networks really well.',
        likes: [],
        comments: [
          {
            _id: 'c4',
            author: { name: 'Mike Rodriguez' },
            content: 'Totally agree! The visualization of backpropagation was amazing.',
            createdAt: '2025-08-18T15:00:00Z'
          },
          {
            _id: 'c5',
            author: { name: 'David Kumar' },
            content: 'Can you share the slides? I missed the first 15 minutes.',
            createdAt: '2025-08-18T15:30:00Z'
          }
        ],
        createdAt: '2025-08-18T14:20:00Z'
      },
      {
        _id: '4',
        author: { name: 'Bob Wilson' },
        content: 'Looking for study partners for the upcoming semester. Anyone interested in forming a group?',
        likes: [],
        comments: [
          {
            _id: 'c6',
            author: { name: 'Emily Davis' },
            content: 'I\'m interested! What subjects are you planning to cover?',
            createdAt: '2025-08-17T10:00:00Z'
          }
        ],
        createdAt: '2025-08-17T09:15:00Z'
      },
      {
        _id: '5',
        author: { name: 'Sarah Chen' },
        content: 'Just finished my first React project! The component lifecycle is fascinating.',
        likes: [],
        comments: [
          {
            _id: 'c7',
            author: { name: 'Jane Doe' },
            content: 'Congrats! React hooks are game-changing. What did you build?',
            createdAt: '2025-08-16T12:30:00Z'
          },
          {
            _id: 'c8',
            author: { name: 'Bob Wilson' },
            content: 'Awesome! Can you share some tips for beginners?',
            createdAt: '2025-08-16T13:00:00Z'
          }
        ],
        createdAt: '2025-08-16T11:45:00Z'
      },
      {
        _id: '6',
        author: { name: 'Mike Rodriguez' },
        content: 'Coffee and algorithms - perfect combination for a productive morning! ☕💻',
        likes: [],
        comments: [
          {
            _id: 'c9',
            author: { name: 'Alice Johnson' },
            content: 'Couldn\'t agree more! Nothing beats that morning algorithm session.',
            createdAt: '2025-08-15T09:00:00Z'
          }
        ],
        createdAt: '2025-08-15T08:30:00Z'
      },
      {
        _id: '7',
        author: { name: 'Emily Davis' },
        content: 'Question about database normalization - can someone explain the differences between 1NF, 2NF, and 3NF?',
        likes: [],
        comments: [
          {
            _id: 'c10',
            author: { name: 'David Kumar' },
            content: '1NF: No repeating groups. 2NF: 1NF + no partial dependencies. 3NF: 2NF + no transitive dependencies.',
            createdAt: '2025-08-14T17:00:00Z'
          },
          {
            _id: 'c11',
            author: { name: 'Sarah Chen' },
            content: 'Great explanation! Also check out the concept of BCNF for complete understanding.',
            createdAt: '2025-08-14T17:30:00Z'
          }
        ],
        createdAt: '2025-08-14T16:20:00Z'
      },
      {
        _id: '8',
        author: { name: 'David Kumar' },
        content: 'Attending the AI workshop tomorrow. The speaker is from Google - should be amazing!',
        likes: [],
        comments: [
          {
            _id: 'c12',
            author: { name: 'Mike Rodriguez' },
            content: 'Lucky you! I heard the speaker is working on Gemini models.',
            createdAt: '2025-08-13T14:00:00Z'
          },
          {
            _id: 'c13',
            author: { name: 'Emily Davis' },
            content: 'Take notes for those of us who can\'t attend! 📝',
            createdAt: '2025-08-13T14:30:00Z'
          }
        ],
        createdAt: '2025-08-13T13:10:00Z'
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