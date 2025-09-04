import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchVehicleById, Vehicle } from '../../../services/api';
import Bidding from '../../organisms/Bidding/Bidding';

// Helper component to display a single detail item
const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="py-2">
        <p className="text-sm font-semibold text-gray-600">{label}</p>
        <p className="text-md text-charcoal">{value || 'N/A'}</p>
    </div>
);

const VehicleDetailPage = () => {
    const { id } = useParams<{ id: string }>();

    const { data: vehicle, isLoading, error, isError } = useQuery<Vehicle>({
        queryKey: ['vehicle', id],
        queryFn: () => fetchVehicleById(id!),
        enabled: !!id, // Only run the query if the id exists
    });

    if (isLoading) {
        return (
            <div className="container mx-auto p-8 text-center">
                <p>Loading vehicle details...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="container mx-auto p-8 text-center text-red-500">
                <p>Error loading vehicle: {error.message}</p>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="container mx-auto p-8 text-center">
                <p>Vehicle not found.</p>
            </div>
        );
    }

    // A placeholder image if the vehicle has no hero image
    const heroImageUrl = vehicle.hero_image_url || `https://via.placeholder.com/1200x600.png/0D1B2A/FFFFFF?text=${vehicle.year}+${vehicle.make}+${vehicle.model}`;

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto p-4 md:p-8">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold font-heading text-charcoal">{vehicle.year} {vehicle.make} {vehicle.model}</h1>
                    <p className="text-2xl font-special text-primary-gradient font-semibold">${vehicle.price.toLocaleString()}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Image Gallery & Bidding */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <img src={heroImageUrl} alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} className="w-full h-auto object-cover rounded-lg mb-4" />
                            <Bidding vehicleId={vehicle.id} />
                        </div>
                    </div>

                    {/* Right Column: Vehicle Details */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Basic Info */}
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold mb-4 border-b pb-2">Key Details</h2>
                            <div className="grid grid-cols-2 gap-4">
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

                        {/* Highlights */}
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold mb-4 border-b pb-2">Highlights</h2>
                            <ul className="list-disc list-inside space-y-1 text-charcoal">
                                {vehicle.highlights?.map((h, i) => <li key={i}>{h}</li>) || <li>No highlights provided.</li>}
                            </ul>
                        </div>

                        {/* Seller Notes & Known Flaws */}
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold mb-4 border-b pb-2">Condition</h2>
                            <DetailItem label="Seller Notes" value={vehicle.seller_notes} />
                            <DetailItem label="Known Flaws" value={vehicle.known_flaws} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleDetailPage;
