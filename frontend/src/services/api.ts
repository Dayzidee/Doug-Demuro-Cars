import axios from 'axios';

// Define the structure of a Vehicle object for the frontend
export interface Vehicle {
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

/**
 * Fetches a list of featured vehicles from the backend API.
 * @returns A promise that resolves to an array of Vehicle objects.
 */
export const fetchFeaturedVehicles = async (): Promise<Vehicle[]> => {
  const response = await apiClient.get('/inventory/featured');
  return response.data;
};

/**
 * Creates a new vehicle listing by sending the form data to the backend API.
 * @param listingData The data for the new listing.
 * @returns A promise that resolves to the newly created Vehicle object.
 */
export const createListing = async (listingData: any): Promise<Vehicle> => {
  const response = await apiClient.post('/cars/sell', listingData);
  return response.data;
};


export default apiClient;
