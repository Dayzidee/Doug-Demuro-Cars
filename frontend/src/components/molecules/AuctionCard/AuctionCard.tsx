import { Link } from 'react-router-dom';
import { Vehicle } from '../../../services/api';
import { Heart, GitCompareArrows, Timer } from 'lucide-react';
import { useCompareStore } from '../../../hooks/useCompareStore';
import { useCountdown } from '../../../hooks/useCountdown';

export type AuctionItem = Vehicle & {
  currentBid: number;
  endDate: Date;
};

interface AuctionCardProps {
  item: AuctionItem;
}

const CountdownTimer = ({ endDate }: { endDate: Date }) => {
    const { days, hours, minutes, seconds, isFinished } = useCountdown(endDate);

    if (isFinished) {
        return <span className="text-red-400">Auction Ended</span>;
    }

    return (
        <div className="flex items-center space-x-1">
            <Timer size={16} className="flex-shrink-0" />
            <span>{`${days}d ${hours}h ${minutes}m ${seconds}s`}</span>
        </div>
    );
};

const AuctionCard: React.FC<AuctionCardProps> = ({ item }) => {
  const { id, year, make, model, hero_image_url } = item;

  const { addVehicle, removeVehicle, isInCompare } = useCompareStore();
  const isComparing = isInCompare(id);

  const handleCompareClick = () => {
    if (isComparing) {
      removeVehicle(id);
    } else {
      addVehicle(id);
    }
  };

  const imageUrl = hero_image_url || `https://via.placeholder.com/400x300.png/0D1B2A/E5E5E5?text=${year}+${make}+${model}`;

  return (
    <div className="bg-backgrounds-card border border-glass rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out group flex flex-col hover:shadow-primary-electric-cyan/20 hover:border-primary-electric-cyan/50 hover:-translate-y-2 hover:rotate-[-1deg]">
      <div className="relative overflow-hidden">
        <img loading="lazy" src={imageUrl} alt={`${year} ${make} ${model}`} className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110" />
        <div className="absolute top-0 left-0 bg-primary-deep-blue/50 text-white text-sm font-bold px-md py-sm rounded-br-xl backdrop-blur-sm">
          <CountdownTimer endDate={item.endDate} />
        </div>
      </div>
      <div className="p-md flex flex-col flex-grow">
        <h3 className="text-h4 font-heading">{year} {make} {model}</h3>
        <div className="mt-auto pt-md">
            <p className="text-sm text-neutral-metallic-silver/70">Current Bid</p>
            <p className="font-accent text-3xl font-bold text-secondary-golden-yellow">
            ${item.currentBid.toLocaleString()}
            </p>
            <div className="mt-md flex items-center gap-2">
                <Link to={`/auctions/${id}`} className="block text-center w-full px-md py-sm font-bold rounded-lg bg-primary-gradient text-white hover:opacity-90 transition-opacity transform hover:scale-105">
                    View Auction
                </Link>
                <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white">
                    <Heart size={20} />
                </button>
                <button
                  onClick={handleCompareClick}
                  className={`p-2 rounded-lg transition-colors text-white ${isComparing ? 'bg-primary-electric-cyan' : 'bg-white/10 hover:bg-white/20'}`}
                  aria-label={isComparing ? 'Remove from comparison' : 'Add to comparison'}
                >
                    <GitCompareArrows size={20} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;
