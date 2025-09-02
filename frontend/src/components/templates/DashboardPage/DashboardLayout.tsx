import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from '../../organisms/DashboardSidebar/DashboardSidebar';

const DashboardLayout: React.FC = () => {
  return (
    <div className="container mx-auto py-xl">
      <div className="flex flex-col md:flex-row gap-lg items-start">
        <DashboardSidebar />
        <main className="flex-1 bg-glass border border-glass rounded-xl p-lg w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
