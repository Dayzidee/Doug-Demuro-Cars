import React, { useState, useEffect, useCallback } from 'react';
import PromotionForm, { Offer } from '../molecules/PromotionForm';

const PromotionsManager: React.FC = () => {
  const [promotions, setPromotions] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Offer | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchPromotions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('supabase_token');
      if (!token) throw new Error("Authentication token not found.");

      const response = await fetch('/api/v1/admin/offers', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to fetch promotions.');
      }
      const data = await response.json();
      setPromotions(data);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const handleSave = async (promotionData: Omit<Offer, 'id'> | Offer) => {
    setIsSaving(true);
    const token = localStorage.getItem('supabase_token');
    if (!token) {
      alert("Authentication error.");
      setIsSaving(false);
      return;
    }

    const isEditing = 'id' in promotionData && promotionData.id;
    const url = isEditing ? `/api/v1/admin/offers/${promotionData.id}` : '/api/v1/admin/offers';
    const method = isEditing ? 'PATCH' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(promotionData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || `Failed to ${isEditing ? 'update' : 'create'} promotion.`);
      }

      setIsModalOpen(false);
      fetchPromotions();
    } catch (err) {
      if (err instanceof Error) alert(`Error: ${err.message}`);
      else alert('An unknown error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this promotion?")) return;

    try {
      const token = localStorage.getItem('supabase_token');
      if (!token) throw new Error("Authentication token not found.");

      const response = await fetch(`/api/v1/admin/offers/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to delete promotion');
      }
      fetchPromotions();
    } catch (err) {
      if (err instanceof Error) alert(`Error: ${err.message}`);
      else alert('An unknown error occurred during deletion.');
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedPromotion(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (promo: Offer) => {
    setSelectedPromotion(promo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPromotion(null);
  };

  if (loading) return <div className="text-center p-8">Loading promotions...</div>;
  if (error) return <div className="text-center p-8 text-red-400 bg-red-900/30 rounded-lg">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Promotions List</h2>
        <button onClick={handleOpenCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
          + Create New Promotion
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-700 text-xs text-gray-300 uppercase tracking-wider">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Type</th>
              <th className="p-3">Status</th>
              <th className="p-3">Start Date</th>
              <th className="p-3">End Date</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-200">
            {promotions.map(promo => (
              <tr key={promo.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                <td className="p-3 font-medium">{promo.title}</td>
                <td className="p-3">{promo.promo_type.replace('_', ' ')}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${promo.is_active ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200'}`}>
                    {promo.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-3">{new Date(promo.start_date).toLocaleDateString()}</td>
                <td className="p-3">{new Date(promo.end_date).toLocaleDateString()}</td>
                <td className="p-3 text-right space-x-2">
                  <button onClick={() => handleOpenEditModal(promo)} className="text-yellow-400 hover:text-yellow-300 font-semibold">Edit</button>
                  <button onClick={() => handleDelete(promo.id)} className="text-red-500 hover:text-red-400 font-semibold">Delete</button>
                </td>
              </tr>
            ))}
            {promotions.length === 0 && (
              <tr><td colSpan={6} className="text-center p-8 text-gray-400">No promotions found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-8 w-full max-w-lg shadow-2xl">
            <h3 className="text-xl font-bold mb-6 text-center">{selectedPromotion ? 'Edit Promotion' : 'Create New Promotion'}</h3>
            <PromotionForm
              promotion={selectedPromotion}
              onSave={handleSave}
              onCancel={handleCloseModal}
              isSaving={isSaving}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionsManager;
