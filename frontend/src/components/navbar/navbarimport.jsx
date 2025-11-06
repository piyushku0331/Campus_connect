import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import PillNav from './PillNav';

const Navbar = () => {
  const location = useLocation();
  const { user, signOut } = useContext(AuthContext);

  const allNavLinks = [
    { name: 'Home', href: '/home' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Profile', href: '/profile' },
    { name: 'Events', href: '/events' },
    { name: 'Networking', href: '/networking' },
    { name: 'Resources', href: '/resources' },
    { name: 'Lost & Found', href: '/lostfound' },
    { name: 'Alumni', href: '/alumni' },
    { name: 'Support', href: '/support' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Logout', href: '/logout', action: 'logout' }
  ];

  const publicNavLinks = [
    { name: 'Home', href: '/home' },
    { name: 'Support', href: '/support' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Login', href: '/login' },
    { name: 'Register', href: '/signup' }
  ];

  const navLinks = user ? allNavLinks : publicNavLinks;

  const handleNavClick = async (link) => {
    if (link.action === 'logout') {
      await signOut();
      window.location.href = '/home';
    }
  };

  return (
    <PillNav
      logo="/image.png"
      logoAlt="Campus Connect Logo"
      items={navLinks.map(link => ({
        label: link.name,
        href: link.href,
        action: link.action,
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