import React, { useState } from 'react';
import { useForm, FormProvider, useFormContext, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { createListing } from '../../../services/api';

// --- Constants for Dropdowns ---
const vehicleBodyTypes = ['Sedan', 'SUV', 'Truck', 'Hatchback', 'Coupe', 'Convertible', 'Minivan', 'Wagon'];
const fuelTypes = ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'];
const transmissionTypes = ['Automatic', 'Manual', 'CVT', 'Semi-Automatic'];

// --- Zod Schemas for Each Step ---
const step1Schema = z.object({
  vin: z.string().length(17, 'VIN must be 17 characters'),
  make: z.string().min(2, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().min(1900, 'Invalid year').max(new Date().getFullYear() + 1, 'Invalid year'),
  mileage: z.number().min(0, 'Mileage must be positive'),
  price_current: z.number().min(1, 'Price must be greater than 0'),
});

const step2Schema = z.object({
  body_type: z.string().min(1, 'Body type is required'),
  fuel_type: z.string().min(1, 'Fuel type is required'),
  transmission: z.string().min(1, 'Transmission type is required'),
  exterior_color: z.string().min(2, 'Exterior color is required'),
  interior_color: z.string().optional(),
  engine: z.string().optional(),
});

const step3Schema = z.object({
    highlights: z.array(z.object({ value: z.string().min(1, 'Highlight cannot be empty') })).optional(),
    known_flaws: z.string().optional(),
    seller_notes: z.string().optional(),
    service_history: z.string().optional(),
    owner_history: z.string().optional(),
});


// Combine schemas for full validation
const fullSchema = step1Schema.merge(step2Schema).merge(step3Schema);
type FullFormData = z.infer<typeof fullSchema>;


// --- Step Components ---
const Step1 = () => {
  const { register, formState: { errors } } = useFormContext<FullFormData>();
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Step 1: Basic Information</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="vin" className="block text-sm font-medium text-gray-700">VIN</label>
          <input type="text" id="vin" {...register('vin')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          {errors.vin && <p className="text-red-500 text-xs mt-1">{errors.vin.message}</p>}
        </div>
        <div>
          <label htmlFor="make" className="block text-sm font-medium text-gray-700">Make</label>
          <input type="text" id="make" {...register('make')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          {errors.make && <p className="text-red-500 text-xs mt-1">{errors.make.message}</p>}
        </div>
        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700">Model</label>
          <input type="text" id="model" {...register('model')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          {errors.model && <p className="text-red-500 text-xs mt-1">{errors.model.message}</p>}
        </div>
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
          <input type="number" id="year" {...register('year', { valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year.message}</p>}
        </div>
        <div>
          <label htmlFor="mileage" className="block text-sm font-medium text-gray-700">Mileage</label>
          <input type="number" id="mileage" {...register('mileage', { valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          {errors.mileage && <p className="text-red-500 text-xs mt-1">{errors.mileage.message}</p>}
        </div>
        <div>
          <label htmlFor="price_current" className="block text-sm font-medium text-gray-700">Asking Price</label>
          <input type="number" id="price_current" {...register('price_current', { valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          {errors.price_current && <p className="text-red-500 text-xs mt-1">{errors.price_current.message}</p>}
        </div>
      </div>
    </>
  );
};

const Step2 = () => {
  const { register, formState: { errors } } = useFormContext<FullFormData>();
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Step 2: Detailed Specifications</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="body_type" className="block text-sm font-medium text-gray-700">Body Type</label>
          <select id="body_type" {...register('body_type')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            <option value="">Select a body type</option>
            {vehicleBodyTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
          {errors.body_type && <p className="text-red-500 text-xs mt-1">{errors.body_type.message}</p>}
        </div>
        <div>
          <label htmlFor="fuel_type" className="block text-sm font-medium text-gray-700">Fuel Type</label>
          <select id="fuel_type" {...register('fuel_type')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            <option value="">Select a fuel type</option>
            {fuelTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
          {errors.fuel_type && <p className="text-red-500 text-xs mt-1">{errors.fuel_type.message}</p>}
        </div>
        <div>
          <label htmlFor="transmission" className="block text-sm font-medium text-gray-700">Transmission</label>
          <select id="transmission" {...register('transmission')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            <option value="">Select a transmission type</option>
            {transmissionTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
          {errors.transmission && <p className="text-red-500 text-xs mt-1">{errors.transmission.message}</p>}
        </div>
        <div>
          <label htmlFor="exterior_color" className="block text-sm font-medium text-gray-700">Exterior Color</label>
          <input type="text" id="exterior_color" {...register('exterior_color')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          {errors.exterior_color && <p className="text-red-500 text-xs mt-1">{errors.exterior_color.message}</p>}
        </div>
        <div>
          <label htmlFor="interior_color" className="block text-sm font-medium text-gray-700">Interior Color (Optional)</label>
          <input type="text" id="interior_color" {...register('interior_color')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="engine" className="block text-sm font-medium text-gray-700">Engine (Optional)</label>
          <input type="text" id="engine" {...register('engine')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
      </div>
    </>
  );
};

const Step3 = () => {
    const { register, control } = useFormContext<FullFormData>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "highlights",
    });

    return (
        <>
            <h2 className="text-2xl font-bold mb-4">Step 3: Condition & History</h2>
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Highlights</label>
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex items-center mt-2">
                            <input
                                {...register(`highlights.${index}.value`)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                            <button type="button" onClick={() => remove(index)} className="ml-2 text-red-500 hover:text-red-700">&times;</button>
                        </div>
                    ))}
                    <button type="button" onClick={() => append({ value: "" })} className="mt-2 text-sm text-blue-600 hover:text-blue-800">
                        + Add Highlight
                    </button>
                </div>
                <div>
                    <label htmlFor="known_flaws" className="block text-sm font-medium text-gray-700">Known Flaws (Optional)</label>
                    <textarea id="known_flaws" {...register('known_flaws')} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="seller_notes" className="block text-sm font-medium text-gray-700">Seller Notes (Optional)</label>
                    <textarea id="seller_notes" {...register('seller_notes')} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="service_history" className="block text-sm font-medium text-gray-700">Service History (Optional, JSON format)</label>
                    <textarea id="service_history" {...register('service_history')} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder='e.g., [{ "date": "2023-05-10", "service": "Oil Change" }]' />
                </div>
                <div>
                    <label htmlFor="owner_history" className="block text-sm font-medium text-gray-700">Owner History (Optional, JSON format)</label>
                    <textarea id="owner_history" {...register('owner_history')} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder='e.g., { "previous_owners": 2, "last_owner_duration_years": 3 }' />
                </div>
            </div>
        </>
    );
};

const Step4 = () => {
    const { getValues } = useFormContext<FullFormData>();
    const formData = getValues();

    return (
        <>
            <h2 className="text-2xl font-bold mb-4">Step 4: Review Your Listing</h2>
            <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
                <div>
                    <h3 className="text-lg font-semibold border-b pb-2 mb-2">Basic Information</h3>
                    <p><strong>VIN:</strong> {formData.vin}</p>
                    <p><strong>Make:</strong> {formData.make}</p>
                    <p><strong>Model:</strong> {formData.model}</p>
                    <p><strong>Year:</strong> {formData.year}</p>
                    <p><strong>Mileage:</strong> {formData.mileage?.toLocaleString()} mi</p>
                    <p><strong>Price:</strong> ${formData.price_current?.toLocaleString()}</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold border-b pb-2 mb-2">Specifications</h3>
                    <p><strong>Body Type:</strong> {formData.body_type}</p>
                    <p><strong>Fuel Type:</strong> {formData.fuel_type}</p>
                    <p><strong>Transmission:</strong> {formData.transmission}</p>
                    <p><strong>Exterior Color:</strong> {formData.exterior_color}</p>
                    <p><strong>Interior Color:</strong> {formData.interior_color || 'N/A'}</p>
                    <p><strong>Engine:</strong> {formData.engine || 'N/A'}</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold border-b pb-2 mb-2">Condition & History</h3>
                    <p><strong>Highlights:</strong></p>
                    <ul className="list-disc list-inside ml-4">
                        {formData.highlights?.map((h, i) => <li key={i}>{h.value}</li>)}
                    </ul>
                    <p className="mt-2"><strong>Known Flaws:</strong> {formData.known_flaws || 'N/A'}</p>
                    <p><strong>Seller Notes:</strong> {formData.seller_notes || 'N/A'}</p>
                    <p><strong>Service History:</strong> {formData.service_history || 'N/A'}</p>
                    <p><strong>Owner History:</strong> {formData.owner_history || 'N/A'}</p>
                </div>
            </div>
        </>
    );
};


const SellPage = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const methods = useForm<FullFormData>({
    resolver: zodResolver(fullSchema),
    mode: 'onChange'
  });

  const mutation = useMutation({
    mutationFn: createListing,
    onSuccess: (data) => {
      console.log("Listing created successfully!", data);
      // In a real app, you'd likely redirect the user to the new listing's page
      // or to their dashboard.
      alert(`Success! Your listing for the ${data.year} ${data.make} ${data.model} has been created.`);
    },
    onError: (error) => {
      console.error("Error creating listing:", error);
      alert(`Error: ${error.message}`);
    },
  });

  const handleNextStep = async () => {
    let isValid = false;
    if (currentStep === 1) {
      isValid = await methods.trigger(["vin", "make", "model", "year", "mileage", "price_current"]);
    } else if (currentStep === 2) {
      isValid = await methods.trigger(["body_type", "fuel_type", "transmission", "exterior_color"]);
    } else if (currentStep === 3) {
      isValid = true; // Step 3 fields are optional
    }

    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const onSubmit = (data: FullFormData) => {
    // The backend expects highlights as a simple array of strings.
    const submissionData = {
        ...data,
        highlights: data.highlights?.map(h => h.value)
    };
    mutation.mutate(submissionData);
  };

  const steps = [
    <Step1 />,
    <Step2 />,
    <Step3 />,
    <Step4 />
  ];

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold font-heading text-charcoal mb-4">
          Sell Your Car With Us
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Follow the steps below to create your listing. Our team will review it and get it live on the auction block!
        </p>

        <div className="mb-8">
          <div className="relative pt-1">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
              <div style={{ width: `${(currentStep / steps.length) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"></div>
            </div>
            <p className="text-sm text-gray-500">Step {currentStep} of {steps.length}</p>
          </div>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            {mutation.isError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Error! </strong>
                    <span className="block sm:inline">{mutation.error.message}</span>
                </div>
            )}
            {steps[currentStep - 1]}
            <div className="mt-8 flex justify-between">
              {currentStep > 1 && !mutation.isPending && (
                <button type="button" onClick={handlePreviousStep} className="px-6 py-2 font-semibold rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300">
                  Previous
                </button>
              )}
              {currentStep < steps.length && !mutation.isPending && (
                <button type="button" onClick={handleNextStep} className="px-6 py-2 font-semibold rounded-lg bg-primary-gradient text-white hover:opacity-90 ml-auto">
                  Next Step
                </button>
              )}
              {currentStep === steps.length && (
                <button type="submit" disabled={mutation.isPending} className="px-6 py-2 font-semibold rounded-lg bg-green-500 text-white hover:bg-green-600 ml-auto disabled:opacity-50">
                  {mutation.isPending ? 'Submitting...' : 'Submit Listing'}
                </button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default SellPage;
