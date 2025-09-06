import { useInfiniteQuery } from "@tanstack/react-query";
// FIX 1: Import the searchVehicles FUNCTION and the VehicleSummary TYPE
import { searchVehicles, type VehicleSummary } from "../../../services/api";
import { useFilterStore } from "../../../hooks/useFilterStore";
import VehicleCard from "../../molecules/VehicleCard/VehicleCard";
import FilterSidebar from "../../organisms/FilterSidebar/FilterSidebar";
import SortDropdown from "../../molecules/SortDropdown/SortDropdown";

// Define the shape of the API response
interface VehicleSearchResponse {
  data: VehicleSummary[];
  facets: any;
  total: number;
  hasMore: boolean;
}

const VehicleGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-lg">
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="bg-glass border border-glass rounded-xl shadow-lg h-96 animate-pulse"
      ></div>
    ))}
  </div>
);

const InventoryPage = () => {
  // FIX 2: Correctly select the state from the store and destructure it.
  const {
    make,
    model,
    priceRange,
    yearRange,
    bodyTypes,
    fuelTypes,
    sortOrder,
  } = useFilterStore();

  const filters = { make, model, priceRange, yearRange, bodyTypes, fuelTypes };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery<
    VehicleSearchResponse,
    Error,
    VehicleSearchResponse, // Often the same as the first generic
    (string | typeof filters | string)[], // Describes the queryKey array
    number // Explicitly tell it that pageParam is a number
  >({
    queryKey: ["vehicles", filters, sortOrder],
    // Now, inside here, TypeScript knows that pageParam is a number.
    queryFn: ({ pageParam }) =>
      searchVehicles({ filters, sortOrder, pageParam }), // No more error!
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.hasMore) {
        return allPages.length + 1;
      }
      return undefined;
    },
  });

  const vehicles = data?.pages.flatMap((page) => page.data) ?? [];
  const totalVehicles = data?.pages[0]?.total ?? 0;
  const facets = data?.pages[0]?.facets;

  return (
    <div className="container mx-auto py-xl">
      <h1 className="text-h1 font-heading uppercase text-center mb-xl">
        <span className="bg-clip-text text-transparent bg-primary-gradient">
          Vehicle
        </span>{" "}
        Inventory
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <FilterSidebar facets={facets} isLoading={isLoading} />

        <main className="flex-1">
          {isLoading && <p>Loading vehicles...</p>}
          {isError && <p className="text-red-500">Error fetching vehicles: {error.message}</p>}
          {vehicles && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {vehicles.length > 0 ? (
                vehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))
              ) : (
                <p className="text-center text-body-lg col-span-full mt-2xl">
                  No vehicles found matching your criteria.
                </p>
              )}

              <div className="text-center mt-xl">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={!hasNextPage || isFetchingNextPage}
                  className="bg-primary-gradient hover:opacity-90 text-white font-bold py-sm px-lg rounded-lg transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isFetchingNextPage
                    ? "Loading more..."
                    : hasNextPage
                    ? "Load More"
                    : "Nothing more to load"}
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
