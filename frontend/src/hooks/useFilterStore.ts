import { create } from 'zustand';

// Define the shape of the filter state and the actions to modify it
interface FilterState {
  make: string;
  model: string;
  yearMin: number | null;
  yearMax: number | null;
  priceMin: number | null;
  priceMax: number | null;

  // Actions to update the state
  setMake: (make: string) => void;
  setModel: (model: string) => void;
  setPriceMax: (price: number | null) => void;

  // A comprehensive reset action
  resetFilters: () => void;
}

// Define the initial state for the filters
const initialState = {
  make: '',
  model: '',
  yearMin: null,
  yearMax: null,
  priceMin: null,
  priceMax: null,
};

// Create the Zustand store
export const useFilterStore = create<FilterState>((set) => ({
  ...initialState,

  setMake: (make) => set({ make }),
  setModel: (model) => set({ model }),
  setPriceMax: (price) => set({ priceMax: price }),

  resetFilters: () => set(initialState),
}));
