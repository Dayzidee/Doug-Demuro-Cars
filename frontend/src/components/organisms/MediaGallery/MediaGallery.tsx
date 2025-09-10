import { useState, useMemo, useEffect } from 'react';
import Lightbox from '../../molecules/Lightbox/Lightbox';

type MediaItem = {
  url: string;
  type: 'exterior' | 'interior';
};

interface MediaGalleryProps {
  media: MediaItem[];
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ media }) => {
  const [filter, setFilter] = useState<'all' | 'exterior' | 'interior'>('all');

  const filteredImages = useMemo(() => {
    if (filter === 'all') return media;
    return media.filter(item => item.type === filter);
  }, [media, filter]);

  const [selectedImage, setSelectedImage] = useState(filteredImages[0] || null);

  useEffect(() => {
    // When the filter changes, reset the selected image to the first in the new list
    setSelectedImage(filteredImages[0] || null);
  }, [filter, filteredImages]);

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxStartIndex, setLightboxStartIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxStartIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const TabButton = ({ tabName, label }: { tabName: 'all' | 'exterior' | 'interior', label: string }) => (
    <button
      onClick={() => setFilter(tabName)}
      className={`px-lg py-sm font-bold transition-colors text-lg ${filter === tabName ? 'border-b-2 border-secondary-golden-yellow text-white' : 'text-neutral-metallic-silver/70 hover:text-white'}`}
    >
        {label}
    </button>
  );

  if (!media || media.length === 0) {
    return <div className="bg-glass p-sm rounded-xl border border-glass">No images available.</div>;
  }

  return (
    <>
      <div className="bg-glass p-lg rounded-xl border border-glass">
        {/* Main Image Viewer */}
        <div className="mb-md aspect-video cursor-pointer group relative overflow-hidden rounded-lg" onClick={() => openLightbox(filteredImages.findIndex(img => img.url === selectedImage?.url))}>
          {selectedImage ? (
            <>
              <img
                src={selectedImage.url}
                alt="Selected vehicle image"
                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white font-bold text-lg">View Gallery</p>
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-backgrounds-card flex items-center justify-center">
              <p className="text-neutral-metallic-silver/70">No image selected</p>
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="border-b border-glass mb-md">
            <nav className="-mb-px flex space-x-lg" aria-label="Tabs">
                <TabButton tabName="all" label="All" />
                <TabButton tabName="exterior" label="Exterior" />
                <TabButton tabName="interior" label="Interior" />
            </nav>
        </div>

        {/* Thumbnail Strip */}
        <div className="flex space-x-sm overflow-x-auto pb-sm">
          {filteredImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(image)}
              className={`flex-shrink-0 w-24 h-16 rounded-md overflow-hidden border-2 transition-colors ${selectedImage?.url === image.url ? 'border-secondary-golden-yellow' : 'border-transparent hover:border-secondary-golden-yellow/50'}`}
            >
              <img
                src={image.url}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {isLightboxOpen && (
        <Lightbox
          images={filteredImages}
          startIndex={lightboxStartIndex}
          onClose={closeLightbox}
        />
      )}
    </>
  );
};

export default MediaGallery;
