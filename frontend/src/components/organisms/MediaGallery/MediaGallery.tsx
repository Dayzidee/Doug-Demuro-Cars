import { useState } from 'react';
import Lightbox from '../../molecules/Lightbox/Lightbox';

interface MediaItem {
  url: string;
  alt_text?: string;
}

interface MediaGalleryProps {
  images: MediaItem[];
  heroImageUrl: string;
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ images, heroImageUrl }) => {
  // Combine hero image with other images, ensuring no duplicates and that hero is first
  const imageSet = new Set([heroImageUrl, ...images.map(i => i.url)]);
  const allImages = Array.from(imageSet).map((url, index) => ({
    url,
    alt_text: images.find(i => i.url === url)?.alt_text || `Vehicle Image ${index + 1}`
  }));

  const [selectedImage, setSelectedImage] = useState(allImages[0] || { url: heroImageUrl, alt_text: 'Primary vehicle image' });

  // State for the lightbox
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxStartIndex, setLightboxStartIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxStartIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  if (!allImages || allImages.length === 0) {
    return <div className="bg-glass p-sm rounded-xl border border-glass">No images available.</div>;
  }

  return (
    <>
      <div className="bg-glass p-sm rounded-xl border border-glass">
        {/* Main Image Viewer */}
        <div className="mb-md aspect-video cursor-pointer group relative overflow-hidden rounded-lg" onClick={() => openLightbox(allImages.findIndex(img => img.url === selectedImage.url))}>
          <img
            src={selectedImage.url}
            alt={selectedImage.alt_text || 'Selected vehicle image'}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
           <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="text-white font-bold text-lg">View Gallery</p>
          </div>
        </div>

        {/* Thumbnail Strip */}
        <div className="flex space-x-sm overflow-x-auto pb-sm">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(image)}
              className={`flex-shrink-0 w-24 h-16 rounded-md overflow-hidden border-2 transition-colors ${selectedImage.url === image.url ? 'border-secondary-golden-yellow' : 'border-transparent hover:border-secondary-golden-yellow/50'}`}
            >
              <img
                src={image.url}
                alt={image.alt_text || `Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {isLightboxOpen && (
        <Lightbox
          images={allImages}
          startIndex={lightboxStartIndex}
          onClose={closeLightbox}
        />
      )}
    </>
  );
};

export default MediaGallery;
