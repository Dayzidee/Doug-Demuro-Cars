import { Link } from 'react-router-dom';
import { Vehicle } from '../../../services/api';

export type AuctionItem = Vehicle & {
  currentBid: number;
  timeLeft: string;
};

interface AuctionCardProps {
  item: AuctionItem;
}

const AuctionCard: React.FC<AuctionCardProps> = ({ item }) => {
  const imageUrl = item.hero_image_url || `https://via.placeholder.com/400x300.png/0D1B2A/E5E5E5?text=${item.year}+${item.make}+${item.model}`;

  return (
    <div className="bg-glass border border-glass rounded-xl shadow-lg overflow-hidden flex flex-col h-full transform hover:-translate-y-2 transition-transform duration-300">
      <div className="relative">
        <img loading="lazy" src={imageUrl} alt={`${item.year} ${item.make} ${item.model}`} className="w-full h-56 object-cover" />
        <div className="absolute top-0 left-0 bg-primary-deep-blue/50 text-white text-sm font-bold px-md py-sm rounded-br-xl backdrop-blur-sm">
          {item.timeLeft}
        </div>
      </div>
      <div className="p-md flex flex-col flex-grow">
        <h3 className="text-h4 font-heading">{item.year} {item.make} {item.model}</h3>
        <div className="mt-auto pt-md">
            <p className="text-sm text-neutral-metallic-silver/70">Current Bid</p>
            <p className="font-accent text-3xl font-bold text-secondary-golden-yellow">
            ${item.currentBid.toLocaleString()}
            </p>
            <Link to={`/auctions/${item.id}`} className="block text-center mt-md w-full px-md py-sm font-bold rounded-lg bg-primary-gradient text-white hover:opacity-90 transition-opacity">
                View Auction
            </Link>
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;
