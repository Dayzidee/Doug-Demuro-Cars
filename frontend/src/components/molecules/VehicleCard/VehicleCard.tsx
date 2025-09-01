import React from 'react';
import { Vehicle } from '../../../services/api';

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const { year, make, model, price, mileage, transmission, fuel_type, hero_image_url } = vehicle;

  // Use a placeholder image if hero_image_url is not available
  const imageUrl = hero_image_url || `https://via.placeholder.com/400x300.png/0D1B2A/FFFFFF?text=${year}+${make}+${model}`;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out group text-charcoal">
      <div className="relative">
        <img loading="lazy" src={imageUrl} alt={`${year} ${make} ${model}`} className="w-full h-56 object-cover" />
        {vehicle.is_featured && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            Featured
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col h-full">
        <h3 className="text-xl font-bold font-heading">{year} {make} {model}</h3>
        <p className="text-2xl font-special font-semibold text-charcoal mt-1">
          ${price.toLocaleString()}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600 flex-grow">
          <div><span className="font-semibold">Mileage:</span> {mileage.toLocaleString()} mi</div>
          <div><span className="font-semibold">Fuel:</span> {fuel_type}</div>
          <div><span className="font-semibold">Transmission:</span> {transmission}</div>
        </div>
        <button className="mt-4 w-full px-4 py-3 font-semibold rounded-lg bg-primary-gradient text-white hover:opacity-90 transition-opacity">
          View Details
        </button>
      </div>
    </div>
  );
};

export default VehicleCard;
