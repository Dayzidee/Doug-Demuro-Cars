import React from 'react';
import { Vehicle } from '../../../services/api';
import { Link } from 'react-router-dom';

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const { id, year, make, model, price, mileage, transmission, fuel_type, hero_image_url } = vehicle;

  const imageUrl = hero_image_url || `https://via.placeholder.com/400x300.png/0D1B2A/E5E5E5?text=${year}+${make}+${model}`;

  return (
    <div className="bg-glass border border-glass rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out group flex flex-col">
      <div className="relative">
        <img loading="lazy" src={imageUrl} alt={`${year} ${make} ${model}`} className="w-full h-56 object-cover" />
        {vehicle.is_featured && (
          <div className="absolute top-2 right-2 bg-secondary-gradient text-white text-xs font-bold px-sm py-xs rounded">
            Featured
          </div>
        )}
      </div>
      <div className="p-md flex flex-col flex-grow">
        <h3 className="text-h4 font-heading">{year} {make} {model}</h3>
        <p className="font-accent text-2xl font-semibold text-secondary-golden-yellow mt-xs">
          ${price.toLocaleString()}
        </p>
        <div className="mt-md grid grid-cols-2 gap-x-md gap-y-sm text-sm text-neutral-metallic-silver/80 flex-grow">
          <div><span className="font-semibold">Mileage:</span> {mileage.toLocaleString()} mi</div>
          <div><span className="font-semibold">Fuel:</span> {fuel_type}</div>
          <div><span className="font-semibold">Transmission:</span> {transmission}</div>
        </div>
        <Link to={`/inventory/${id}`} className="block text-center mt-md w-full px-md py-sm font-bold rounded-lg bg-primary-gradient text-white hover:opacity-90 transition-opacity">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default VehicleCard;
