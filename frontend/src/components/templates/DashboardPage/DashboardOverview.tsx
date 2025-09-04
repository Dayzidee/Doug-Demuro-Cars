import React from 'react';

const StatCard = ({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) => (
    <div className="bg-glass/50 border border-glass rounded-xl p-md">
        <div className="flex items-center">
            <div className="p-sm bg-glass rounded-lg mr-md">{icon}</div>
            <div>
                <p className="text-sm text-neutral-metallic-silver/70">{title}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
        </div>
    </div>
);

const DashboardOverview = () => {
  // Placeholder data
  const stats = [
    { title: 'Active Bids', value: '3', icon: '⚡' },
    { title: 'Items Watched', value: '12', icon: '👀' },
    { title: 'Vehicles Won', value: '1', icon: '🏆' },
    { title: 'Listings Sold', value: '0', icon: '💰' },
  ];

  return (
    <div>
      <h1 className="text-h2 font-heading mb-lg">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md mb-lg">
        {stats.map(stat => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} />
        ))}
      </div>
      <div className="bg-glass/50 border border-glass rounded-xl p-md">
        <h2 className="text-h3 font-heading mb-md">Recent Activity</h2>
        <p className="text-neutral-metallic-silver/70">No recent activity to display.</p>
      </div>
    </div>
  );
};

export default DashboardOverview;
