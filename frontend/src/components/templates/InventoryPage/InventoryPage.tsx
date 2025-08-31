import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../services/api';
import { useFilterStore } from '../../../hooks/useFilterStore';
import { Vehicle } from '../../../data/mockVehicleData';
import VehicleCard from '../../molecules/VehicleCard/VehicleCard';

const InventoryPage = () => {
  // Select only the filter values from the store to trigger re-renders only when they change.
  const filters = useFilterStore((state) => ({
    make: state.make,
    model: state.model,
    priceMax: state.priceMax,
    // Add other filters here as they are implemented
  }));

  const { data: vehicles, isLoading, isError, error } = useQuery<Vehicle[], Error>({
    // The queryKey includes the filters object. React Query will refetch
    // automatically whenever any value in this object changes.
    queryKey: ['vehicles', filters],
    queryFn: async () => {
      // Remove null/empty values from filters before sending to the API
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== null && value !== '')
      );
      const response = await apiClient.get('/vehicles/search', {
        params: activeFilters,
      });
      return response.data;
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-heading mb-4">Vehicle Inventory</h1>

      {/* Placeholder for filter controls */}
      <div className="p-4 mb-8 bg-gray-100 rounded-lg">
        <p className="font-bold">Filters will go here.</p>
        <p className="text-sm text-gray-600">Current Make Filter: {filters.make || 'None'}</p>
      </div>

      <div className="mt-8">
        {isLoading && <p>Loading vehicles...</p>}
        {isError && <p className="text-red-500">Error fetching vehicles: {error.message}</p>}
        {vehicles && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicles.length > 0 ? (
              vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))
            ) : (
              <p className="col-span-full">No vehicles found matching your criteria.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryPage;
