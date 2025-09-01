import React, { useState, useEffect } from 'react';
import VehicleMediaGallery from '../molecules/VehicleMediaGallery';
import VehicleInfoPanel from '../molecules/VehicleInfoPanel';
import VehicleActionPanel from '../molecules/VehicleActionPanel';

// Define the shape of the full vehicle object based on the expected API response.
interface Media {
    id: string;
    url: string;
    alt_text?: string;
}

interface PriceHistory {
    id: string;
    price: number;
    recorded_at: string;
}

interface Location {
    id:string;
    name: string;
    city: string;
    state: string;
}

interface VehicleDetail {
    id: string;
    make: string;
    model: string;
    year: number;
    price_current: number;
    mileage: number;
    exterior_color: string;
    interior_color: string;
    description: string;
    specifications: Record<string, any>;
    features: string[];
    engine: string;
    transmission: string;
    drivetrain: string;
    vehicle_media: Media[];
    price_history: PriceHistory[];
    locations: Location;
}

interface VehicleDetailLayoutProps {
  vehicleId: string;
}

const VehicleDetailLayout: React.FC<VehicleDetailLayoutProps> = ({ vehicleId }) => {
  const [vehicle, setVehicle] = useState<VehicleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/v1/vehicles/${vehicleId}`);
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || 'Failed to fetch vehicle details');
        }
        const data = await response.json();
        setVehicle(data);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError('An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (vehicleId) {
      fetchVehicleDetails();
    }
  }, [vehicleId]);

  if (loading) {
    return <div className="text-center p-16 text-white">Loading Vehicle Details...</div>;
  }

  if (error) {
    return <div className="text-center p-16 text-red-400 bg-red-900/30 rounded-lg">{error}</div>;
  }

  if (!vehicle) {
    return <div className="text-center p-16 text-white">No vehicle data was found.</div>;
  }

  return (
    <div className="container mx-auto p-4 text-white">
      <div className="text-center lg:text-left">
        <h1 className="text-4xl font-bold mb-2">{vehicle.year} {vehicle.make} {vehicle.model}</h1>
        <p className="text-lg text-gray-400 mb-8">Located at {vehicle.locations.name}, {vehicle.locations.city}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <VehicleMediaGallery media={vehicle.vehicle_media} default_alt_text={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} />
        </div>
        <div className="row-start-3 lg:row-start-auto">
          <VehicleActionPanel price={vehicle.price_current} />
        </div>
        <div className="lg:col-span-2">
          <VehicleInfoPanel vehicle={vehicle} />
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailLayout;
