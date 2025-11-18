import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../lib/utils';

const VisionButton = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled = false,
  loading = false,
  ...props
}) => {
  const baseClasses = `
    relative inline-flex items-center justify-center font-medium
    transition-all duration-300 ease-out
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A0F2C]
    active:scale-95
    min-h-[44px] px-6
  `;

  const variants = {
    primary: `
      bg-linear-to-r from-[#2F4FFF] via-[#0CEBFF] to-[#8B5CF6]
      text-white
      rounded-2xl
      shadow-[0_4px_20px_rgba(47,79,255,0.3),0_2px_8px_rgba(12,235,255,0.2)]
      hover:shadow-[0_8px_32px_rgba(47,79,255,0.5),0_4px_16px_rgba(12,235,255,0.4),0_0_40px_rgba(139,92,246,0.3)]
      hover:scale-105
      focus:ring-[#2F4FFF]/50
      before:absolute before:inset-0 before:rounded-2xl before:bg-linear-to-r
      before:from-[#2F4FFF]/20 before:via-[#0CEBFF]/20 before:to-[#8B5CF6]/20
      before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300
    `,
    success: `
      bg-linear-to-r from-[#00F59B] via-[#0CEBFF] to-[#00F59B]
      text-white
      rounded-2xl
      shadow-[0_4px_20px_rgba(0,245,155,0.3),0_2px_8px_rgba(12,235,255,0.2)]
      hover:shadow-[0_8px_32px_rgba(0,245,155,0.5),0_4px_16px_rgba(12,235,255,0.4),0_0_40px_rgba(0,245,155,0.3)]
      hover:scale-105
      focus:ring-[#00F59B]/50
      before:absolute before:inset-0 before:rounded-2xl before:bg-linear-to-r
      before:from-[#00F59B]/20 before:via-[#0CEBFF]/20 before:to-[#00F59B]/20
      before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300
    `,
    danger: `
      bg-linear-to-r from-[#FF3CF0] via-[#8B5CF6] to-[#FF3CF0]
      text-white
      rounded-2xl
      shadow-[0_4px_20px_rgba(255,60,240,0.3),0_2px_8px_rgba(139,92,246,0.2)]
      hover:shadow-[0_8px_32px_rgba(255,60,240,0.5),0_4px_16px_rgba(139,92,246,0.4),0_0_40px_rgba(255,60,240,0.3)]
      hover:scale-105
      focus:ring-[#FF3CF0]/50
      before:absolute before:inset-0 before:rounded-2xl before:bg-linear-to-r
      before:from-[#FF3CF0]/20 before:via-[#8B5CF6]/20 before:to-[#FF3CF0]/20
      before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300
    `,
    secondary: `
      bg-linear-to-r from-[#8B5CF6] via-[#FF3CF0] to-[#2F4FFF]
      text-white
      rounded-2xl
      shadow-[0_4px_20px_rgba(139,92,246,0.3),0_2px_8px_rgba(255,60,240,0.2)]
      hover:shadow-[0_8px_32px_rgba(139,92,246,0.5),0_4px_16px_rgba(255,60,240,0.4),0_0_40px_rgba(47,79,255,0.3)]
      hover:scale-105
      focus:ring-[#8B5CF6]/50
      before:absolute before:inset-0 before:rounded-2xl before:bg-linear-to-r
      before:from-[#8B5CF6]/20 before:via-[#FF3CF0]/20 before:to-[#2F4FFF]/20
      before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300
    `,
    ghost: `
      bg-transparent
      text-[#0CEBFF]
      border-2 border-[#0CEBFF]/50
      rounded-2xl
      shadow-[0_2px_10px_rgba(12,235,255,0.2)]
      hover:bg-[#0CEBFF]/10
      hover:shadow-[0_4px_20px_rgba(12,235,255,0.4),0_0_30px_rgba(12,235,255,0.3)]
      hover:border-[#0CEBFF]
      hover:scale-105
      focus:ring-[#0CEBFF]/50
    `
  };

  const sizes = {
    sm: 'text-sm py-2 px-4 min-h-[36px]',
    md: 'text-base py-3 px-6 min-h-[44px]',
    lg: 'text-lg py-4 px-8 min-h-[52px]',
    xl: 'text-xl py-5 px-10 min-h-[60px]'
  };

  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        loading && 'cursor-wait',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {/* 3D Depth Effect */}
      <div className="absolute inset-0 rounded-2xl bg-linear-to-b from-white/10 to-transparent opacity-50" />

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {loading && (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        )}
        {children}
      </span>

      {/* Glow Effect on Hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 bg-linear-to-r from-transparent via-white/5 to-transparent blur-sm" />
    </button>
  );
};

VisionButton.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'success', 'danger', 'secondary', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool
};

VisionButton.defaultProps = {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false
};

export default VisionButton;