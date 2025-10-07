import React from 'react';

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../assets/styles/pages/AnalyticsDashboardPage.css';

const statData = { users: 150, events: 25, placements: 45, posts: 300 };
const popularEventsData = [
    { name: 'Tech Fest', rsvpCount: 95 },
    { name: 'Hackathon', rsvpCount: 78 },
    { name: 'Alumni Meet', rsvpCount: 62 },
];

const AnalyticsDashboardPage = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Analytics Dashboard</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><h3>Total Users</h3><p>{statData.users}</p></div>
        <div className="stat-card"><h3>Total Events</h3><p>{statData.events}</p></div>
        <div className="stat-card"><h3>Placements</h3><p>{statData.placements}</p></div>
        <div className="stat-card"><h3>Posts</h3><p>{statData.posts}</p></div>
      </div>

      <div className="chart-container">
        <h2>Most Popular Events</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={popularEventsData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="rsvpCount" fill="#bb86fc" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsDashboardPage;