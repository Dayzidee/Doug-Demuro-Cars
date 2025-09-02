import React from 'react';
import { Link } from 'react-router-dom';

// Using static placeholder data for now to focus on styling
const placeholderImages = [
  { id: '1', url: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', alt_text: 'White BMW' },
  { id: '2', url: 'https://images.pexels.com/photos/919073/pexels-photo-919073.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', alt_text: 'Black Mercedes' },
  { id: '3', url: 'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', alt_text: 'Red Ferrari' },
  { id: '4', url: 'https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', alt_text: 'Grey Audi' },
];

const GalleryPreview: React.FC = () => {
  return (
    <section className="py-2xl">
      <div className="container mx-auto">
        <h2 className="text-h2 font-heading uppercase text-center mb-xl">From Our <span className="bg-clip-text text-transparent bg-secondary-gradient">Gallery</span></h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
          {placeholderImages.map((image) => (
            <div key={image.id} className="group overflow-hidden rounded-xl aspect-video border-2 border-transparent hover:border-secondary-golden-yellow transition-all duration-300">
              <img
                src={image.url}
                alt={image.alt_text || 'Vehicle showcase'}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300 ease-in-out"
                loading="lazy"
              />
            </div>
          ))}
        </div>
        <div className="text-center mt-xl">
          <Link
            to="/gallery"
            className="inline-block bg-primary-gradient hover:opacity-90 text-white font-bold py-sm px-lg rounded-lg transition-opacity"
          >
            View Full Gallery
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GalleryPreview;
