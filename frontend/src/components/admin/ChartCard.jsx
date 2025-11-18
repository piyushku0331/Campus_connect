import React from 'react';
import PropTypes from 'prop-types';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import BaseCard from './BaseCard';

const COLORS = ['#2F4FFF', '#0CEBFF', '#00F59B', '#FF3CF0', '#8B5CF6'];

const ChartCard = ({
  title,
  data,
  type = 'line',
  ...props
}) => {
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#2F4FFF" />
                  <stop offset="50%" stopColor="#0CEBFF" />
                  <stop offset="100%" stopColor="#06E1FF" />
                </linearGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="name" stroke="#ffffff70" />
              <YAxis stroke="#ffffff70" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111C44',
                  border: '1px solid #ffffff20',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="url(#lineGradient)"
                strokeWidth={4}
                filter="url(#glow)"
                dot={{ fill: '#0CEBFF', stroke: '#2F4FFF', strokeWidth: 2, r: 5, filter: 'url(#glow)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06E1FF" />
                  <stop offset="50%" stopColor="#0CEBFF" />
                  <stop offset="100%" stopColor="#2F4FFF" />
                </linearGradient>
                <filter id="barGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="name" stroke="#ffffff70" />
              <YAxis stroke="#ffffff70" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111C44',
                  border: '1px solid #ffffff20',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="value" fill="url(#barGradient)" filter="url(#barGlow)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111C44',
                  border: '1px solid #ffffff20',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <BaseCard {...props}>
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div>
        {renderChart()}
      </div>
    </BaseCard>
  );
};

ChartCard.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  type: PropTypes.oneOf(['line', 'bar', 'pie']),
};

export default ChartCard;