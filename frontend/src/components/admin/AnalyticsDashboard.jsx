import React, { useState, useEffect } from 'react';
import KPICard from './KPICard';
import CircularProgressCard from './CircularProgressCard';
import MetricsCard from './MetricsCard';
import ChartCard from './ChartCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { adminAPI } from '../../services/api';
import { Users, Calendar, FileText, Bell, TrendingUp } from 'lucide-react';

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await adminAPI.getAnalytics();
        setAnalyticsData(response.data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Transform data for KPIs
  const kpis = analyticsData ? [
    {
      title: 'Total Users',
      value: analyticsData.userMetrics.totalUsers.toLocaleString(),
      change: '+8.2%', // Placeholder - could calculate from historical data
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Total Events',
      value: analyticsData.contentMetrics.totalEvents.toLocaleString(),
      change: '+12.5%', // Placeholder
      icon: Calendar,
      color: 'green'
    },
    {
      title: 'Total Posts',
      value: analyticsData.contentMetrics.totalPosts.toLocaleString(),
      change: '+15.3%', // Placeholder
      icon: FileText,
      color: 'purple'
    },
    {
      title: 'Total Notices',
      value: analyticsData.contentMetrics.totalNotices.toLocaleString(),
      change: '+5.7%', // Placeholder
      icon: Bell,
      color: 'red'
    }
  ] : [];

  // Transform user registrations data for chart
  const userActivityData = analyticsData?.userRegistrations?.map(item => ({
    name: new Date(item._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: item.count
  })) || [];

  // Create engagement metrics
  const engagementMetrics = analyticsData ? [
    {
      label: 'Recent Posts (30d)',
      value: analyticsData.engagementMetrics.recentPosts.toLocaleString(),
      change: '+10.5%', // Placeholder
      icon: FileText,
      color: 'blue'
    },
    {
      label: 'Recent Events (30d)',
      value: analyticsData.engagementMetrics.recentEvents.toLocaleString(),
      change: '+7.8%', // Placeholder
      icon: Calendar,
      color: 'green'
    },
    {
      label: 'Active Users',
      value: analyticsData.userMetrics.activeUsers.toLocaleString(),
      change: '+5.2%', // Placeholder
      icon: Users,
      color: 'purple'
    }
  ] : [];

  // Mock data for additional charts (could be enhanced with more backend endpoints)
  const contentDistributionData = analyticsData ? [
    { name: 'Posts', value: analyticsData.contentMetrics.totalPosts },
    { name: 'Events', value: analyticsData.contentMetrics.totalEvents },
    { name: 'Notices', value: analyticsData.contentMetrics.totalNotices },
    { name: 'Lost Items', value: analyticsData.contentMetrics.totalLostItems }
  ] : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-white font-heading mb-6 sm:mb-8">Analytics Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {kpis.map((kpi, index) => (
          <KPICard
            key={index}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            icon={kpi.icon}
            color={kpi.color}
          />
        ))}
        <CircularProgressCard
          title="User Engagement"
          percentage={analyticsData ? Math.round((analyticsData.userMetrics.activeUsers / analyticsData.userMetrics.totalUsers) * 100) : 0}
          color="blue"
        />
        <MetricsCard
          title="Engagement Metrics"
          metrics={engagementMetrics}
          className="col-span-1 md:col-span-2 lg:col-span-2"
        />
      </div>
      <div className="mt-6 sm:mt-8">
        <h2 className="text-xl sm:text-2xl font-bold text-white font-heading mb-4 sm:mb-6">Charts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <ChartCard
            title="User Registrations (7 days)"
            data={userActivityData}
            type="line"
            className="col-span-1"
          />
          <ChartCard
            title="Content Distribution"
            data={contentDistributionData}
            type="pie"
            className="col-span-1"
          />
          <ChartCard
            title="User Activity Trend"
            data={userActivityData}
            type="bar"
            className="col-span-1"
          />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;