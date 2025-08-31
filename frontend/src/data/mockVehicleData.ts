export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  transmission: string;
  fuelType: string;
  imageUrl: string;
}

export const mockVehicleData: Vehicle[] = [
  {
    id: 'VIN001',
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    price: 25000,
    mileage: 15000,
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    imageUrl: 'https://placehold.co/400x300/1E293B/FFFFFF/png?text=Toyota+Camry',
  },
  {
    id: 'VIN002',
    make: 'Honda',
    model: 'CR-V',
    year: 2021,
    price: 28000,
    mileage: 25000,
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    imageUrl: 'https://placehold.co/400x300/475569/FFFFFF/png?text=Honda+CR-V',
  },
  {
    id: 'VIN003',
    make: 'Ford',
    model: 'F-150',
    year: 2023,
    price: 45000,
    mileage: 5000,
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    imageUrl: 'https://placehold.co/400x300/1E293B/FFFFFF/png?text=Ford+F-150',
  },
  {
    id: 'VIN004',
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    price: 48000,
    mileage: 10000,
    transmission: 'Automatic',
    fuelType: 'Electric',
    imageUrl: 'https://placehold.co/400x300/475569/FFFFFF/png?text=Tesla+Model+3',
  },
  {
    id: 'VIN005',
    make: 'BMW',
    model: 'X5',
    year: 2020,
    price: 55000,
    mileage: 35000,
    transmission: 'Automatic',
    fuelType: 'Hybrid',
    imageUrl: 'https://placehold.co/400x300/1E293B/FFFFFF/png?text=BMW+X5',
  },
  {
    id: 'VIN006',
    make: 'Audi',
    model: 'A4',
    year: 2022,
    price: 42000,
    mileage: 18000,
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    imageUrl: 'https://placehold.co/400x300/475569/FFFFFF/png?text=Audi+A4',
  }
];
