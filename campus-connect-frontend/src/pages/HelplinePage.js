import React from 'react';
import HelplineCard from '../components/helpline/HelplineCard';
import '../assets/styles/pages/HelplinePage.css';

const HelplinePage = () => {
  // Mock data - replace with API call
  const contacts = [
    { _id: 1, serviceName: 'Campus Clinic', phoneNumber: '123-456-7890', email: 'clinic@campus.com', category: 'Medical' },
    { _id: 2, serviceName: 'Main Gate Security', phoneNumber: '987-654-3210', category: 'Security' },
    { _id: 3, serviceName: 'Night Shuttle Service', phoneNumber: '555-123-4567', category: 'Transport' },
    { _id: 4, serviceName: 'Student Affairs Office', contactPerson: 'John Doe', phoneNumber: '111-222-3333', email: 'affairs@campus.com', category: 'General' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Campus Helpline Directory</h1>
        <p>Quick access to essential campus services.</p>
      </div>
      <div className="helpline-grid">
        {contacts.map(contact => <HelplineCard key={contact._id} contact={contact} />)}
      </div>
    </div>
  );
};

export default HelplinePage;