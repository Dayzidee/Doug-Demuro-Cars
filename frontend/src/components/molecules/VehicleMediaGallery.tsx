import React, { useState, useEffect } from 'react';

interface Media {
  id: string;
  url: string;
  alt_text?: string;
}

interface VehicleMediaGalleryProps {
  media: Media[];
  default_alt_text: string;
}

const VehicleMediaGallery: React.FC<VehicleMediaGalleryProps> = ({ media, default_alt_text }) => {
  // Find the primary image or default to the first one
  const initialImage = media.find(m => (m as any).is_primary) || media[0] || null;
  const [selectedImage, setSelectedImage] = useState<Media | null>(initialImage);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Update selected image if media prop changes
  useEffect(() => {
    const newInitialImage = media.find(m => (m as any).is_primary) || media[0] || null;
    setSelectedImage(newInitialImage);
  }, [media]);

  if (!media || media.length === 0) {
    return <div className="p-8 text-center bg-gray-700 rounded-lg">No media available for this vehicle.</div>;
  }

  const handleThumbnailClick = (image: Media) => {
    setSelectedImage(image);
  };

  const openLightbox = () => {
    if (selectedImage) {
      setIsLightboxOpen(true);
    }
  };

  return (
    <div>
      {/* Main Image Display */}
      <div className="mb-4 relative group cursor-pointer bg-gray-900 rounded-lg overflow-hidden" onClick={openLightbox}>
        <img
          src={selectedImage?.url}
          alt={selectedImage?.alt_text || default_alt_text}
          className="w-full h-auto max-h-[60vh] object-contain rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white text-xl font-bold border-2 border-white rounded-full px-4 py-2">View Larger</span>
        </div>
      </div>

      {/* Thumbnail Strip */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
        {media.map((item) => (
          <div
            key={item.id}
            className={`cursor-pointer rounded-md overflow-hidden border-2 transition-all ${selectedImage?.id === item.id ? 'border-blue-500 scale-105' : 'border-transparent hover:border-gray-500'}`}
            onClick={() => handleThumbnailClick(item)}
          >
            <img src={item.url} alt={item.alt_text || 'Vehicle thumbnail'} className="w-full h-20 object-cover" />
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <img
            src={selectedImage.url}
            alt={selectedImage.alt_text || default_alt_text}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
          />
           <button className="absolute top-4 right-4 text-white text-3xl font-bold">&times;</button>
        </div>
      )}
    </div>
  );
};

export default VehicleMediaGallery;
