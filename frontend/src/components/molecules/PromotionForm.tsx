import { useState, useEffect } from 'react';

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

  const formInputStyles = "w-full bg-backgrounds-card border border-glass p-sm text-white placeholder-neutral-metallic-silver/50 focus:outline-none focus:ring-2 focus:ring-primary-electric-cyan transition-all duration-300 rounded-md";
  const formTextareaStyles = `${formInputStyles} h-24 resize-none`;
  const formSelectStyles = `${formInputStyles} appearance-none`;

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-md text-left">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-neutral-metallic-silver/80 mb-xs">Title</label>
          <input id="title" name="title" type="text" value={formData.title} onChange={handleChange} required className={formInputStyles} />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-neutral-metallic-silver/80 mb-xs">Description</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} className={formTextareaStyles} rows={3}/>
        </div>
        <div>
          <label htmlFor="promo_type" className="block text-sm font-medium text-neutral-metallic-silver/80 mb-xs">Promotion Type</label>
          <select id="promo_type" name="promo_type" value={formData.promo_type} onChange={handleChange} className={formSelectStyles}>
            <option value="deal" className="bg-primary-deep-blue">Deal</option>
            <option value="featured_vehicle" className="bg-primary-deep-blue">Featured Vehicle</option>
            <option value="seasonal_offer" className="bg-primary-deep-blue">Seasonal Offer</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-md">
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-neutral-metallic-silver/80 mb-xs">Start Date</label>
            <input id="start_date" name="start_date" type="date" value={formData.start_date} onChange={handleChange} required className={formInputStyles} />
          </div>
          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-neutral-metallic-silver/80 mb-xs">End Date</label>
            <input id="end_date" name="end_date" type="date" value={formData.end_date} onChange={handleChange} required className={formInputStyles} />
          </div>
        </div>
        <div className="flex items-center">
          <input id="is_active" name="is_active" type="checkbox" checked={formData.is_active} onChange={handleChange} className="h-4 w-4 rounded border-glass bg-backgrounds-card text-primary-electric-cyan focus:ring-primary-electric-cyan/50 focus:ring-offset-backgrounds-card"/>
          <label htmlFor="is_active" className="ml-sm text-sm font-medium text-white">Active</label>
        </div>
      </div>
      <div className="mt-lg flex justify-end space-x-4">
        <button type="button" onClick={onCancel} className="bg-neutral-metallic-silver/20 hover:bg-neutral-metallic-silver/30 text-white font-bold py-sm px-md rounded-lg transition-colors" disabled={isSaving}>Cancel</button>
        <button type="submit" className="bg-primary-gradient hover:opacity-90 text-white font-bold py-sm px-md rounded-lg transition-opacity disabled:opacity-50" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Promotion'}
        </button>
      </div>
    </form>
  );
};

export default PromotionForm;
