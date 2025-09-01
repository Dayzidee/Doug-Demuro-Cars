import React, { useState } from 'react';

// This interface should be shared or imported from a types file
interface VehicleDetail {
    description: string;
    specifications: Record<string, any>; // Assuming JSONB from the database
    features: string[]; // Assuming array of strings
    engine: string;
    transmission: string;
    drivetrain: string;
    mileage: number;
    exterior_color: string;
    interior_color: string;
}

interface VehicleInfoPanelProps {
  vehicle: VehicleDetail;
}

type Tab = 'overview' | 'specifications' | 'features';

const VehicleInfoPanel: React.FC<VehicleInfoPanelProps> = ({ vehicle }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'specifications':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 text-sm">
            {vehicle.specifications && Object.entries(vehicle.specifications).length > 0 ? (
                Object.entries(vehicle.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b border-gray-700 py-2">
                    <span className="font-semibold text-gray-400 capitalize">{key.replace(/_/g, ' ')}</span>
                    <span className="text-white">{String(value)}</span>
                </div>
                ))
            ) : (
                <p className="text-gray-400 col-span-full">No specifications available.</p>
            )}
          </div>
        );
      case 'features':
        return (
          <ul className="list-disc list-inside grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm">
            {vehicle.features && vehicle.features.length > 0 ? (
                vehicle.features.map((feature, index) => (
                <li key={index}>{feature}</li>
                ))
            ) : (
                <p className="text-gray-400 col-span-full">No features listed.</p>
            )}
          </ul>
        );
      case 'overview':
      default:
        return (
            <div>
                <p className="mb-6 text-gray-300 leading-relaxed">{vehicle.description || "No description provided."}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between border-b border-gray-700 py-2"><span className="text-gray-400">Engine:</span> <span className="font-semibold">{vehicle.engine}</span></div>
                    <div className="flex justify-between border-b border-gray-700 py-2"><span className="text-gray-400">Transmission:</span> <span className="font-semibold">{vehicle.transmission}</span></div>
                    <div className="flex justify-between border-b border-gray-700 py-2"><span className="text-gray-400">Drivetrain:</span> <span className="font-semibold">{vehicle.drivetrain}</span></div>
                    <div className="flex justify-between border-b border-gray-700 py-2"><span className="text-gray-400">Mileage:</span> <span className="font-semibold">{vehicle.mileage.toLocaleString()} mi</span></div>
                    <div className="flex justify-between border-b border-gray-700 py-2"><span className="text-gray-400">Exterior Color:</span> <span className="font-semibold">{vehicle.exterior_color}</span></div>
                    <div className="flex justify-between border-b border-gray-700 py-2"><span className="text-gray-400">Interior Color:</span> <span className="font-semibold">{vehicle.interior_color}</span></div>
                </div>
            </div>
        );
    }
  };

  const TabButton = ({ tabName, label }: { tabName: Tab; label: string }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`px-4 py-2 font-semibold transition-colors duration-200 ${activeTab === tabName ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-gray-800 p-4 md:p-6 rounded-lg">
      <div className="flex border-b border-gray-700 mb-6">
        <TabButton tabName="overview" label="Overview" />
        <TabButton tabName="specifications" label="Specifications" />
        <TabButton tabName="features" label="Features" />
      </div>
      <div>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default VehicleInfoPanel;
