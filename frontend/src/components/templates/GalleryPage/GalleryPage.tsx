import FullGallery from '../../organisms/FullGallery';

const GalleryPage: React.FC = () => {
  return (
    <div className="container mx-auto py-xl">
      <div className="text-center mb-xl">
        <h1 className="text-h1 font-heading uppercase">
          Image <span className="bg-clip-text text-transparent bg-primary-gradient">Gallery</span>
        </h1>
        <p className="text-body-lg text-neutral-metallic-silver/80 mt-md max-w-3xl mx-auto">
          Explore our collection of stunning vehicle images.
        </p>
      </div>
      <FullGallery />
    </div>
  );
};

export default GalleryPage;
