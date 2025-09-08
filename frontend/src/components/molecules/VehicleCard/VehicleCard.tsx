import React from 'react';
import { Vehicle } from '../../../services/api';
import { Link } from 'react-router-dom';
import { Heart, GitCompareArrows } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const { id, year, make, model, price, mileage, transmission, fuel_type, hero_image_url } = vehicle;

  const imageUrl = hero_image_url || `https://via.placeholder.com/400x300.png/0D1B2A/E5E5E5?text=${year}+${make}+${model}`;

  // Placeholder data for new features
  const isHotDeal = price < 30000;
  const isLowMileage = mileage < 50000;

  return (
    <div className="bg-backgrounds-card border border-glass rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out group flex flex-col hover:shadow-primary-electric-cyan/20 hover:border-primary-electric-cyan/50 hover:-translate-y-2 hover:rotate-[-1deg]">
      <div className="relative overflow-hidden">
        <img loading="lazy" src={imageUrl} alt={`${year} ${make} ${model}`} className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110" />

        <div className="absolute top-2 right-2 flex flex-col gap-2">
            {vehicle.is_featured && (
              <div className="text-xs font-bold px-sm py-xs rounded bg-secondary-gradient text-white shadow-lg">Featured</div>
            )}
            {isHotDeal && (
                <div className="text-xs font-bold px-sm py-xs rounded bg-red-600 text-white shadow-lg">Hot Deal</div>
            )}
            {isLowMileage && (
                <div className="text-xs font-bold px-sm py-xs rounded bg-blue-600 text-white shadow-lg">Low Mileage</div>
            )}
        </div>
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

        <div className="mt-md flex items-center gap-2">
            <Link to={`/inventory/${id}`} className="block text-center w-full px-md py-sm font-bold rounded-lg bg-primary-gradient text-white hover:opacity-90 transition-opacity transform hover:scale-105">
              View Details
            </Link>
            <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white">
                <Heart size={20} />
            </button>
            <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white">
                <GitCompareArrows size={20} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
