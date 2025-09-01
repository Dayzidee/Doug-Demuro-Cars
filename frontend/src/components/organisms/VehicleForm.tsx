import React, { useState, useEffect } from 'react';
import ImageUploader from '../molecules/ImageUploader';

export interface VehicleData {
  id?: string;
  vin: string;
  make: string;
  model: string;
  trim: string;
  year: number;
  price_current: number;
  mileage: number;
  exterior_color: string;
  interior_color: string;
  engine: string;
  transmission: string;
  drivetrain: string;
  status: string;
  visible: boolean;
  is_featured: boolean;
  description: string;
}

// Include new media in the data passed up on save
export interface VehicleSaveData extends VehicleData {
    new_media_urls: string[];
}

interface VehicleFormProps {
  vehicle: VehicleData | null;
  onSave: (vehicleSaveData: VehicleSaveData) => void;
  onCancel: () => void;
  isSaving: boolean;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ vehicle, onSave, onCancel, isSaving }) => {
    const [formData, setFormData] = useState<VehicleData>({
        vin: '', make: '', model: '', trim: '', year: new Date().getFullYear(),
        price_current: 0, mileage: 0, exterior_color: '', interior_color: '',
        engine: '', transmission: 'Automatic', drivetrain: 'FWD', status: 'Available',
        visible: true, is_featured: false, description: '',
    });
    const [newMediaUrls, setNewMediaUrls] = useState<string[]>([]);

    useEffect(() => {
        if (vehicle) {
            setFormData(vehicle);
            setNewMediaUrls([]); // Reset for edit session
        } else {
            setFormData({
                vin: '', make: '', model: '', trim: '', year: new Date().getFullYear(),
                price_current: 0, mileage: 0, exterior_color: '', interior_color: '',
                engine: '', transmission: 'Automatic', drivetrain: 'FWD', status: 'Available',
                visible: true, is_featured: false, description: '',
            });
            setNewMediaUrls([]);
        }
    }, [vehicle]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        const checked = isCheckbox ? (e.target as HTMLInputElement).checked : false;
        const numericValue = (type === 'number') ? parseFloat(value) || 0 : value;

        setFormData(prev => ({ ...prev, [name]: isCheckbox ? checked : numericValue }));
    };

    const handleUploadComplete = (url: string) => {
        setNewMediaUrls(prev => [...prev, url]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, new_media_urls: newMediaUrls });
    };

    const renderInput = (name: keyof VehicleData, type = 'text', required = false) => (
        <div>
            <label htmlFor={name} className="capitalize block text-sm font-medium text-gray-300 mb-1">{name.replace(/_/g, ' ')}</label>
            <input id={name} name={name} type={type} value={String(formData[name])} onChange={handleChange} required={required} className="w-full bg-gray-700 p-2 rounded border border-gray-600"/>
        </div>
    );

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                {renderInput('vin', 'text', true)}
                {renderInput('make', 'text', true)}
                {renderInput('model', 'text', true)}
                {renderInput('trim')}
                {renderInput('year', 'number', true)}
                {renderInput('price_current', 'number', true)}
                {renderInput('mileage', 'number')}
                {renderInput('exterior_color')}
                {renderInput('interior_color')}
                {renderInput('engine')}
                {renderInput('transmission')}
                {renderInput('drivetrain')}
                {renderInput('status')}
                <div className="flex items-center space-x-4 col-span-full">
                    <label className="flex items-center"><input type="checkbox" name="visible" checked={formData.visible} onChange={handleChange} className="h-4 w-4" /> <span className="ml-2">Visible</span></label>
                    <label className="flex items-center"><input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} className="h-4 w-4" /> <span className="ml-2">Featured</span></label>
                </div>
                <div className="col-span-full">
                    <label htmlFor="description" className="capitalize block text-sm font-medium text-gray-300 mb-1">Description</label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded border border-gray-600" rows={4}/>
                </div>
            </div>

            <div className="mt-6 col-span-full">
                <ImageUploader bucket="vehicle-media" onUploadComplete={handleUploadComplete} />
                <div className="flex flex-wrap gap-2 mt-2">
                    {newMediaUrls.map(url => <img key={url} src={url} alt="newly uploaded vehicle" className="h-24 w-24 object-cover rounded" />)}
                </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
                <button type="button" onClick={onCancel} className="bg-gray-600 hover:bg-gray-500 py-2 px-4 rounded transition-colors" disabled={isSaving}>Cancel</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded transition-colors disabled:bg-gray-500" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Vehicle'}
                </button>
            </div>
        </form>
    );
};

export default VehicleForm;
