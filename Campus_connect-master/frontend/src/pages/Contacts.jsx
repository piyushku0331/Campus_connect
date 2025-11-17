import React, { useState } from 'react';
import { Search, Phone, Mail, MapPin, Clock, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
const Contacts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState({});
  const [copiedItem, setCopiedItem] = useState(null);
  const contacts = {
    administration: {
      title: 'Administration',
      icon: '🏛️',
      items: [
        {
          name: 'Director',
          person: 'Dr. Madhu Chitkara',
          phone: '+91-9876543210',
          email: 'director@chitkara.edu.in',
          location: 'Director\'s Office, Administrative Block',
          hours: 'Mon-Fri: 9:00 AM - 5:00 PM'
        },
        {
          name: 'Dean Academic Affairs',
          person: 'Dr. Rajesh Kumar',
          phone: '+91-9876543211',
          email: 'dean.academic@chitkara.edu.in',
          location: 'Academic Block, Room 101',
          hours: 'Mon-Fri: 9:00 AM - 5:00 PM'
        },
        {
          name: 'Registrar',
          person: 'Dr. Priya Sharma',
          phone: '+91-9876543212',
          email: 'registrar@chitkara.edu.in',
          location: 'Administrative Block, Ground Floor',
          hours: 'Mon-Fri: 9:00 AM - 5:00 PM'
        }
      ]
    },
    hostel: {
      title: 'Hostel Management',
      icon: '🏢',
      items: [
        {
          name: 'Hostel Warden (Boys)',
          person: 'Mr. Amit Singh',
          phone: '+91-9876543213',
          email: 'warden.boys@chitkara.edu.in',
          location: 'Boys Hostel Block A',
          hours: '24/7 Available'
        },
        {
          name: 'Hostel Warden (Girls)',
          person: 'Ms. Sunita Verma',
          phone: '+91-9876543214',
          email: 'warden.girls@chitkara.edu.in',
          location: 'Girls Hostel Block B',
          hours: '24/7 Available'
        },
        {
          name: 'Hostel Office',
          person: 'Hostel Administration',
          phone: '+91-9876543215',
          email: 'hostel@chitkara.edu.in',
          location: 'Hostel Reception',
          hours: 'Mon-Sun: 8:00 AM - 10:00 PM'
        }
      ]
    },
    departments: {
      title: 'Department Heads',
      icon: '🎓',
      items: [
        {
          name: 'Computer Science & Engineering',
          person: 'Dr. Ankit Gupta',
          phone: '+91-9876543216',
          email: 'hod.cse@chitkara.edu.in',
          location: 'CSE Block, Room 201',
          hours: 'Mon-Fri: 9:00 AM - 5:00 PM'
        },
        {
          name: 'Electronics & Communication',
          person: 'Dr. Rahul Kumar',
          phone: '+91-9876543217',
          email: 'hod.ece@chitkara.edu.in',
          location: 'ECE Block, Room 101',
          hours: 'Mon-Fri: 9:00 AM - 5:00 PM'
        },
        {
          name: 'Mechanical Engineering',
          person: 'Dr. Vikram Singh',
          phone: '+91-9876543218',
          email: 'hod.me@chitkara.edu.in',
          location: 'Mechanical Block, Room 301',
          hours: 'Mon-Fri: 9:00 AM - 5:00 PM'
        },
        {
          name: 'Business Administration',
          person: 'Dr. Meera Patel',
          phone: '+91-9876543219',
          email: 'hod.ba@chitkara.edu.in',
          location: 'Management Block, Room 401',
          hours: 'Mon-Fri: 9:00 AM - 5:00 PM'
        }
      ]
    },
    it: {
      title: 'IT Helpdesk',
      icon: '💻',
      items: [
        {
          name: 'IT Support',
          person: 'IT Helpdesk Team',
          phone: '+91-9876543220',
          email: 'it.helpdesk@chitkara.edu.in',
          location: 'IT Center, Ground Floor',
          hours: 'Mon-Fri: 8:00 AM - 8:00 PM, Sat: 9:00 AM - 5:00 PM'
        },
        {
          name: 'Network Administrator',
          person: 'Mr. Karan Jain',
          phone: '+91-9876543221',
          email: 'network.admin@chitkara.edu.in',
          location: 'Server Room, Basement',
          hours: 'Mon-Fri: 9:00 AM - 6:00 PM'
        },
        {
          name: 'Student Portal Support',
          person: 'Portal Support Team',
          phone: '+91-9876543222',
          email: 'portal.support@chitkara.edu.in',
          location: 'IT Center',
          hours: 'Mon-Fri: 9:00 AM - 5:00 PM'
        }
      ]
    },
    medical: {
      title: 'Medical Services',
      icon: '🏥',
      items: [
        {
          name: 'Campus Doctor',
          person: 'Dr. Neha Agarwal',
          phone: '+91-9876543223',
          email: 'doctor@chitkara.edu.in',
          location: 'Medical Center, Near Hostel',
          hours: 'Mon-Fri: 9:00 AM - 5:00 PM, Emergency: 24/7'
        },
        {
          name: 'Medical Emergency',
          person: 'Emergency Services',
          phone: '108',
          email: 'emergency@chitkara.edu.in',
          location: 'Medical Center',
          hours: '24/7 Available'
        }
      ]
    },
    security: {
      title: 'Security',
      icon: '🛡️',
      items: [
        {
          name: 'Security Control Room',
          person: 'Security Team',
          phone: '+91-9876543224',
          email: 'security@chitkara.edu.in',
          location: 'Main Gate Security Office',
          hours: '24/7 Available'
        },
        {
          name: 'Campus Safety Officer',
          person: 'Mr. Rajesh Sharma',
          phone: '+91-9876543225',
          email: 'safety.officer@chitkara.edu.in',
          location: 'Security Office',
          hours: 'Mon-Fri: 9:00 AM - 6:00 PM'
        }
      ]
    }
  };
  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };
  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(`${type}-${text}`);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };
  const filteredContacts = Object.entries(contacts).reduce((acc, [key, section]) => {
    const filteredItems = section.items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.person.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filteredItems.length > 0) {
      acc[key] = { ...section, items: filteredItems };
    }
    return acc;
  }, {});
  return (
    <div className="max-w-6xl mx-auto p-6 animate-fade-in">
      {}
      <div className="text-center mb-8 animate-slide-down">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">University Contacts</h1>
        <p className="text-gray-600 dark:text-gray-400">Find contact information for all university services and departments</p>
      </div>
      {}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-lg animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search contacts by name, department, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
      {}
      <div className="space-y-6">
        {Object.entries(filteredContacts).map(([key, section], index) => (
          <div key={key} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden animate-slide-up card-hover" style={{ animationDelay: `${index * 0.1}s` }}>
            <button
              onClick={() => toggleSection(key)}
              className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{section.icon}</span>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{section.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{section.items.length} contacts</p>
                </div>
              </div>
              {expandedSections[key] ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
            {expandedSections[key] && (
              <div className="border-t border-gray-200 dark:border-gray-700">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {section.items.map((item, index) => (
                    <div key={index} className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{item.name}</h4>
                          <p className="text-gray-600 dark:text-gray-400 mb-3">{item.person}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                              <Phone size={16} className="text-gray-400" />
                              <span className="text-gray-700 dark:text-gray-300">{item.phone}</span>
                              <button
                                onClick={() => copyToClipboard(item.phone, 'phone')}
                                className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                              >
                                {copiedItem === `phone-${item.phone}` ? (
                                  <Check size={14} className="text-green-500" />
                                ) : (
                                  <Copy size={14} className="text-gray-400" />
                                )}
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail size={16} className="text-gray-400" />
                              <span className="text-gray-700 dark:text-gray-300">{item.email}</span>
                              <button
                                onClick={() => copyToClipboard(item.email, 'email')}
                                className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                              >
                                {copiedItem === `email-${item.email}` ? (
                                  <Check size={14} className="text-green-500" />
                                ) : (
                                  <Copy size={14} className="text-gray-400" />
                                )}
                              </button>
                            </div>
                            <div className="flex items-center gap-2 md:col-span-2">
                              <MapPin size={16} className="text-gray-400" />
                              <span className="text-gray-700 dark:text-gray-300">{item.location}</span>
                            </div>
                            <div className="flex items-center gap-2 md:col-span-2">
                              <Clock size={16} className="text-gray-400" />
                              <span className="text-gray-700 dark:text-gray-300">{item.hours}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <a
                            href={`tel:${item.phone}`}
                            className="btn-primary flex items-center gap-2"
                          >
                            <Phone size={16} />
                            Call
                          </a>
                          <a
                            href={`mailto:${item.email}`}
                            className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                          >
                            <Mail size={16} />
                            Email
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {Object.keys(filteredContacts).length === 0 && (
        <div className="text-center py-12">
          <Search size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No contacts found</h3>
          <p className="text-gray-600 dark:text-gray-400">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );
};
export default Contacts;
