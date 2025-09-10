import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchVehicleById, VehicleDetail } from '../../../services/api';
import Bidding from '../../organisms/Bidding/Bidding';
import MediaGallery from '../../organisms/MediaGallery/MediaGallery';
import InstallmentCalculator from '../../molecules/InstallmentCalculator';
import { CheckCircle2, GitCompareArrows } from 'lucide-react';
import { useCompareStore } from '../../../hooks/useCompareStore';

// Helper component to display a single detail item
const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="py-sm border-b border-glass last:border-b-0">
    <p className="text-sm font-semibold text-neutral-metallic-silver/70 uppercase tracking-caption">{label}</p>
    <p className="text-md text-neutral-metallic-silver mt-xs">{value || 'N/A'}</p>
  </div>
);

// --- Skeleton Loader ---
const VDPSkeleton = () => (
  <div className="container mx-auto py-xl animate-pulse">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
      <div className="lg:col-span-2 space-y-lg">
        <div className="bg-glass rounded-xl h-[500px]"></div>
        <div className="bg-glass rounded-xl h-64"></div>
      </div>
      <div className="lg:col-span-1 space-y-lg">
        <div className="bg-glass rounded-xl h-96"></div>
      </div>
    </div>
  </div>
);

// --- Tabbed Content Components ---
const DetailsTab = ({ vehicle }: { vehicle: VehicleDetail }) => (
    <div className="space-y-md">
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
);

const ConditionTab = ({ vehicle }: { vehicle: VehicleDetail }) => (
    <div className="space-y-md">
        <DetailItem label="Seller Notes" value={vehicle.seller_notes} />
        <DetailItem label="Known Flaws" value={vehicle.known_flaws} />
        <div>
            <h3 className="text-md font-semibold text-neutral-metallic-silver/70 uppercase tracking-caption my-sm">Highlights</h3>
            <ul className="space-y-sm text-neutral-metallic-silver/90">
                {vehicle.highlights?.length ? vehicle.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-x-sm">
                        <CheckCircle2 size={20} className="text-primary-electric-cyan flex-shrink-0 mt-1" />
                        <span>{h}</span>
                    </li>
                )) : <li>No highlights provided.</li>}
            </ul>
        </div>
    </div>
);


const VehicleDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState('Details');

    const { addVehicle, removeVehicle, isInCompare } = useCompareStore();
    const isComparing = id ? isInCompare(id) : false;

    const handleCompareClick = () => {
        if (!id) return;
        if (isComparing) {
            removeVehicle(id);
        } else {
            addVehicle(id);
        }
    };

    const { data: vehicle, isLoading, error, isError } = useQuery<VehicleDetail>({
        queryKey: ['vehicle', id],
        queryFn: () => fetchVehicleById(id!),
        enabled: !!id,
    });

    if (isLoading) return <VDPSkeleton />;
    if (isError) return <div className="container mx-auto py-xl text-center text-red-400">Error: {error.message}</div>;
    if (!vehicle) return <div className="container mx-auto py-xl text-center">Vehicle not found.</div>;

    const media = vehicle.media || [];

    const TabButton = ({ tabName }: { tabName:string }) => (
      <button
        onClick={() => setActiveTab(tabName)}
        className={`px-lg py-sm font-bold transition-colors text-lg ${activeTab === tabName ? 'border-b-2 border-secondary-golden-yellow text-white' : 'text-neutral-metallic-silver/70 hover:text-white'}`}
      >
          {tabName}
      </button>
    );

    return (
        <div className="container mx-auto py-xl">
            <div className="mb-lg">
                <h1 className="text-h1 font-heading uppercase">{vehicle.year} {vehicle.make} {vehicle.model}</h1>
                <p className="text-h3 font-accent text-secondary-golden-yellow">${vehicle.price.toLocaleString()}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg items-start">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-lg">
                    <MediaGallery media={media} />

                    {/* Information Tabs */}
                    <div className="bg-glass p-lg rounded-xl border border-glass">
                        <div className="border-b border-glass mb-md">
                            <nav className="-mb-px flex space-x-lg" aria-label="Tabs">
                                <TabButton tabName="Details" />
                                <TabButton tabName="Condition" />
                            </nav>
                        </div>
                        <div>
                            {activeTab === 'Details' && <DetailsTab vehicle={vehicle} />}
                            {activeTab === 'Condition' && <ConditionTab vehicle={vehicle} />}
                        </div>
                    </div>
                </div>

                {/* Right Sticky Column */}
                <div className="lg:col-span-1 space-y-lg lg:sticky top-24">
                    <div className="bg-glass p-lg rounded-xl border border-glass space-y-md">
                        <h2 className="text-h3 font-heading mb-md">Bidding</h2>
                        <Bidding vehicleId={vehicle.id} />
                    </div>

                    <div className="bg-glass p-lg rounded-xl border border-glass space-y-md">
                         <h2 className="text-h3 font-heading mb-md">Actions</h2>
                        <button className="w-full bg-primary-gradient text-white font-bold py-sm rounded-lg hover:opacity-90 transition-opacity">
                            Buy Now
                        </button>
                        <button className="w-full bg-secondary-gradient text-white font-bold py-sm rounded-lg hover:opacity-90 transition-opacity">
                            Make an Offer
                        </button>
                        <button
                            onClick={handleCompareClick}
                            className={`w-full flex items-center justify-center gap-x-2 font-bold py-sm rounded-lg transition-colors ${isComparing ? 'bg-primary-electric-cyan text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                        >
                            <GitCompareArrows size={20} />
                            <span>{isComparing ? 'Remove from Compare' : 'Add to Compare'}</span>
                        </button>
                    </div>

                    <div className="bg-glass p-lg rounded-xl border border-glass">
                        <h2 className="text-h3 font-heading mb-md">Financing Calculator</h2>
                        <InstallmentCalculator />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleDetailPage;
