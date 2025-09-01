import React, { useState, useEffect, useCallback } from 'react';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price_current: number;
  status: string;
  visible: boolean;
}

interface VehicleListProps {
    onEdit: (vehicle: Vehicle) => void;
}

const VehicleList: React.FC<VehicleListProps> = ({ onEdit }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('supabase_token');
      if (!token) throw new Error("Authentication token not found.");

      const response = await fetch('/api/v1/vehicles/search', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || 'Failed to fetch vehicle list');
      }
      const data = await response.json();
      setVehicles(data);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleDelete = async (vehicleId: string) => {
    if (!window.confirm("Are you sure you want to delete this vehicle? This action cannot be undone.")) return;

    try {
        const token = localStorage.getItem('supabase_token');
        if (!token) throw new Error("Authentication token not found.");

        const response = await fetch(`/api/v1/admin/vehicles/${vehicleId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.message || "Failed to delete vehicle.");
        }
        fetchVehicles();
    } catch (err) {
        if (err instanceof Error) alert(err.message);
    }
  };

  if (loading) return <div className="text-center p-8">Loading vehicle inventory...</div>;
  if (error) return <div className="text-center p-8 text-red-400 bg-red-900/30 rounded-lg">{error}</div>;

  return (
    <div className="bg-gray-800 rounded-lg shadow overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-700 text-xs text-gray-300 uppercase tracking-wider">
          <tr>
            <th className="p-3">Make</th>
            <th className="p-3">Model</th>
            <th className="p-3">Year</th>
            <th className="p-3">Price</th>
            <th className="p-3">Status</th>
            <th className="p-3">Visibility</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-200">
          {vehicles.map(v => (
            <tr key={v.id} className="border-b border-gray-700 hover:bg-gray-700/50">
              <td className="p-3 font-medium">{v.make}</td>
              <td className="p-3">{v.model}</td>
              <td className="p-3">{v.year}</td>
              <td className="p-3">${v.price_current.toLocaleString()}</td>
              <td className="p-3 capitalize">{v.status}</td>
              <td className="p-3">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${v.visible ? 'bg-green-800 text-green-200' : 'bg-gray-600 text-gray-200'}`}>
                    {v.visible ? 'Public' : 'Hidden'}
                </span>
              </td>
              <td className="p-3 text-right space-x-2 whitespace-nowrap">
                <button onClick={() => onEdit(v)} className="text-yellow-400 hover:text-yellow-300 font-semibold">Edit</button>
                <button onClick={() => handleDelete(v.id)} className="text-red-500 hover:text-red-400 font-semibold">Delete</button>
              </td>
            </tr>
          ))}
           {vehicles.length === 0 && (
                <tr>
                    <td colSpan={7} className="text-center p-8 text-gray-400">No vehicles in inventory.</td>
                </tr>
            )}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleList;
