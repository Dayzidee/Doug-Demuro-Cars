export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  transmission: string;
  fuelType: string;
  media: { url: string; type: 'exterior' | 'interior' }[];
}

const generateMedia = (make: string, model: string, count: number): { url: string; type: 'exterior' | 'interior' }[] => {
    const media = [];
    const modelPath = model.replace(/\s+/g, '-');
    for (let i = 1; i <= count; i++) {
        const type = i <= 5 ? 'exterior' : 'interior';
        media.push({
            url: `/images/vehicles/${make}_${modelPath}_${i.toString().padStart(2, '0')}_${type}.jpg`,
            type: type
        });
    }
    return media;
};

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
    media: generateMedia('Toyota', 'Camry', 10),
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
    media: generateMedia('Honda', 'CR-V', 10),
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
    media: generateMedia('Ford', 'F-150', 10),
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
    media: generateMedia('Tesla', 'Model-3', 10),
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
    media: generateMedia('BMW', 'X5', 10),
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
    media: generateMedia('Audi', 'A4', 10),
  }
];
