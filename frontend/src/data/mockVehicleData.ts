/*
* =================================================================
* INSTRUCTIONS FOR MANUALLY ADDING VEHICLE IMAGES
* =================================================================
*
* Hello! To add the real images for each vehicle, please follow the instructions below.
*
* 1.  **File Location**: All your images should be placed inside the `frontend/public/images/` directory. You can create subdirectories if you like (e.g., `frontend/public/images/camry/`).
*
* 2.  **Edit the `media` Array**: For each vehicle in the `mockVehicleData` array below, you need to edit the `media` property.
*
* 3.  **`media` Array Format**: The `media` array should contain a list of objects. Each object has two properties:
*     - `url`: The path to the image, starting from the `public` directory. For example, if your image is at `frontend/public/images/my-car.jpg`, the url should be `/images/my-car.jpg`.
*     - `type`: This should be either `'exterior'` or `'interior'`. This is used to filter the images in the gallery.
*
* 4.  **Example**: I have filled out the first vehicle (`Toyota Camry`) with an example structure. You can replace these paths with your real image paths. For the other vehicles, I have left the `media` array empty for you to fill in.
*
*/

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
    media: [
      // === EXAMPLE FOR TOYOTA CAMRY ===
      // Replace these paths with the actual paths to your images.
      // The first exterior image will be used as the main "hero" image on the list pages.
      { url: '/images/your_camry_image_1_exterior.jpg', type: 'exterior' },
      { url: '/images/your_camry_image_2_exterior.jpg', type: 'exterior' },
      { url: '/images/your_camry_image_3_interior.jpg', type: 'interior' },
      // ...add as many images as you have for this car.
    ],
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
    media: [
        // TODO: Add media for Honda CR-V
    ],
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
    media: [
        // TODO: Add media for Ford F-150
    ],
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
    media: [
        // TODO: Add media for Tesla Model 3
    ],
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
    media: [
        // TODO: Add media for BMW X5
    ],
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
    media: [
        // TODO: Add media for Audi A4
    ],
  }
];
