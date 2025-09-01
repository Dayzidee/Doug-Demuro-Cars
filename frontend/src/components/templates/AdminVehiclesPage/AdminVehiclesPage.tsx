import React from 'react';
import VehicleManager from '../../organisms/VehicleManager';

const AdminVehiclesPage: React.FC = () => {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <header className="bg-gray-800 p-6 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold">Admin: Vehicle Management</h1>
          <p className="text-gray-300 mt-2">Use this interface to add, edit, and manage all vehicle inventory.</p>
        </div>
      </header>
      <main className="p-4 md:p-8">
        <VehicleManager />
      </main>
    </div>
  );
};

export default AdminVehiclesPage;
