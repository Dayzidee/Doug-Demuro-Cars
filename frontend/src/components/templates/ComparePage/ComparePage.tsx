import { Car, X } from 'lucide-react';
import { useCompareStore } from '../../../hooks/useCompareStore';
import { useQueries } from '@tanstack/react-query';
import { fetchVehicleById, VehicleDetail } from '../../../services/api';

const specRows = [
    { key: 'price', label: 'Price', format: (val: number) => `$${val.toLocaleString()}` },
    { key: 'mileage', label: 'Mileage', format: (val: number) => `${val.toLocaleString()} mi` },
    { key: 'transmission', label: 'Transmission' },
    { key: 'fuel_type', label: 'Fuel Type' },
    { key: 'body_type', label: 'Body Type' },
    { key: 'engine', label: 'Engine' },
];

const ComparePage = () => {
    const { vehicleIds, removeVehicle } = useCompareStore();

    const vehicleQueries = useQueries({
        queries: vehicleIds.map(id => ({
            queryKey: ['vehicle', id],
            queryFn: () => fetchVehicleById(id),
        })),
    });

    const vehiclesToCompare = vehicleQueries
        .filter(query => query.isSuccess && query.data)
        .map(query => query.data as VehicleDetail);

    const isLoading = vehicleQueries.some(query => query.isLoading);

    return (
        <div className="container mx-auto py-xl">
            <div className="text-center mb-xl">
                <h1 className="text-h1 font-heading uppercase">
                    Compare <span className="bg-clip-text text-transparent bg-primary-gradient">Vehicles</span>
                </h1>
                <p className="text-body-lg text-neutral-metallic-silver/80 mt-md max-w-3xl mx-auto">
                    Select up to 4 vehicles to compare their specifications side-by-side.
                </p>
            </div>

            {isLoading && <p className="text-center text-lg">Loading comparison data...</p>}

            {!isLoading && vehiclesToCompare.length > 0 && (
                <div className="bg-glass border border-glass rounded-xl shadow-2xl backdrop-blur-md overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead>
                            <tr className="border-b border-glass">
                                <th className="py-md px-md w-1/5 font-heading text-lg">Feature</th>
                                {vehiclesToCompare.map(vehicle => (
                                    <th key={vehicle.id} className="py-md px-md w-1/5 text-center relative">
                                        <img src={vehicle.hero_image_url} alt={`${vehicle.year} ${vehicle.make}`} className="w-full h-32 object-cover rounded-lg mb-sm" />
                                        <p className="font-bold">{vehicle.year} {vehicle.make}</p>
                                        <p className="text-sm">{vehicle.model}</p>
                                        <button onClick={() => removeVehicle(vehicle.id)} className="absolute top-2 right-2 p-1 bg-red-500/50 hover:bg-red-500 rounded-full text-white">
                                            <X size={16} />
                                        </button>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {specRows.map(spec => (
                                <tr key={spec.key} className="border-b border-glass last:border-b-0 hover:bg-white/5 transition-colors">
                                    <td className="py-md px-md font-bold">{spec.label}</td>
                                    {vehiclesToCompare.map(vehicle => (
                                        <td key={vehicle.id} className="py-md px-md text-center">
                                            {spec.format ? spec.format(vehicle[spec.key as keyof VehicleDetail]) : vehicle[spec.key as keyof VehicleDetail] || 'N/A'}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!isLoading && vehiclesToCompare.length === 0 && (
                <div className="text-center py-2xl bg-glass rounded-xl border border-glass">
                    <Car size={64} className="mx-auto text-neutral-metallic-silver/50 mb-md" />
                    <h2 className="text-h2 font-heading">Your Compare List is Empty</h2>
                    <p className="text-body-lg text-neutral-metallic-silver/80 mt-sm">Add some vehicles from the inventory page to start comparing.</p>
                </div>
            )}
        </div>
    );
};

export default ComparePage;
