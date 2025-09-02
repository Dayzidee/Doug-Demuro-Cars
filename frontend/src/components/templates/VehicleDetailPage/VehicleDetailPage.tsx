import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchVehicleById, Vehicle } from '../../../services/api';
import Bidding from '../../organisms/Bidding/Bidding';
import MediaGallery from '../../organisms/MediaGallery/MediaGallery';
import InstallmentCalculator from '../../molecules/InstallmentCalculator';

// Helper component to display a single detail item
const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="py-sm border-b border-glass last:border-b-0">
    <p className="text-sm font-semibold text-neutral-metallic-silver/70 uppercase tracking-caption">{label}</p>
    <p className="text-md text-neutral-metallic-silver mt-xs">{value || 'N/A'}</p>
  </div>
);

// Skeleton Loader for the VDP
const VDPSkeleton = () => (
  <div className="container mx-auto py-xl animate-pulse">
    <div className="h-12 bg-glass rounded-md w-3/4 mb-md"></div>
    <div className="h-8 bg-glass rounded-md w-1/4 mb-xl"></div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
      <div className="lg:col-span-2 space-y-lg">
        <div className="bg-glass rounded-xl h-96"></div>
        <div className="bg-glass rounded-xl h-64"></div>
      </div>
      <div className="lg:col-span-1 space-y-lg">
        <div className="bg-glass rounded-xl h-80"></div>
        <div className="bg-glass rounded-xl h-48"></div>
      </div>
    </div>
  </div>
);

// Assuming the Vehicle type will be updated to include these fields
type VehicleWithDetails = Vehicle & {
  media?: { url: string }[];
  highlights?: string[];
  seller_notes?: string;
  known_flaws?: string;
  interior_color?: string;
  engine?: string;
};

const VehicleDetailPage = () => {
    const { id } = useParams<{ id: string }>();

    const { data: vehicle, isLoading, error, isError } = useQuery<VehicleWithDetails>({
        queryKey: ['vehicle', id],
        queryFn: () => fetchVehicleById(id!),
        enabled: !!id,
    });

    if (isLoading) return <VDPSkeleton />;

    if (isError) {
        return <div className="container mx-auto py-xl text-center text-red-400">Error: {error.message}</div>;
    }

    if (!vehicle) {
        return <div className="container mx-auto py-xl text-center">Vehicle not found.</div>;
    }

    // Placeholder data for the gallery until the API provides it
    const placeholderImages = [
        { url: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
        { url: 'https://images.pexels.com/photos/2127733/pexels-photo-2127733.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
        { url: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
        { url: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    ];

    const media = vehicle.media || placeholderImages;
    const heroImageUrl = vehicle.hero_image_url || media[0]?.url || `https://via.placeholder.com/1200x600.png/0D1B2A/E5E5E5?text=${vehicle.year}+${vehicle.make}+${vehicle.model}`;

    return (
        <div className="container mx-auto py-xl">
            <div className="mb-lg">
                <h1 className="text-h1 font-heading uppercase">{vehicle.year} {vehicle.make} {vehicle.model}</h1>
                <p className="text-h3 font-accent text-secondary-golden-yellow">${vehicle.price.toLocaleString()}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
                <div className="lg:col-span-2 space-y-lg">
                    <MediaGallery images={media} heroImageUrl={heroImageUrl} />

                    <div className="bg-glass p-lg rounded-xl border border-glass">
                        <h2 className="text-h3 font-heading mb-md">Financing Calculator</h2>
                        <InstallmentCalculator />
                    </div>

                    <Bidding vehicleId={vehicle.id} />
                </div>

                <div className="lg:col-span-1 space-y-lg">
                    <div className="bg-glass p-lg rounded-xl border border-glass space-y-md">
                        <button className="w-full bg-primary-gradient text-white font-bold py-sm rounded-lg hover:opacity-90 transition-opacity">
                            Buy Now
                        </button>
                        <button className="w-full bg-secondary-gradient text-white font-bold py-sm rounded-lg hover:opacity-90 transition-opacity">
                            Make an Offer
                        </button>
                    </div>

                    <div className="bg-glass p-lg rounded-xl border border-glass">
                        <h2 className="text-h3 font-heading mb-md border-b border-glass pb-sm">Key Details</h2>
                        <div className="grid grid-cols-2 gap-md">
                            <DetailItem label="Mileage" value={`${vehicle.mileage.toLocaleString()} mi`} />
                            <DetailItem label="Fuel Type" value={vehicle.fuel_type} />
                            <DetailItem label="Transmission" value={vehicle.transmission} />
                            <DetailItem label="Body Type" value={vehicle.body_type} />
                            <DetailItem label="Exterior Color" value={vehicle.exterior_color} />
                            <DetailItem label="Interior Color" value={vehicle.interior_color} />
                            <DetailItem label="Engine" value={vehicle.engine} />
                            <DetailItem label="VIN" value={vehicle.vin} />
                        </div>
                    </div>

                    <div className="bg-glass p-lg rounded-xl border border-glass">
                        <h2 className="text-h3 font-heading mb-md border-b border-glass pb-sm">Highlights</h2>
                        <ul className="list-disc list-inside space-y-xs text-neutral-metallic-silver/90 pl-sm">
                            {vehicle.highlights?.length ? vehicle.highlights.map((h, i) => <li key={i}>{h}</li>) : <li>No highlights provided.</li>}
                        </ul>
                    </div>

                    <div className="bg-glass p-lg rounded-xl border border-glass">
                        <h2 className="text-h3 font-heading mb-md border-b border-glass pb-sm">Condition</h2>
                        <DetailItem label="Seller Notes" value={vehicle.seller_notes} />
                        <DetailItem label="Known Flaws" value={vehicle.known_flaws} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleDetailPage;
