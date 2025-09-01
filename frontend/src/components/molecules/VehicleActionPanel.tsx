import React from 'react';
import InstallmentCalculator from './InstallmentCalculator';

interface VehicleActionPanelProps {
  price: number;
}

const VehicleActionPanel: React.FC<VehicleActionPanelProps> = ({ price }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg space-y-6 sticky top-24">
      <div>
        <span className="text-gray-400 text-lg">Price</span>
        <p className="text-4xl font-bold text-white">${price.toLocaleString()}</p>
      </div>

      <div className="space-y-3">
        <button className="w-full py-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-lg">
          Schedule Test Drive
        </button>
        <button className="w-full py-3 font-bold text-blue-400 bg-transparent border-2 border-blue-400 rounded-lg hover:bg-blue-400 hover:text-white transition-colors">
          Make an Offer
        </button>
      </div>

      <div className="border-t border-gray-700 pt-6">
        <InstallmentCalculator defaultPrice={price} />
      </div>
    </div>
  );
};

export default VehicleActionPanel;
