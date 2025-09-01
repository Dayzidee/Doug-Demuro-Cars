import React, { useState, useEffect } from 'react';

interface Offer {
  id: string;
  title: string;
  description?: string;
  promo_type: 'deal' | 'featured_vehicle' | 'seasonal_offer';
}

const DynamicPromoSection: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/v1/offers');
        if (!response.ok) {
          throw new Error('Failed to fetch promotions');
        }
        const data = await response.json();
        setOffers(data);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError('An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  if (loading) {
    return <div className="text-center p-8">Loading Promotions...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  }

  if (offers.length === 0) {
    return null;
  }

  return (
    <section id="promotions" className="py-12 md:py-16 bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-8">Current Promotions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer) => (
            <div key={offer.id} className="bg-gray-900 rounded-lg shadow-xl p-6 text-white flex flex-col transform hover:-translate-y-2 transition-transform duration-300">
              <span className="bg-blue-600 text-xs font-semibold px-2 py-1 rounded-full self-start mb-4 uppercase tracking-wider">{offer.promo_type.replace('_', ' ')}</span>
              <h3 className="text-xl font-bold text-blue-400 mb-2">{offer.title}</h3>
              <p className="text-gray-300 mb-4 flex-grow">{offer.description}</p>
              <div className="mt-auto pt-4 border-t border-gray-700">
                <a href="#" className="text-yellow-400 hover:text-yellow-300 font-semibold flex items-center">
                  <span>Learn More</span>
                  <span className="ml-2">&rarr;</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DynamicPromoSection;
