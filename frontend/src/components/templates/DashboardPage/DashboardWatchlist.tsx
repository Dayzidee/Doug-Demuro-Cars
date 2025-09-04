import React from 'react';
import VehicleCard from '../../molecules/VehicleCard/VehicleCard';
import { mockVehicleData } from '../../../data/mockVehicleData';

const DashboardWatchlist = () => {
  // Using a slice of the corrected mock data as placeholder for watched items
  const watchedVehicles = mockVehicleData.slice(0, 3);

  return (
    <div>
      <h1 className="text-h2 font-heading mb-lg">My Watchlist</h1>
      {watchedVehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-lg">
          {watchedVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      ) : (
        <p className="text-neutral-metallic-silver/70">You haven't added any vehicles to your watchlist yet.</p>
      )}
    </div>
  );
};

export default DashboardWatchlist;
