import axios from 'axios';

// Define the structure of a Vehicle object for the frontend
export interface Bid {
  id: string;
  amount: number;
  created_at: string;
  user_id: string;
  user_full_name?: string;
}

export interface VehicleSummary {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  hero_image_url?: string;
  // Notice it does NOT include vin, fuel_type, etc.
}

export interface VehicleDetail {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  body_type: string;
  fuel_type: string;
  transmission: string;
  exterior_color: string;
  is_featured: boolean;
  hero_image_url?: string;
}



// The base URL will be proxied by the Vite development server.
const API_BASE_URL = '/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Axios request interceptor to add the JWT token to the Authorization header.
 * This ensures that every authenticated request includes the necessary token.
 */
apiClient.interceptors.request.use(
  (config) => {
    // This is a placeholder for getting the token. In a real app, this would
    // come from a secure source like the auth context or secure storage.
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// FIX 2: ADD THE MISSING searchVehicles FUNCTION.
// Place it logically with your other data-fetching functions.

/**
 * Searches for vehicles based on a set of filters and sorting options.
 * @param filters The filter state from the zustand store.
 * @param sortOrder The current sort order.
 * @param pageParam The current page number for pagination.
 * @returns A promise that resolves to the search response containing summaries.
 */
export const searchVehicles = async ({ filters, sortOrder, pageParam = 1 }: { filters: any, sortOrder: string, pageParam?: number }) => {
  const queryParams = {
    sort: sortOrder,
    make: filters.make,
    model: filters.model,
    price_min: filters.priceRange[0],
    price_max: filters.priceRange[1],
    year_min: filters.yearRange[0],
    year_max: filters.yearRange[1],
    bodyType: filters.bodyTypes.join(','),
    fuelType: filters.fuelTypes.join(','),
    page: pageParam,
  };

  // Remove empty/default params to keep the URL clean
  const activeFilters = Object.fromEntries(
    Object.entries(queryParams).filter(([, value]) => {
      if (value === null || value === '' || value === undefined) return false;
      if (Array.isArray(value) && value.length === 0) return false;
      // Add checks for default ranges if you want to exclude them
      // if (key.includes('_min') && value === 0) return false;
      return true;
    })
  );

  const response = await apiClient.get('/vehicles/search', { params: activeFilters });
  // Ensure the return type matches what InventoryPage expects
  return response.data as { data: VehicleSummary[], hasMore: boolean, total: number, facets: any };
};


/**
 * Fetches a list of featured vehicles from the backend API.
 * @returns A promise that resolves to an array of Vehicle objects.
 */
export const fetchFeaturedVehicles = async (): Promise<VehicleDetail[]> => {
  const response = await apiClient.get('/inventory/featured');
  return response.data;
};

/**
 * Creates a new vehicle listing by sending the form data to the backend API.
 * @param listingData The data for the new listing.
 * @returns A promise that resolves to the newly created Vehicle object.
 */
export const createListing = async (listingData: any): Promise<VehicleDetail> => {
  const response = await apiClient.post('/cars/sell', listingData);
  return response.data;
};

/**
 * Fetches a single vehicle by its ID from the backend API.
 * @param vehicleId The ID of the vehicle to fetch.
 * @returns A promise that resolves to a Vehicle object.
 */
export const fetchVehicleById = async (vehicleId: string): Promise<VehicleDetail> => {
  const response = await apiClient.get(`/inventory/${vehicleId}`);
  return response.data;
};

/**
 * Fetches the bid history for a specific vehicle.
 * @param vehicleId The ID of the vehicle.
 * @returns A promise that resolves to an array of Bid objects.
 */
export const fetchBidHistory = async (vehicleId: string): Promise<Bid[]> => {
    const response = await apiClient.get(`/cars/${vehicleId}/bids`);
    return response.data;
};

/**
 * Posts a new bid for a specific vehicle.
 * @param vehicleId The ID of the vehicle.
 * @param amount The amount of the bid.
 * @returns A promise that resolves to the newly created Bid object.
 */
export const postNewBid = async ({ vehicleId, amount }: { vehicleId: string, amount: number }): Promise<Bid> => {
    const response = await apiClient.post(`/cars/${vehicleId}/bids`, { amount });
    return response.data;
};


export default apiClient;
