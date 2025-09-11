# Instructions for Adding Vehicle Images

Hello! This guide will walk you through how to add the real images for each vehicle to the website.

I have prepared the necessary files so that you only need to edit one file to make all the images appear correctly across the gallery, the vehicle detail pages, and the vehicle list cards.

## Step 1: Place Your Images

-   Place all your vehicle images inside the **`frontend/public/images/`** directory.
-   You can create subdirectories inside `images` if you like, to keep things organized (e.g., `frontend/public/images/camry/`, `frontend/public/images/x5/`, etc.).

## Step 2: Edit the Mock Data File

-   The only file you need to edit is: **`frontend/src/data/mockVehicleData.ts`**.

## Step 3: Update the `media` Array for Each Vehicle

Inside `mockVehicleData.ts`, you will see a list of vehicle objects. Each object has a `media` property, which is an array. You need to fill this array for each vehicle.

Each item in the `media` array must be an object with two properties:
-   `url`: The path to your image, starting with a `/`. This path is relative to the `public` directory.
    -   **Example**: If your image is at `frontend/public/images/camry/camry_front.jpg`, the `url` would be `'/images/camry/camry_front.jpg'`.
-   `type`: This must be either `'exterior'` or `'interior'`. This is important for the filtering tabs in the image gallery.

### Example for one vehicle:

```javascript
// ...
  {
    id: 'VIN001',
    make: 'Toyota',
    model: 'Camry',
    // ... other properties
    media: [
      // === Replace these with your actual image paths ===
      { url: '/images/camry/camry_front_view.jpg', type: 'exterior' },
      { url: '/images/camry/camry_side_view.jpg', type: 'exterior' },
      { url: '/images/camry/camry_rear_view.jpg', type: 'exterior' },
      { url: '/images/camry/camry_dashboard.jpg', type: 'interior' },
      { url: '/images/camry/camry_seats.jpg', type: 'interior' },
      // ... add as many images as you have for this car.
    ],
  },
// ...
```

**Important Note:** The first image in the `media` array that has the type `'exterior'` will be used as the main "hero" image on the homepage and inventory lists.

---

Once you have updated the `media` array for all the vehicles in this file, the website will automatically display the correct images in all the relevant sections.

If you have any questions, please let me know!
