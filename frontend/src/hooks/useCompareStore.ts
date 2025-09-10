import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CompareState {
  vehicleIds: string[];
  addVehicle: (id: string) => void;
  removeVehicle: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      vehicleIds: [],
      addVehicle: (id) => {
        const { vehicleIds } = get();
        if (vehicleIds.length < 4 && !vehicleIds.includes(id)) {
          set({ vehicleIds: [...vehicleIds, id] });
        }
      },
      removeVehicle: (id) => {
        set((state) => ({
          vehicleIds: state.vehicleIds.filter((vehicleId) => vehicleId !== id),
        }));
      },
      clearCompare: () => {
        set({ vehicleIds: [] });
      },
      isInCompare: (id) => {
        const { vehicleIds } = get();
        return vehicleIds.includes(id);
      },
    }),
    {
      name: 'compare-storage', // name of the item in the storage (must be unique)
    }
  )
);
