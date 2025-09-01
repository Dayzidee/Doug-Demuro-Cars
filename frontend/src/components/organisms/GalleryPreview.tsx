import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface VehicleMedia {
  id: string;
  url: string;
  alt_text?: string;
}

const GalleryPreview: React.FC = () => {
  const [images, setImages] = useState<VehicleMedia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreviewImages = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/v1/gallery/preview');
        if (!response.ok) {
          throw new Error('Failed to fetch gallery preview images');
        }
        const data = await response.json();
        setImages(data);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError('An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPreviewImages();
  }, []);

  if (loading) {
    return <div className="text-center p-8">Loading Gallery...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <section className="py-12 md:py-16 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">From Our Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="group overflow-hidden rounded-lg shadow-lg aspect-w-16 aspect-h-9">
              <img
                src={image.url}
                alt={image.alt_text || 'Vehicle showcase'}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300 ease-in-out"
                loading="lazy"
              />
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            to="/gallery"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300"
          >
            View Full Gallery
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GalleryPreview;
