import React from 'react';
import AuctionCard, { AuctionItem } from '../../molecules/AuctionCard/AuctionCard';
import { mockVehicleData } from '../../../data/mockVehicleData';

// Create placeholder auction data by extending mock vehicle data
const auctionItems: AuctionItem[] = mockVehicleData.slice(0, 6).map((vehicle, index) => ({
  ...vehicle,
  currentBid: vehicle.price + (index * 1500),
  timeLeft: `${index + 1}d ${index * 2}h ${index * 15}m`,
}));

const AuctionsPage = () => {
  return (
    <div className="container mx-auto py-xl">
      <div className="text-center mb-xl">
        <h1 className="text-h1 font-heading uppercase">
          Live <span className="bg-clip-text text-transparent bg-secondary-gradient">Auctions</span>
        </h1>
        <p className="text-body-lg text-neutral-metallic-silver/80 mt-md max-w-3xl mx-auto">
          Join the excitement and place your bids on these exclusive vehicles. Auctions are ending soon!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
        {auctionItems.map(item => (
          <AuctionCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default AuctionsPage;
