import React from 'react';
import '../../assets/styles/components/helpline/HelplineCard.css';


const HelplineCard = ({ contact }) => {
  return (
    <div className="helpline-card">
      <div className="helpline-card-header">
        <span className="helpline-category">{contact.category}</span>
        <h4>{contact.serviceName}</h4>
        {contact.contactPerson && <p className="contact-person">{contact.contactPerson}</p>}
      </div>
      <div className="helpline-card-body">
        <div className="contact-actions">
          <a href={`tel:${contact.phoneNumber}`} className="action-button call-btn">
           
            Call Now
          </a>
          {contact.email && (
            <a href={`mailto:${contact.email}`} className="action-button email-btn">
              {}
              Send Email
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelplineCard;