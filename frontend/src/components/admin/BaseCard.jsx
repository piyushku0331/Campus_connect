import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../lib/utils';

const BaseCard = React.forwardRef(({
  children,
  className,
  glowColor = '#2F4FFF',
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative rounded-2xl p-4 sm:p-6 transition-all duration-300 ease-in-out",
        "bg-linear-to-br from-[#0A0F2C]/80 via-[#111C44]/60 to-[#1A2759]/40",
        "backdrop-blur-md border border-white/10",
        "shadow-2xl shadow-black/20",
        "hover:scale-105 hover:-translate-y-1 hover:shadow-3xl hover:shadow-[#2F4FFF]/20",
        "focus-within:scale-105 focus-within:-translate-y-1 focus-within:shadow-3xl focus-within:shadow-[#2F4FFF]/20",
        "focus:outline-none focus:ring-2 focus:ring-[#0CEBFF]/50 focus:ring-offset-2 focus:ring-offset-[#0A0F2C]",
        "before:absolute before:inset-0 before:rounded-2xl before:p-px before:bg-linear-to-br before:from-[#2F4FFF]/50 before:via-[#0CEBFF]/30 before:to-[#2F4FFF]/50 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
        "after:absolute after:inset-px after:rounded-2xl after:bg-linear-to-br after:from-[#0A0F2C]/90 after:via-[#111C44]/70 after:to-[#1A2759]/50",
        className
      )}
      style={{
        '--glow-color': glowColor,
      }}
      tabIndex={0}
      {...props}
    >
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
});

BaseCard.displayName = 'BaseCard';

BaseCard.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  glowColor: PropTypes.string,
};

export default BaseCard;