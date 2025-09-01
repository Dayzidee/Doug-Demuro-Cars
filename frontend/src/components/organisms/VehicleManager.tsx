import React, { useState, useCallback } from 'react';
import VehicleList from './VehicleList';
import VehicleForm, { VehicleData, VehicleSaveData } from './VehicleForm';

const VehicleManager: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<VehicleData | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [listKey, setListKey] = useState(0);

    const handleEdit = (vehicle: VehicleData) => {
        setSelectedVehicle(vehicle);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setSelectedVehicle(null);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setSelectedVehicle(null);
    };

    const handleSave = async (vehicleSaveData: VehicleSaveData) => {
        setIsSaving(true);
        const token = localStorage.getItem('supabase_token');
        if (!token) {
            alert("Authentication token not found.");
            setIsSaving(false);
            return;
        }

        const { new_media_urls, ...vehicleData } = vehicleSaveData;
        const isEditing = !!vehicleData.id;
        const url = isEditing ? `/api/v1/admin/vehicles/${vehicleData.id}` : '/api/v1/admin/vehicles';
        const method = isEditing ? 'PATCH' : 'POST';

        try {
            // Step 1: Save the vehicle data
            const response = await fetch(url, {
                method,
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(vehicleData)
            });
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Failed to save vehicle');
            }

            const savedVehicle = await response.json();
            const vehicleId = savedVehicle.id;

            // Step 2: If there are new media URLs, associate them with the vehicle
            if (new_media_urls && new_media_urls.length > 0) {
                for (const mediaUrl of new_media_urls) {
                    await fetch(`/api/v1/admin/vehicles/${vehicleId}/media`, {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            url: mediaUrl,
                            media_type: 'Image' // Assuming all uploads are images for now
                        })
                    });
                    // In a real app, you might want more robust error handling here
                }
            }

            setIsModalOpen(false);
            setListKey(prevKey => prevKey + 1);

        } catch (error) {
            if(error instanceof Error) alert(error.message);
            else alert("An unknown error occurred while saving.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Vehicle Inventory</h2>
                <button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
                    + Add New Vehicle
                </button>
            </div>

            <VehicleList key={listKey} onEdit={handleEdit} />

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 rounded-lg p-8 w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-6">{selectedVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
                        <VehicleForm
                            vehicle={selectedVehicle}
                            onSave={handleSave}
                            onCancel={handleCancel}
                            isSaving={isSaving}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default VehicleManager;
