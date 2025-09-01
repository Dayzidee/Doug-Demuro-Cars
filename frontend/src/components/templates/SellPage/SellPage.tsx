import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define Zod schema for validation
const step1Schema = z.object({
  vin: z.string().length(17, 'VIN must be 17 characters'),
  make: z.string().min(2, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().min(1900, 'Invalid year').max(new Date().getFullYear() + 1, 'Invalid year'),
  mileage: z.number().min(0, 'Mileage must be positive'),
  price_current: z.number().min(1, 'Price must be greater than 0'),
});

type Step1Data = z.infer<typeof step1Schema>;

const SellPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
  });

  const handleNextStep = (data: Step1Data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold font-heading text-charcoal mb-4">
          Sell Your Car With Us
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Follow the steps below to create your listing. Our team will review it and get it live on the auction block!
        </p>

        {/* Progress Bar Placeholder */}
        <div className="mb-8">
          <div className="relative pt-1">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
              <div style={{ width: `${(currentStep / 4) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"></div>
            </div>
            <p className="text-sm text-gray-500">Step {currentStep} of 4</p>
          </div>
        </div>

        {currentStep === 1 && (
          <form onSubmit={handleSubmit(handleNextStep)}>
            <h2 className="text-2xl font-bold mb-4">Step 1: Basic Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* VIN */}
              <div>
                <label htmlFor="vin" className="block text-sm font-medium text-gray-700">VIN</label>
                <input type="text" id="vin" {...register('vin')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                {errors.vin && <p className="text-red-500 text-xs mt-1">{errors.vin.message}</p>}
              </div>
              {/* Make */}
              <div>
                <label htmlFor="make" className="block text-sm font-medium text-gray-700">Make</label>
                <input type="text" id="make" {...register('make')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                {errors.make && <p className="text-red-500 text-xs mt-1">{errors.make.message}</p>}
              </div>
              {/* Model */}
              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-700">Model</label>
                <input type="text" id="model" {...register('model')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                {errors.model && <p className="text-red-500 text-xs mt-1">{errors.model.message}</p>}
              </div>
              {/* Year */}
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
                <input type="number" id="year" {...register('year', { valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year.message}</p>}
              </div>
              {/* Mileage */}
              <div>
                <label htmlFor="mileage" className="block text-sm font-medium text-gray-700">Mileage</label>
                <input type="number" id="mileage" {...register('mileage', { valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                {errors.mileage && <p className="text-red-500 text-xs mt-1">{errors.mileage.message}</p>}
              </div>
              {/* Price */}
              <div>
                <label htmlFor="price_current" className="block text-sm font-medium text-gray-700">Asking Price</label>
                <input type="number" id="price_current" {...register('price_current', { valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                {errors.price_current && <p className="text-red-500 text-xs mt-1">{errors.price_current.message}</p>}
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button type="submit" className="px-6 py-2 font-semibold rounded-lg bg-primary-gradient text-white hover:opacity-90">
                Next Step
              </button>
            </div>
          </form>
        )}

        {currentStep === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Step 2: Detailed Specifications</h2>
            <p>Placeholder for Step 2 content.</p>
            <div className="mt-8 flex justify-between">
              <button onClick={() => setCurrentStep(1)} className="px-6 py-2 font-semibold rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300">
                Previous
              </button>
              <button onClick={() => setCurrentStep(3)} className="px-6 py-2 font-semibold rounded-lg bg-primary-gradient text-white hover:opacity-90">
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* Add placeholders for other steps */}

      </div>
    </div>
  );
};

export default SellPage;
