import React from 'react';
import PromotionsManager from '../../organisms/PromotionsManager';

const AdminPromotionsPage: React.FC = () => {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <header className="bg-gray-800 p-6 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold">Admin: Manage Promotions</h1>
          <p className="text-gray-300 mt-2">Use this interface to create, edit, and delete promotional offers.</p>
        </div>
      </header>
      <main className="p-4 md:p-8">
        <PromotionsManager />
      </main>
    </div>
  );
};

export default AdminPromotionsPage;
