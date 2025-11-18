import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import PropTypes from 'prop-types';

/**
 * PillNav - A modern, animated navigation component with pill-style buttons and dropdowns
 * Features 3D hover effects, smooth animations, and responsive design
 */
const PillNav = ({
  logo,
  logoAlt = 'Logo',
  items = [],
  className = '',
  ease = 'power3.easeOut',
  baseColor = '#fff',
  pillColor = '#060010',
  hoveredPillTextColor = '#060010',
  pillTextColor,
  onMobileMenuClick,
  initialLoadAnimation = true
}) => {
  // Resolve pill text color
  const resolvedPillTextColor = pillTextColor ?? baseColor;

  // State management
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState(null);

  // Refs for animations and DOM elements
  const circleRefs = useRef([]);
  const tlRefs = useRef([]);
  const activeTweenRefs = useRef([]);
  const dropdownRefs = useRef([]);
  const pillRefs = useRef([]);
  const logoImgRef = useRef(null);
  const logoTweenRef = useRef(null);
  const hamburgerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navItemsRef = useRef(null);
  const logoRef = useRef(null);
  const navRef = useRef(null);

  // Get current location for active route highlighting
  const location = useLocation();
  const currentPath = location.pathname;

  // CSS custom properties for theming
  const cssVars = useMemo(() => ({
    ['--base']: baseColor,
    ['--pill-bg']: pillColor,
    ['--hover-text']: hoveredPillTextColor,
    ['--pill-text']: resolvedPillTextColor,
    ['--nav-h']: '48px',
    ['--logo']: '44px',
    ['--pill-pad-x']: '18px',
    ['--pill-gap']: '3px'
  }), [baseColor, pillColor, hoveredPillTextColor, resolvedPillTextColor]);

  // Ensure items is always an array
  const safeItems = useMemo(() => Array.isArray(items) ? items : [], [items]);

  /**
   * Determines if a href is an external link (not a router link)
   */
  const isExternalLink = useCallback((href) =>
    href && (
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('//') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('#')
    ), []
  );

  /**
   * Determines if a href should use React Router Link
   */
  const isRouterLink = useCallback((href) => href && !isExternalLink(href), [isExternalLink]);

  /**
   * Handles dropdown toggle - ensures only one dropdown is open at a time
   */
  const handleDropdownToggle = useCallback((identifier, isMobile = false) => {
    if (isMobile) {
      setMobileActiveDropdown(prev => {
        const newState = prev === identifier ? null : identifier;
        return newState;
      });
    } else {
      setActiveDropdown(prev => {
        const newState = prev === identifier ? null : identifier;
        return newState;
      });
    }
  }, []);

  /**
   * Closes all dropdowns and mobile menu
   */
  const closeAllMenus = useCallback(() => {
    setActiveDropdown(null);
    setMobileActiveDropdown(null);
    setIsMobileMenuOpen(false);
  }, []);

  /**
   * Handles outside click to close dropdowns
   */
  const handleClickOutside = useCallback((event) => {
    const pillNav = document.querySelector('.pill-nav');
    // If click is inside the original nav container, do nothing
    if (pillNav && pillNav.contains(event.target)) return;

    // If click is inside any portal dropdown or pill button, do nothing
    if (dropdownRefs.current.some(d => d && d.contains && d.contains(event.target))) return;
    if (pillRefs.current.some(p => p && p.contains && p.contains(event.target))) return;

    // Otherwise close menus
    closeAllMenus();
  }, [closeAllMenus]);

  /**
   * Handles navigation events to close menus
   */
  const handleNavigation = useCallback(() => {
    closeAllMenus();
  }, [closeAllMenus]);

  /**
   * Sets up event listeners for outside clicks and navigation
   */
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    window.addEventListener('popstate', handleNavigation);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('popstate', handleNavigation);
    };
  }, [handleClickOutside, handleNavigation]);

  /**
   * Close dropdowns on route change
   */
  useEffect(() => {
    closeAllMenus();
  }, [location, closeAllMenus]);

  /**
   * Animate dropdowns on state change
   */
  useEffect(() => {
    const positionDropdown = (index) => {
      const btn = pillRefs.current[index];
      const dropdown = dropdownRefs.current[index];
      if (!btn || !dropdown || typeof window === 'undefined') return;
      const rect = btn.getBoundingClientRect();
      dropdown.style.position = 'absolute';
      dropdown.style.top = `${rect.bottom + window.scrollY + 8}px`;
      dropdown.style.left = `${rect.left + rect.width / 2 + window.scrollX}px`;
      dropdown.style.transform = 'translateX(-50%)';
    };

    const handleScrollResize = () => {
      dropdownRefs.current.forEach((dropdown, index) => {
        const item = safeItems[index + 1];
        const isActive = activeDropdown === item?.label;
        if (isActive) positionDropdown(index);
      });
    };

    dropdownRefs.current.forEach((dropdown, index) => {
      if (!dropdown) return;
      const item = safeItems[index + 1];
      const isActive = activeDropdown === item?.label;
      if (isActive) {
        positionDropdown(index);
        gsap.set(dropdown, { display: 'block', opacity: 0, y: -10 });
        gsap.to(dropdown, { opacity: 1, y: 0, duration: 0.3, ease });
      } else {
        gsap.set(dropdown, { display: 'none', opacity: 0 });
      }
    });

    window.addEventListener('scroll', handleScrollResize, { passive: true });
    window.addEventListener('resize', handleScrollResize);

    return () => {
      window.removeEventListener('scroll', handleScrollResize);
      window.removeEventListener('resize', handleScrollResize);
    };
  }, [activeDropdown, safeItems, ease]);

  /**
   * Handles pill hover enter animation
   */
  const handlePillEnter = useCallback((index) => {
    const tl = tlRefs.current[index];
    if (!tl || !circleRefs.current[index]) return;

    // Kill any existing animation
    if (activeTweenRefs.current[index] && activeTweenRefs.current[index].isActive()) {
      activeTweenRefs.current[index].kill();
    }

    // Animate to hover state
    activeTweenRefs.current[index] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: 'auto'
    });
  }, [ease]);

  /**
   * Handles pill hover leave animation
   */
  const handlePillLeave = useCallback((index) => {
    const tl = tlRefs.current[index];
    if (!tl || !circleRefs.current[index]) return;

    // Kill any existing animation
    if (activeTweenRefs.current[index] && activeTweenRefs.current[index].isActive()) {
      activeTweenRefs.current[index].kill();
    }

    // Animate back to initial state
    activeTweenRefs.current[index] = tl.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: 'auto'
    });
  }, [ease]);

  /**
   * Handles logo hover animation
   */
  const handleLogoEnter = useCallback(() => {
    const img = logoImgRef.current;
    if (!img) return;

    // Kill existing animation
    if (logoTweenRef.current) {
      logoTweenRef.current.kill();
    }

    // Reset rotation and animate
    gsap.set(img, { rotate: 0 });
    logoTweenRef.current = gsap.to(img, {
      rotate: 360,
      duration: 0.2,
      ease,
      overwrite: 'auto'
    });
  }, [ease]);

  /**
   * Toggles mobile menu with smooth animations
   */
  const toggleMobileMenu = useCallback(() => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);

    const hamburger = hamburgerRef.current;
    const menu = mobileMenuRef.current;

    // Animate hamburger icon
    if (hamburger) {
      const lines = hamburger.querySelectorAll('.hamburger-line');
      if (newState) {
        gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease });
      } else {
        gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease });
      }
    }

    // Animate mobile menu
    if (menu) {
      if (newState) {
        gsap.set(menu, { visibility: 'visible' });
        gsap.fromTo(
          menu,
          { opacity: 0, y: 10, scaleY: 1 },
          {
            opacity: 1,
            y: 0,
            scaleY: 1,
            duration: 0.3,
            ease,
            transformOrigin: 'top center'
          }
        );
      } else {
        gsap.to(menu, {
          opacity: 0,
          y: 10,
          scaleY: 1,
          duration: 0.2,
          ease,
          transformOrigin: 'top center',
          onComplete: () => {
            gsap.set(menu, { visibility: 'hidden' });
          }
        });
      }
    }

    onMobileMenuClick?.();
  }, [isMobileMenuOpen, ease, onMobileMenuClick]);

  /**
   * Handles keyboard navigation for mobile menu
   */
  const handleMobileMenuKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      closeAllMenus();
    }
  }, [closeAllMenus]);

  /**
   * Sets up pill animations and layout calculations
   */
  useEffect(() => {
    const currentTlRefs = tlRefs.current;
    const currentActiveTweenRefs = activeTweenRefs.current;
    const currentLogoTweenRef = logoTweenRef.current;

    const setupAnimations = () => {
      circleRefs.current.forEach((circle, index) => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;

        // Calculate circle dimensions for 3D effect
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        // Set circle styles
        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`
        });

        // Set label positions
        const label = pill.querySelector('.pill-label');
        const white = pill.querySelector('.pill-label-hover');

        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        // Kill existing timeline
        if (tlRefs.current[index]) {
          tlRefs.current[index].kill();
        }

        // Create new timeline for hover animation
        const tl = gsap.timeline({ paused: true });

        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0);

        if (label) {
          tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0);
        }

        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(white, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0);
        }

        tlRefs.current[index] = tl;
      });
    };

    // Initial setup
    setupAnimations();

    // Setup mobile menu initial state
    const menu = mobileMenuRef.current;
    if (menu) {
      gsap.set(menu, { visibility: 'hidden', opacity: 0, scaleY: 1, y: 0 });
    }

    // Initial load animation
    if (initialLoadAnimation) {
      const logo = logoRef.current;
      const navItems = navItemsRef.current;

      if (logo) {
        gsap.set(logo, { scale: 0 });
        gsap.to(logo, {
          scale: 1,
          duration: 0.6,
          ease
        });
      }

      if (navItems) {
        gsap.set(navItems, { width: 0, overflow: 'hidden' });
        gsap.to(navItems, {
          width: 'auto',
          duration: 0.6,
          ease
        });
      }
    }

    // Handle resize
    const handleResize = () => setupAnimations();
    window.addEventListener('resize', handleResize);

    // Handle font loading
    if (document.fonts?.ready) {
      document.fonts.ready.then(setupAnimations).catch(() => {});
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      // Cleanup all GSAP animations
      currentTlRefs.forEach(tl => tl?.kill());
      currentActiveTweenRefs.forEach(tween => tween?.kill());
      if (currentLogoTweenRef) {
        currentLogoTweenRef.kill();
      }
    };
  }, [items, ease, initialLoadAnimation]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    const currentTlRefs = tlRefs.current;
    const currentActiveTweenRefs = activeTweenRefs.current;
    const currentLogoTweenRef = logoTweenRef.current;

    return () => {
      // Kill all animations
      currentTlRefs.forEach(tl => tl?.kill());
      currentActiveTweenRefs.forEach(tween => tween?.kill());
      if (currentLogoTweenRef) {
        currentLogoTweenRef.kill();
      }
    };
  }, []);

  return (
    <div className="pill-nav perspective-root absolute top-[1em] z-[1000] left-1/2 transform -translate-x-1/2">
      <nav
        ref={navRef}
        className={`w-10 h-10 rounded-full object-cover mr-4 md:w-max flex items-center justify-between md:justify-start box-border px-4 md:px-0 relative overflow-visible ${className}`}
        aria-label="Main navigation"
        style={cssVars}
      >
        {/* Logo */}
        {safeItems.length > 0 && (
          isRouterLink(safeItems[0]?.href) ? (
            <Link
              to={safeItems[0].href}
              aria-label="Home"
              onMouseEnter={handleLogoEnter}
              role="menuitem"
              ref={logoRef}
              className="rounded-full p-2 inline-flex items-center justify-center overflow-hidden hover:shadow-lg hover:transform hover:scale-105 transition-all duration-300"
              style={{
                width: 'var(--nav-h)',
                height: 'var(--nav-h)',
                background: 'var(--base, #000)'
              }}
            >
              <img src={logo} alt={logoAlt} ref={logoImgRef} loading="lazy" className="w-full h-full rounded-full object-cover block" />
            </Link>
          ) : (
            <a
              href={safeItems[0]?.href || '#'}
              aria-label="Home"
              onMouseEnter={handleLogoEnter}
              ref={logoRef}
              className="rounded-full p-2 inline-flex items-center justify-center overflow-hidden hover:shadow-lg hover:transform hover:scale-105 transition-all duration-300"
              style={{
                width: 'var(--nav-h)',
                height: 'var(--nav-h)',
                background: 'var(--base, #000)'
              }}
              {...(isExternalLink(safeItems[0]?.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <img src={logo} alt={logoAlt} ref={logoImgRef} loading="lazy" className="w-full h-full rounded-full object-cover block" />
            </a>
          )
        )}

        {/* Desktop Navigation */}
        <div
          ref={navItemsRef}
          className="relative items-center rounded-full hidden md:flex ml-2"
          style={{
            height: 'var(--nav-h)',
            background: 'var(--base, #000)'
          }}
        >
          <ul
            role="menubar"
            className="list-none flex items-stretch m-0 p-[3px] h-full"
            style={{ gap: 'var(--pill-gap)' }}
          >
            {safeItems.slice(1).map((item, i) => {
              const isActive = currentPath === item.href;
              const hasDropdown = item.dropdown && Array.isArray(item.dropdown) && item.dropdown.length > 0;
              const isDropdownActive = activeDropdown === item.label;

              const pillStyle = {
                background: 'var(--pill-bg, #fff)',
                color: 'var(--pill-text, var(--base, #000))',
                paddingLeft: 'var(--pill-pad-x)',
                paddingRight: hasDropdown ? 'calc(var(--pill-pad-x) + 20px)' : 'var(--pill-pad-x)',
                boxShadow: '0 0 20px rgba(79, 70, 229, 0.12), 0 0 40px rgba(124, 58, 237, 0.08), 0 4px 12px rgba(0, 0, 0, 0.15)'
              };

              const PillContent = (
                <>
                  {!hasDropdown && (
                    <span
                      className="hover-circle absolute left-1/2 bottom-0 rounded-full z-[1] block pointer-events-none"
                      style={{
                        background: 'var(--base, #000)',
                        willChange: 'transform'
                      }}
                      aria-hidden="true"
                      ref={el => {
                        circleRefs.current[i] = el;
                      }}
                    />
                  )}
                  <span className="label-stack relative inline-block leading-[1] z-[2]" style={{ pointerEvents: 'none' }}>
                    <span
                      className="pill-label relative z-[2] inline-block leading-[1]"
                      style={{ willChange: 'transform', pointerEvents: 'none' }}
                    >
                      {item.label}
                    </span>
                    <span
                      className="pill-label-hover absolute left-0 top-0 z-[3] inline-block"
                      style={{
                        color: 'var(--hover-text, #fff)',
                        willChange: 'transform, opacity',
                        pointerEvents: 'none'
                      }}
                      aria-hidden="true"
                    >
                      {item.label}
                    </span>
                  </span>
                  {hasDropdown && (
                    <span className="ml-1 text-xs z-[2] relative" style={{ pointerEvents: 'none' }}>
                      ▼
                    </span>
                  )}
                  {isActive && (
                    <span
                      className="absolute left-1/2 -bottom-[6px] -translate-x-1/2 w-3 h-3 rounded-full z-[4]"
                      style={{ background: 'var(--base, #000)' }}
                      aria-hidden="true"
                    />
                  )}
                </>
              );

              const basePillClasses =
                'interactive-3d relative overflow-hidden inline-flex items-center justify-center h-full no-underline rounded-full box-border font-semibold text-[16px] leading-[0] uppercase tracking-[0.2px] whitespace-nowrap cursor-pointer px-0 hover:shadow-lg hover:transform hover:-translate-y-0.5 transition-all duration-300';

              return (
                <li key={item.href || i} role="none" className="flex h-full">
                  {hasDropdown ? (
                      <div className="relative">
                        <button
                          className={basePillClasses}
                          style={pillStyle}
                          aria-label={item.ariaLabel || item.label}
                          aria-expanded={isDropdownActive}
                          aria-haspopup="true"
                          role="button"
                          tabIndex={0}
                          onClick={(e) => { e.stopPropagation(); handleDropdownToggle(item.label); }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleDropdownToggle(item.label);
                            }
                          }}
                          ref={el => { pillRefs.current[i] = el; }}
                        >
                          {PillContent}
                        </button>
                        {isDropdownActive && (() => {
                          // Compute portal position based on the pill's bounding rect
                          const btn = pillRefs.current[i];
                          let portalStyle = {
                            position: 'absolute',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            minWidth: '200px',
                            zIndex: 3000
                          };
                          if (btn && typeof window !== 'undefined') {
                            const rect = btn.getBoundingClientRect();
                            portalStyle = {
                              position: 'absolute',
                              top: `${rect.bottom + window.scrollY + 8}px`,
                              left: `${rect.left + rect.width / 2 + window.scrollX}px`,
                              transform: 'translateX(-50%)',
                              minWidth: '200px',
                              zIndex: 3000
                            };
                          }

                          return createPortal(
                            <div
                              className="glass-card card-3d tilt-3d rounded-lg shadow-2xl py-2 opacity-0"
                              style={{
                                ...portalStyle,
                                background: cssVars['--base'] ? cssVars['--base'] + 'CC' : 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 40px rgba(79, 70, 229, 0.1)'
                              }}
                              ref={el => { dropdownRefs.current[i] = el; }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {item.dropdown.map((dropdownItem, dropdownIndex) => {
                                const isDropdownItemActive = currentPath === dropdownItem.href;
                                return (
                                  <Link
                                    key={dropdownItem.href || dropdownIndex}
                                    to={dropdownItem.href}
                                    className={
                                      `block px-4 py-2 text-sm transition-all duration-200 rounded-lg mx-2 my-1 font-medium ` +
                                      (isDropdownItemActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-800 hover:bg-indigo-50 hover:text-indigo-600')
                                    }
                                    aria-current={isDropdownItemActive ? 'page' : undefined}
                                    onClick={closeAllMenus}
                                  >
                                    {dropdownItem.label}
                                  </Link>
                                );
                              })}
                            </div>,
                            document.body
                          );
                        })()}
                      </div>
                    ) : isRouterLink(item.href) ? (
                    <Link
                      role="menuitem"
                      to={item.href}
                      className={basePillClasses}
                      style={pillStyle}
                      aria-label={item.ariaLabel || item.label}
                      aria-current={isActive ? 'page' : undefined}
                      onMouseEnter={() => handlePillEnter(i)}
                      onMouseLeave={() => handlePillLeave(i)}
                      onClick={(e) => {
                        item.onClick?.(e);
                        closeAllMenus();
                      }}
                    >
                      {PillContent}
                    </Link>
                  ) : (
                    <a
                      role="menuitem"
                      href={item.href}
                      {...(isExternalLink(item.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className={basePillClasses}
                      style={pillStyle}
                      aria-label={item.ariaLabel || item.label}
                      aria-current={isActive ? 'page' : undefined}
                      onMouseEnter={() => handlePillEnter(i)}
                      onMouseLeave={() => handlePillLeave(i)}
                      onClick={(e) => {
                        item.onClick?.(e);
                        closeAllMenus();
                      }}
                    >
                      {PillContent}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Mobile Menu Button */}
        <button
          ref={hamburgerRef}
          onClick={toggleMobileMenu}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleMobileMenu();
            }
          }}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          className="md:hidden rounded-full border-0 flex flex-col items-center justify-center gap-1 cursor-pointer p-0 relative hover:shadow-lg hover:transform hover:scale-105 transition-all duration-300"
          style={{
            width: 'var(--nav-h)',
            height: 'var(--nav-h)',
            background: 'var(--base, #000)'
          }}
        >
          <span
            className="hamburger-line w-4 h-0.5 rounded origin-center transition-all duration-[10ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]"
            style={{ background: 'var(--pill-bg, #fff)' }}
          />
          <span
            className="hamburger-line w-4 h-0.5 rounded origin-center transition-all duration-[10ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]"
            style={{ background: 'var(--pill-bg, #fff)' }}
          />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        onKeyDown={handleMobileMenuKeyDown}
        className="md:hidden absolute top-[3em] left-4 right-4 rounded-[27px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] z-[998] origin-top"
        style={{
          ...cssVars,
          background: 'var(--base, #f0f0f0)'
        }}
      >
        <ul className="list-none m-0 p-[3px] flex flex-col gap-[3px]">
          {safeItems.slice(1).map((item, index) => {
            const defaultStyle = {
              background: 'var(--pill-bg, #fff)',
              color: 'var(--pill-text, #fff)'
            };
            const hoverIn = e => {
              e.currentTarget.style.background = 'var(--base)';
              e.currentTarget.style.color = 'var(--hover-text, #fff)';
            };
            const hoverOut = e => {
              e.currentTarget.style.background = 'var(--pill-bg, #fff)';
              e.currentTarget.style.color = 'var(--pill-text, #fff)';
            };

            const linkClasses =
              'block py-3 px-4 text-[16px] font-medium rounded-[50px] transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]';

            const hasDropdown = item.dropdown && Array.isArray(item.dropdown) && item.dropdown.length > 0;

            return (
              <li key={item.href || index}>
                {hasDropdown ? (
                  <div>
                    <button
                      className={`${linkClasses} w-full text-left flex items-center justify-between`}
                      style={defaultStyle}
                      onMouseEnter={hoverIn}
                      onMouseLeave={hoverOut}
                      onClick={(e) => { e.stopPropagation(); handleDropdownToggle(item.label, true); }}
                    >
                      {item.label}
                      <span className="text-xs">▼</span>
                    </button>
                      {mobileActiveDropdown === item.label && (
                      <div className="ml-4 mt-1 space-y-1 glass-card card-3d rounded-lg p-2" onClick={(e) => e.stopPropagation()} style={{ border: '1px solid rgba(255,255,255,0.06)', background: cssVars['--base'] ? cssVars['--base'] + 'CC' : 'rgba(255,255,255,0.06)' }}>
                        {item.dropdown.map((dropdownItem, dropdownIndex) => (
                          <Link
                            key={dropdownItem.href || dropdownIndex}
                            to={dropdownItem.href}
                            className="block py-2 px-4 text-sm rounded-[25px] transition-all duration-200"
                            style={{
                              background: 'var(--pill-bg, #fff)',
                              color: 'var(--pill-text, #fff)'
                            }}
                            onMouseEnter={hoverIn}
                            onMouseLeave={hoverOut}
                            onClick={closeAllMenus}
                          >
                            {dropdownItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : isRouterLink(item.href) ? (
                  <Link
                    to={item.href}
                    className={linkClasses}
                    style={defaultStyle}
                    onMouseEnter={hoverIn}
                    onMouseLeave={hoverOut}
                    onClick={closeAllMenus}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    {...(isExternalLink(item.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className={linkClasses}
                    style={defaultStyle}
                    onMouseEnter={hoverIn}
                    onMouseLeave={hoverOut}
                    onClick={closeAllMenus}
                  >
                    {item.label}
                  </a>
                )}
              </li>
            );
          })}
          {/* Mobile Auth Buttons */}
          <li key="mobile-auth" className="pt-4 border-t border-white/20">
            <Link
              key="mobile-login"
              to="/login"
              className="block py-3 px-4 text-[16px] font-medium rounded-[50px] transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)] mb-3"
              style={{
                background: 'var(--pill-bg, #fff)',
                color: 'var(--pill-text, #fff)'
              }}
              onClick={closeAllMenus}
            >
              Login
            </Link>
            <Link
              key="mobile-signup"
              to="/signup"
              className="block py-3 px-4 text-[16px] font-medium rounded-[50px] transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
              style={{
                background: 'linear-gradient(to right, var(--base, #000), var(--hover-text, #fff))',
                color: 'white'
              }}
              onClick={closeAllMenus}
            >
              Sign Up
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

// PropTypes for type checking
PillNav.propTypes = {
  logo: PropTypes.string.isRequired,
  logoAlt: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    ariaLabel: PropTypes.string,
    action: PropTypes.string,
    onClick: PropTypes.func,
    dropdown: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired
    }))
  })),
  activeHref: PropTypes.string, // Deprecated, using useLocation instead
  className: PropTypes.string,
  ease: PropTypes.string,
  baseColor: PropTypes.string,
  pillColor: PropTypes.string,
  hoveredPillTextColor: PropTypes.string,
  pillTextColor: PropTypes.string,
  onMobileMenuClick: PropTypes.func,
  initialLoadAnimation: PropTypes.bool
};

export default React.memo(PillNav);
