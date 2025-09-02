import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../../molecules/SearchBar/SearchBar';

const HeroSection = () => {
  return (
    <section className="relative flex items-center justify-center h-screen text-white">
      {/* Video Background */}
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

      {/* Gradient Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-primary-deep-blue/80 to-transparent z-[1]"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center p-lg text-center w-full">
        <h1 className="font-heading text-hero uppercase">
          Drive Your Future Today
        </h1>
        <p className="mt-md text-body-lg max-w-3xl">
          Discover premium vehicles with transparent pricing. Your next great ride is just a click away.
        </p>

        <SearchBar />

        <div className="mt-lg flex flex-wrap justify-center gap-md">
          <Link to="/inventory?type=new" className="px-lg py-sm font-bold rounded-lg bg-primary-gradient text-white hover:opacity-90 transition-opacity transform hover:scale-105">
            Shop New Cars
          </Link>
          <Link to="/inventory?type=used" className="px-lg py-sm font-bold rounded-lg bg-secondary-gradient text-white hover:opacity-90 transition-opacity transform hover:scale-105">
            Shop Used Cars
          </Link>
          <Link to="/sell" className="px-lg py-sm font-bold rounded-lg bg-transparent border-2 border-white text-white hover:bg-white/10 transition-all transform hover:scale-105">
            Sell Your Car
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
