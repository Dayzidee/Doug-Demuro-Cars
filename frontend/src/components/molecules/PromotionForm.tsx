import React, { useState, useEffect } from 'react';

// This interface should be shared or imported from a types file
export interface Offer {
  id?: string;
  title: string;
  description: string;
  promo_type: 'deal' | 'featured_vehicle' | 'seasonal_offer';
  start_date: string;
  end_date: string;
  is_active: boolean;
}

interface PromotionFormProps {
  promotion: Offer | null;
  onSave: (promotionData: Omit<Offer, 'id'> | Offer) => void;
  onCancel: () => void;
  isSaving: boolean;
}

const PromotionForm: React.FC<PromotionFormProps> = ({ promotion, onSave, onCancel, isSaving }) => {
  const [formData, setFormData] = useState<Offer>({
    title: '',
    description: '',
    promo_type: 'deal',
    start_date: '',
    end_date: '',
    is_active: false,
  });

  useEffect(() => {
    if (promotion) {
      // If editing, populate form with existing promotion data
      // Format dates for the date input type (YYYY-MM-DD)
      setFormData({
        ...promotion,
        start_date: promotion.start_date.split('T')[0],
        end_date: promotion.end_date.split('T')[0],
      });
    } else {
      // If creating, reset to default state
      setFormData({
        title: '',
        description: '',
        promo_type: 'deal',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        is_active: false,
      });
    }
  }, [promotion]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const checked = isCheckbox ? (e.target as HTMLInputElement).checked : false;

    setFormData(prev => ({
      ...prev,
      [name]: isCheckbox ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 text-left">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Title</label>
          <input id="title" name="title" type="text" value={formData.title} onChange={handleChange} required className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:border-blue-500" rows={3}/>
        </div>
        <div>
          <label htmlFor="promo_type" className="block text-sm font-medium text-gray-300 mb-1">Promotion Type</label>
          <select id="promo_type" name="promo_type" value={formData.promo_type} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:border-blue-500">
            <option value="deal">Deal</option>
            <option value="featured_vehicle">Featured Vehicle</option>
            <option value="seasonal_offer">Seasonal Offer</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
            <input id="start_date" name="start_date" type="date" value={formData.start_date} onChange={handleChange} required className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
            <input id="end_date" name="end_date" type="date" value={formData.end_date} onChange={handleChange} required className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:border-blue-500" />
          </div>
        </div>
        <div className="flex items-center">
          <input id="is_active" name="is_active" type="checkbox" checked={formData.is_active} onChange={handleChange} className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-600"/>
          <label htmlFor="is_active" className="ml-2 text-sm font-medium text-gray-300">Active</label>
        </div>
      </div>
      <div className="mt-8 flex justify-end space-x-4">
        <button type="button" onClick={onCancel} className="bg-gray-600 hover:bg-gray-500 py-2 px-4 rounded transition-colors" disabled={isSaving}>Cancel</button>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded transition-colors disabled:bg-gray-500" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Promotion'}
        </button>
      </div>
    </form>
  );
};

export default PromotionForm;
