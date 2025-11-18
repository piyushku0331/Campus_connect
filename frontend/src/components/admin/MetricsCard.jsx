import React from 'react';
import PropTypes from 'prop-types';
import BaseCard from './BaseCard';

const colorMap = {
  blue: '#2F4FFF',
  purple: '#8B5CF6',
  green: '#00F59B',
  red: '#FF3CF0',
  orange: '#06E1FF',
  pink: '#FF3CF0',
};

const MetricsCard = ({
  title,
  metrics,
  ...props
}) => {
  return (
    <BaseCard {...props}>
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {metrics.map((metric, index) => {
          const { label, value, change, icon: Icon, color = 'blue' } = metric;
          const glowColor = colorMap[color];
          const isPositive = change.startsWith('+');

          return (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div
                className="p-2 rounded-lg shrink-0"
                style={{ backgroundColor: `${glowColor}20` }}
              >
                <Icon className="w-5 h-5" style={{ color: glowColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white/70 truncate">{label}</p>
                <p className="text-lg font-bold text-white">{value}</p>
                <p className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {change}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </BaseCard>
  );
};

MetricsCard.propTypes = {
  title: PropTypes.string.isRequired,
  metrics: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      change: PropTypes.string.isRequired,
      icon: PropTypes.elementType.isRequired,
      color: PropTypes.oneOf(['blue', 'purple', 'green', 'red', 'orange', 'pink']),
    })
  ).isRequired,
};

export default MetricsCard;