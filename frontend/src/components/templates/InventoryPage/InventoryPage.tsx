import { useInfiniteQuery } from '@tanstack/react-query';
import { searchVehicles } from '../../../services/api';
import { useFilterStore } from '../../../hooks/useFilterStore';
import { Vehicle } from '../../../data/mockVehicleData';
import VehicleCard from '../../molecules/VehicleCard/VehicleCard';
import FilterSidebar from '../../organisms/FilterSidebar/FilterSidebar';
import SortDropdown from '../../molecules/SortDropdown/SortDropdown';

interface VehicleSearchResponse {
  data: Vehicle[];
  facets: any;
  total: number;
  hasMore: boolean;
}

const VehicleGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-lg">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="bg-glass border border-glass rounded-xl shadow-lg h-96 animate-pulse"></div>
    ))}
  </div>
);

const InventoryPage = () => {
  const filters = useFilterStore((state) => state.filters);
  const sortOrder = useFilterStore((state) => state.sortOrder);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery<VehicleSearchResponse, Error>({
    queryKey: ['vehicles', filters, sortOrder],
    queryFn: ({ pageParam = 1 }) => searchVehicles({ filters, sortOrder, pageParam }),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.hasMore) {
        return pages.length + 1;
      }
      return undefined;
    },
  });

  const vehicles = data?.pages.flatMap(page => page.data) || [];
  const totalVehicles = data?.pages[0]?.total || 0;
  const facets = data?.pages[0]?.facets;

  return (
    <div className="container mx-auto py-xl">
      <h1 className="text-h1 font-heading uppercase text-center mb-xl">
        <span className="bg-clip-text text-transparent bg-primary-gradient">Vehicle</span> Inventory
      </h1>

      <div className="flex flex-col lg:flex-row gap-lg items-start">
        <FilterSidebar facets={facets} isLoading={isLoading} />

        <main className="flex-1">
          <div className="flex justify-between items-center mb-md">
            <p className="text-neutral-metallic-silver/80">
              Showing {vehicles.length} of {totalVehicles} vehicles
            </p>
            <SortDropdown />
          </div>

          {isLoading ? (
            <VehicleGridSkeleton />
          ) : isError ? (
            <p className="text-center text-red-400">Error: {error.message}</p>
          ) : (
            <>
              {vehicles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-lg">
                  {vehicles.map((vehicle) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-body-lg col-span-full mt-2xl">No vehicles found matching your criteria.</p>
              )}

              <div className="text-center mt-xl">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={!hasNextPage || isFetchingNextPage}
                  className="bg-primary-gradient hover:opacity-90 text-white font-bold py-sm px-lg rounded-lg transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isFetchingNextPage
                    ? 'Loading more...'
                    : hasNextPage
                    ? 'Load More'
                    : 'Nothing more to load'}
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default InventoryPage;
