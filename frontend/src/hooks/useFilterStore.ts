// src/hooks/useFilterStore.ts

import { create } from "zustand";

// Define the shape of the filter state and the actions to modify it
interface FilterState {
  make: string;
  model: string;
  priceRange: [number, number];
  yearRange: [number, number];
  bodyTypes: string[];
  fuelTypes: string[];

  // FIX 1: Add sortOrder to the state
  sortOrder: string;

  // Actions to update the state
  setMake: (make: string) => void;
  setModel: (model: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setYearRange: (range: [number, number]) => void;
  toggleBodyType: (bodyType: string) => void;
  toggleFuelType: (fuelType: string) => void;

  // FIX 2: Add an action to set the sortOrder
  setSortOrder: (order: string) => void;

  resetFilters: () => void;
}

// Define the initial state for the filters
const initialState = {
  make: "",
  model: "",
  priceRange: [0, 200000] as [number, number],
  yearRange: [2000, new Date().getFullYear()] as [number, number],
  bodyTypes: [],
  fuelTypes: [],
  // FIX 3: Set the default sortOrder
  sortOrder: "price_asc",
};

// Create the Zustand store
export const useFilterStore = create<FilterState>((set) => ({
  ...initialState,

  setMake: (make) => set({ make }),
  setModel: (model) => set({ model }),
  setPriceRange: (range) => set({ priceRange: range }),
  setYearRange: (range) => set({ yearRange: range }),

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

  // FIX 4: Implement the setSortOrder action
  setSortOrder: (order) => set({ sortOrder: order }),

  resetFilters: () => set(initialState),
}));

// The default export is often omitted when the hook is named `use...`
// export default useFilterStore;
