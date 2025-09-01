import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../../molecules/SearchBar/SearchBar';

const HeroSection = () => {
  return (
    <section className="relative flex items-center justify-center h-screen text-white">
      <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-[1]" aria-hidden="true" />
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="https://videos.pexels.com/video-files/3130311/3130311-hd.mp4"
      >
        Your browser does not support the video tag.
      </video>
      <div className="relative z-10 flex flex-col items-center p-4 text-center w-full">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading uppercase tracking-wider text-shadow-lg">
          Drive Your Future Today
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-3xl text-shadow">
          Discover premium vehicles with transparent pricing. Your next great ride is just a click away.
        </p>

        <SearchBar />

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button className="px-8 py-3 font-semibold rounded-lg bg-primary-gradient text-white hover:opacity-90 transition-opacity transform hover:scale-105">
            Shop New Cars
          </button>
          <button className="px-8 py-3 font-semibold rounded-lg bg-secondary-gradient text-white hover:opacity-90 transition-opacity transform hover:scale-105">
            Shop Used Cars
          </button>
          <Link to="/sell" className="px-8 py-3 font-semibold rounded-lg bg-transparent border-2 border-white text-white hover:bg-white hover:text-charcoal transition-all transform hover:scale-105">
            Sell Your Car
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
