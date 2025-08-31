import { create } from 'zustand';

// Define the shape of the filter state and the actions to modify it
interface FilterState {
  make: string;
  model: string;
  priceMax: number | null;
  bodyTypes: string[];
  fuelTypes: string[];

  // Actions to update the state
  setMake: (make: string) => void;
  setModel: (model: string) => void;
  setPriceMax: (price: number | null) => void;
  toggleBodyType: (bodyType: string) => void;
  toggleFuelType: (fuelType: string) => void;

  // A comprehensive reset action
  resetFilters: () => void;
}

// Define the initial state for the filters
const initialState = {
  make: '',
  model: '',
  priceMax: null,
  bodyTypes: [],
  fuelTypes: [],
};

// Create the Zustand store
export const useFilterStore = create<FilterState>((set) => ({
  ...initialState,

  setMake: (make) => set({ make }),
  setModel: (model) => set({ model }),
  setPriceMax: (price) => set({ priceMax: price }),

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
