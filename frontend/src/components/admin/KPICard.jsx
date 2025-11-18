import React from 'react';
import PropTypes from 'prop-types';
import BaseCard from './BaseCard';

const colorMap = {
  blue: '#2F4FFF',
  purple: '#8B5CF6',
  green: '#00F59B',
  red: '#FF3CF0',
};

const KPICard = ({
  title,
  value,
  change,
  icon: Icon,
  color = 'blue',
  ...props
}) => {
  const glowColor = colorMap[color];
  const isPositive = change.startsWith('+');

  return (
    <BaseCard glowColor={glowColor} {...props}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-white/70 mb-1">{title}</h3>
          <div className="text-2xl font-bold text-white mb-2">
            {value}
          </div>
          <div className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {change}
          </div>
        </div>
        <div className="shrink-0">
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: `${glowColor}20` }}
          >
            <Icon className="w-6 h-6" style={{ color: glowColor }} />
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

KPICard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  change: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.oneOf(['blue', 'purple', 'green', 'red']),
};

export default KPICard;