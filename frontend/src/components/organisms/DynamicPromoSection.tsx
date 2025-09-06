import React from 'react';
import { Link } from 'react-router-dom';

// Define the type for a single offer, based on the backend schema
interface Offer {
  id: string;
  title: string;
  description?: string;
  promo_type: 'deal' | 'featured_vehicle' | 'seasonal_offer';
}

// Using static placeholder data for now to focus on styling
const placeholderOffers: Offer[] = [
  { id: '1', title: 'Summer Sale Event', description: 'Up to 20% off on selected sports cars. Don\'t miss out!', promo_type: 'seasonal_offer' },
  { id: '2', title: 'Featured: Porsche 911', description: 'A stunning example of a modern classic. Bid now or buy it now.', promo_type: 'featured_vehicle' },
  { id: '3', title: '0% APR Financing', description: 'Special financing options available for qualified buyers this month.', promo_type: 'deal' },
];

const DynamicPromoSection: React.FC = () => {
  const offers = placeholderOffers; // Using static data

  if (offers.length === 0) {
    return null;
  }

  return (
    <section className="py-2xl bg-glass border-y border-glass">
      <div className="container mx-auto">
        <h2 className="text-h2 font-heading uppercase text-center mb-xl">
          Current <span className="bg-clip-text text-transparent bg-secondary-gradient">Promotions</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          {offers.map((offer) => (
            <div key={offer.id} className="bg-glass/50 border border-glass rounded-xl p-lg flex flex-col transform hover:-translate-y-2 transition-transform duration-300">
              <span className="bg-secondary-gradient text-xs font-bold px-sm py-xs rounded-full self-start mb-md uppercase tracking-wider">{offer.promo_type.replace('_', ' ')}</span>
              <h3 className="text-h4 font-heading text-secondary-golden-yellow mb-sm">{offer.title}</h3>
              <p className="text-body text-neutral-metallic-silver/80 mb-md flex-grow">{offer.description}</p>
              <div className="mt-auto pt-md border-t border-glass">
                <Link to={`/promos/${offer.id}`} className="text-secondary-golden-yellow hover:text-white font-bold flex items-center transition-colors">
                  <span>Learn More</span>
                  <span className="ml-2">&rarr;</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DynamicPromoSection;
