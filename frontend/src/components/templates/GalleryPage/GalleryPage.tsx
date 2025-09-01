import React from 'react';
import FullGallery from '../../organisms/FullGallery';

const GalleryPage: React.FC = () => {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <header className="bg-gray-800 p-6 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold">Image Gallery</h1>
          <p className="text-gray-300 mt-2">Explore our collection of vehicle images. Use the filters to narrow your search.</p>
        </div>
      </header>
      <main className="p-4 md:p-8">
        <FullGallery />
      </main>
    </div>
  );
};

export default GalleryPage;
