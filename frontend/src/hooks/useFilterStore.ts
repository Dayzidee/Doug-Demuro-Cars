import { create } from 'zustand';

// Define the shape of the filter state and the actions to modify it
interface FilterState {
  make: string;
  model: string;
  priceRange: [number, number];
  yearRange: [number, number];
  bodyTypes: string[];
  fuelTypes: string[];
  sort: string;

  // Actions to update the state
  setMake: (make: string) => void;
  setModel: (model: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setYearRange: (range: [number, number]) => void;
  toggleBodyType: (bodyType: string) => void;
  toggleFuelType: (fuelType: string) => void;
  setSort: (sort: string) => void;

  // A comprehensive reset action
  resetFilters: () => void;
}

// Define the initial state for the filters
const initialState = {
  make: '',
  model: '',
  priceRange: [0, 200000] as [number, number],
  yearRange: [2000, new Date().getFullYear()] as [number, number],
  bodyTypes: [],
  fuelTypes: [],
  sort: 'price_asc', // Default sort order
};

// Create the Zustand store
export const useFilterStore = create<FilterState>((set) => ({
  ...initialState,

  setMake: (make) => set({ make }),
  setModel: (model) => set({ model }),
  setPriceRange: (range) => set({ priceRange: range }),
  setYearRange: (range) => set({ yearRange: range }),
  setSort: (sort) => set({ sort }),

  toggleBodyType: (bodyType) =>
    set((state) => ({
      bodyTypes: state.bodyTypes.includes(bodyType)
        ? state.bodyTypes.filter((bt) => bt !== bodyType)
        : [...state.bodyTypes, bodyType],
    })),

  toggleFuelType: (fuelType) =>
    set((state) => ({
      fuelTypes: state.fuelTypes.includes(fuelType)
        ? state.fuelTypes.filter((ft) => ft !== fuelType)
        : [...state.fuelTypes, fuelType],
    })),

  resetFilters: () => set(initialState),
}));
