import React from 'react';
import PropTypes from 'prop-types';
import BaseCard from './BaseCard';

const CircularProgressCard = ({ title, percentage, color }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colorMap = {
    blue: '#2F4FFF',
    aqua: '#0CEBFF',
    cyan: '#0CEBFF',
    purple: '#8B5CF6',
    green: '#00F59B',
    red: '#FF3CF0',
  };
  const progressColor = colorMap[color] || '#2F4FFF';
  const glowColor = progressColor;

  return (
    <BaseCard glowColor={glowColor} className="flex flex-col items-center justify-center h-48 sm:h-64">
      <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 self-start">{title}</h3>
      <div className="relative">
        <svg width="100" height="100" className="sm:w-[120px] sm:h-[120px] transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#ffffff20"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={progressColor}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300 ease-out"
            style={{
              filter: `drop-shadow(0 0 10px ${progressColor}40)`,
            }}
          />
        </svg>
        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl sm:text-2xl font-bold text-white">{percentage}%</span>
        </div>
      </div>
    </BaseCard>
  );
};

CircularProgressCard.propTypes = {
  title: PropTypes.string.isRequired,
  percentage: PropTypes.number.isRequired,
  color: PropTypes.oneOf(['blue', 'aqua', 'cyan', 'purple', 'green', 'red']).isRequired,
};

export default CircularProgressCard;