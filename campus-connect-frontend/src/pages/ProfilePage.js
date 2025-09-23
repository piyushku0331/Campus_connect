import React from 'react';
// This would be a component to display profile details
// import ProfileCard from '../components/profile/ProfileCard';

const ProfilePage = () => {
  // Mock User Data - Fetch this from API using user ID from URL params
  const user = {
    name: 'Alex Ray',
    campus: 'Main Campus',
    skills: ['React', 'Node.js', 'MongoDB'],
    interests: ['Coding', 'Music'],
    profilePicture: 'https://via.placeholder.com/150',
    isPublic: true,
  };

  return (
    <div className="page-container">
      <h1>User Profile</h1>
      {/* <ProfileCard user={user} /> */}
      <p>Profile details for {user.name} would go here.</p>
    </div>
  );
};

export default ProfilePage;