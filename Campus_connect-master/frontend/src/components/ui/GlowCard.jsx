import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../lib/utils';

const GlowCard = React.forwardRef(({
  children,
  className,
  glowColor = '#6B9FFF',
  glowIntensity = 0.3,
  hoverScale = 1.05,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "glass-card rounded-2xl p-6 hover:shadow-cinematic-glow transition-all duration-500 interactive-element relative overflow-hidden group",
        className
      )}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        '--glow-x': '50%',
        '--glow-y': '50%',
        '--glow-intensity': '0',
        '--glow-radius': '200px',
        '--glow-color': glowColor.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16)).join(', '),
        transform: 'scale(1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        e.currentTarget.style.setProperty('--glow-x', `${x}%`);
        e.currentTarget.style.setProperty('--glow-y', `${y}%`);
        e.currentTarget.style.setProperty('--glow-intensity', glowIntensity.toString());
        e.currentTarget.style.transform = `scale(${hoverScale})`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.setProperty('--glow-intensity', '0');
        e.currentTarget.style.transform = 'scale(1)';
      }}
      {...props}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at var(--glow-x) var(--glow-y), rgba(var(--glow-color), var(--glow-intensity)) 0%, transparent 70%)`,
          borderRadius: 'inherit'
        }}
      />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(circle at var(--glow-x) var(--glow-y), rgba(127, 64, 255, 0.05) 0%, transparent 80%)',
          borderRadius: 'inherit',
          animation: 'pulse 2s infinite'
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
});

GlowCard.displayName = 'GlowCard';

GlowCard.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  glowColor: PropTypes.string,
  glowIntensity: PropTypes.number,
  hoverScale: PropTypes.number,
};

export default GlowCard;