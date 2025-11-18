import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import PillNav from './PillNav';

const Navbar = () => {
  const location = useLocation();
  const { user, signOut } = useContext(AuthContext);

  const servicesDropdown = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Feed', href: '/feed' },
    { label: 'News', href: '/news' },
    { label: 'Blog', href: '/blog' },
    { label: 'Profile', href: '/profile' },
    { label: 'Lost & Found', href: '/lostfound' },
    { label: 'Resources', href: '/resources' },
    { label: 'Events', href: '/events' },
    { label: 'Networking', href: '/networking' },
    { label: 'Alumni', href: '/alumni' }
  ];

  const allNavLinks = [
    { label: 'Home', href: '/home' },
    { label: 'Services', href: '#', dropdown: servicesDropdown },
    { label: 'Support', href: '/support' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Logout', href: '/logout', action: 'logout' }
  ];

  const publicNavLinks = [
    { label: 'Home', href: '/home' },
    { label: 'Support', href: '/support' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Login', href: '/login' },
    { label: 'Register', href: '/signup' }
  ];

  const navLinks = user ? allNavLinks : publicNavLinks;

  const handleNavClick = async (link) => {
    if (link.action === 'logout') {
      await signOut();
    }
  };

  return (
    <PillNav
      logo="/image.png"
      logoAlt="Campus Connect Logo"
      items={navLinks.map(link => ({
        label: link.label,
        href: link.href,
        action: link.action,
        dropdown: link.dropdown,
        onClick: link.action === 'logout' ? () => handleNavClick(link) : undefined
      }))}
      activeHref={location.pathname}
      baseColor="#0A0A0F"
      pillColor="#0A0A0F"
      hoveredPillTextColor="#F8FAFC"
      pillTextColor="#F8FAFC"
      className="custom-navbar"
    />
  );
};

export default Navbar;