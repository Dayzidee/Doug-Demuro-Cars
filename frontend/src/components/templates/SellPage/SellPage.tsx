import { useState } from 'react';
import { useForm, FormProvider, useFormContext, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { createListing } from '../../../services/api';
import { useAuth } from '../../../hooks/useAuth';
import VerificationPrompt from '../../molecules/VerificationPrompt/VerificationPrompt';

// --- Constants ---
const vehicleBodyTypes = ['Sedan', 'SUV', 'Truck', 'Hatchback', 'Coupe', 'Convertible', 'Minivan', 'Wagon'];
const fuelTypes = ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'];
const transmissionTypes = ['Automatic', 'Manual', 'CVT', 'Semi-Automatic'];

// --- Zod Schemas ---
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
const fullSchema = step1Schema.merge(step2Schema).merge(step3Schema);
type FullFormData = z.infer<typeof fullSchema>;

// --- Reusable Form Component Styles ---
const formLabelStyles = "block text-sm font-medium text-neutral-metallic-silver/80 mb-xs";
const formInputStyles = "w-full bg-backgrounds-card border border-glass p-sm text-white placeholder-neutral-metallic-silver/50 focus:outline-none focus:ring-2 focus:ring-primary-electric-cyan transition-all duration-300 rounded-md";
const formTextareaStyles = `${formInputStyles} h-24 resize-none`;
const formSelectStyles = `${formInputStyles} appearance-none`;
const formErrorStyles = "text-red-400 text-xs mt-xs";

// --- Step Components ---
const Step1 = () => {
  const { register, formState: { errors } } = useFormContext<FullFormData>();
  return (
    <>
      <h2 className="text-h3 font-heading mb-lg">Step 1: Basic Information</h2>
      <div className="grid md:grid-cols-2 gap-lg">
        <div>
          <label htmlFor="vin" className={formLabelStyles}>VIN</label>
          <input type="text" id="vin" {...register('vin')} className={formInputStyles} />
          {errors.vin && <p className={formErrorStyles}>{errors.vin.message}</p>}
        </div>
        <div>
          <label htmlFor="make" className={formLabelStyles}>Make</label>
          <input type="text" id="make" {...register('make')} className={formInputStyles} />
          {errors.make && <p className={formErrorStyles}>{errors.make.message}</p>}
        </div>
        <div>
          <label htmlFor="model" className={formLabelStyles}>Model</label>
          <input type="text" id="model" {...register('model')} className={formInputStyles} />
          {errors.model && <p className={formErrorStyles}>{errors.model.message}</p>}
        </div>
        <div>
          <label htmlFor="year" className={formLabelStyles}>Year</label>
          <input type="number" id="year" {...register('year', { valueAsNumber: true })} className={formInputStyles} />
          {errors.year && <p className={formErrorStyles}>{errors.year.message}</p>}
        </div>
        <div>
          <label htmlFor="mileage" className={formLabelStyles}>Mileage</label>
          <input type="number" id="mileage" {...register('mileage', { valueAsNumber: true })} className={formInputStyles} />
          {errors.mileage && <p className={formErrorStyles}>{errors.mileage.message}</p>}
        </div>
        <div>
          <label htmlFor="price_current" className={formLabelStyles}>Asking Price</label>
          <input type="number" id="price_current" {...register('price_current', { valueAsNumber: true })} className={formInputStyles} />
          {errors.price_current && <p className={formErrorStyles}>{errors.price_current.message}</p>}
        </div>
      </div>
    </>
  );
};

const Step2 = () => {
  const { register, formState: { errors } } = useFormContext<FullFormData>();
  return (
    <>
      <h2 className="text-h3 font-heading mb-lg">Step 2: Detailed Specifications</h2>
      <div className="grid md:grid-cols-2 gap-lg">
        <div>
          <label htmlFor="body_type" className={formLabelStyles}>Body Type</label>
          <select id="body_type" {...register('body_type')} className={formSelectStyles}>
            <option value="" className="bg-primary-deep-blue">Select a body type</option>
            {vehicleBodyTypes.map(type => <option key={type} value={type} className="bg-primary-deep-blue">{type}</option>)}
          </select>
          {errors.body_type && <p className={formErrorStyles}>{errors.body_type.message}</p>}
        </div>
        <div>
          <label htmlFor="fuel_type" className={formLabelStyles}>Fuel Type</label>
          <select id="fuel_type" {...register('fuel_type')} className={formSelectStyles}>
            <option value="" className="bg-primary-deep-blue">Select a fuel type</option>
            {fuelTypes.map(type => <option key={type} value={type} className="bg-primary-deep-blue">{type}</option>)}
          </select>
          {errors.fuel_type && <p className={formErrorStyles}>{errors.fuel_type.message}</p>}
        </div>
        <div>
          <label htmlFor="transmission" className={formLabelStyles}>Transmission</label>
          <select id="transmission" {...register('transmission')} className={formSelectStyles}>
            <option value="" className="bg-primary-deep-blue">Select a transmission type</option>
            {transmissionTypes.map(type => <option key={type} value={type} className="bg-primary-deep-blue">{type}</option>)}
          </select>
          {errors.transmission && <p className={formErrorStyles}>{errors.transmission.message}</p>}
        </div>
        <div>
          <label htmlFor="exterior_color" className={formLabelStyles}>Exterior Color</label>
          <input type="text" id="exterior_color" {...register('exterior_color')} className={formInputStyles} />
          {errors.exterior_color && <p className={formErrorStyles}>{errors.exterior_color.message}</p>}
        </div>
        <div>
          <label htmlFor="interior_color" className={formLabelStyles}>Interior Color (Optional)</label>
          <input type="text" id="interior_color" {...register('interior_color')} className={formInputStyles} />
        </div>
        <div>
          <label htmlFor="engine" className={formLabelStyles}>Engine (Optional)</label>
          <input type="text" id="engine" {...register('engine')} className={formInputStyles} />
        </div>
      </div>
    </>
  );
};

const Step3 = () => {
    const { register, control } = useFormContext<FullFormData>();
    const { fields, append, remove } = useFieldArray({ control, name: "highlights" });

    return (
        <>
            <h2 className="text-h3 font-heading mb-lg">Step 3: Condition & History</h2>
            <div className="space-y-lg">
                <div>
                    <label className={formLabelStyles}>Highlights</label>
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex items-center mt-sm">
                            <input {...register(`highlights.${index}.value`)} className={formInputStyles} />
                            <button type="button" onClick={() => remove(index)} className="ml-sm text-red-400 hover:text-red-300 text-2xl font-bold">&times;</button>
                        </div>
                    ))}
                    <button type="button" onClick={() => append({ value: "" })} className="mt-sm text-sm text-secondary-golden-yellow hover:text-white font-bold">
                        + Add Highlight
                    </button>
                </div>
                <div>
                    <label htmlFor="known_flaws" className={formLabelStyles}>Known Flaws (Optional)</label>
                    <textarea id="known_flaws" {...register('known_flaws')} className={formTextareaStyles} />
                </div>
                <div>
                    <label htmlFor="seller_notes" className={formLabelStyles}>Seller Notes (Optional)</label>
                    <textarea id="seller_notes" {...register('seller_notes')} className={formTextareaStyles} />
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
            <h2 className="text-h3 font-heading mb-lg">Step 4: Review Your Listing</h2>
            <div className="space-y-md bg-glass/50 p-lg rounded-xl border border-glass text-neutral-metallic-silver">
                <h3 className="text-h4 font-heading border-b border-glass pb-sm mb-sm">Basic Information</h3>
                <p><strong>VIN:</strong> {formData.vin}</p>
                <p><strong>Make:</strong> {formData.make}</p>
                <p><strong>Model:</strong> {formData.model}</p>
                <p><strong>Year:</strong> {formData.year}</p>
                <p><strong>Mileage:</strong> {formData.mileage?.toLocaleString()} mi</p>
                <p><strong>Price:</strong> ${formData.price_current?.toLocaleString()}</p>
            </div>
        </>
    );
};

const SellForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const methods = useForm<FullFormData>({ resolver: zodResolver(fullSchema), mode: 'onChange' });
  const mutation = useMutation({
    mutationFn: createListing,
    onSuccess: (data) => {
      alert(`Success! Your listing for the ${data.year} ${data.make} ${data.model} has been created.`);
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const handleNextStep = async () => {
    let isValid = false;
    if (currentStep === 1) isValid = await methods.trigger(["vin", "make", "model", "year", "mileage", "price_current"]);
    else if (currentStep === 2) isValid = await methods.trigger(["body_type", "fuel_type", "transmission", "exterior_color"]);
    else isValid = true;

    if (isValid) setCurrentStep((prev) => prev + 1);
  };
  const handlePreviousStep = () => setCurrentStep((prev) => prev - 1);
  const onSubmit = (data: FullFormData) => {
    const submissionData = { ...data, highlights: data.highlights?.map(h => h.value) };
    mutation.mutate(submissionData);
  };
  const steps = [ <Step1 />, <Step2 />, <Step3 />, <Step4 /> ];

  return (
    <div className="bg-glass border border-glass p-lg rounded-xl shadow-lg">
        <div className="mb-lg">
            <div className="relative pt-1">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-glass">
                    <div style={{ width: `${((currentStep - 1) / (steps.length -1)) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-secondary-gradient transition-all duration-500 rounded"></div>
                </div>
                <p className="text-sm text-neutral-metallic-silver/80">Step {currentStep} of {steps.length}</p>
            </div>
        </div>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            {mutation.isError && (
                <div className="bg-red-900/50 border border-red-500/50 text-red-300 px-md py-sm rounded-lg mb-lg" role="alert">
                    <strong className="font-bold">Error! </strong>
                    <span className="block sm:inline">{mutation.error.message}</span>
                </div>
            )}
            {steps[currentStep - 1]}
            <div className="mt-xl flex justify-between">
              {currentStep > 1 && !mutation.isPending && (
                <button type="button" onClick={handlePreviousStep} className="bg-neutral-metallic-silver/20 hover:bg-neutral-metallic-silver/30 text-white font-bold py-sm px-lg rounded-lg transition-colors">
                  Previous
                </button>
              )}
              {currentStep < steps.length && !mutation.isPending && (
                <button type="button" onClick={handleNextStep} className="bg-primary-gradient text-white font-bold py-sm px-lg rounded-lg hover:opacity-90 ml-auto">
                  Next Step
                </button>
              )}
              {currentStep === steps.length && (
                <button type="submit" disabled={mutation.isPending} className="bg-green-500 text-white font-bold py-sm px-lg rounded-lg hover:bg-green-600 ml-auto disabled:opacity-50">
                  {mutation.isPending ? 'Submitting...' : 'Submit Listing'}
                </button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
  );
};

const SellPage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const isVerified = isAuthenticated;

  const renderContent = () => {
    if (isLoading) {
      return <p className="text-center text-body-lg">Loading user status...</p>;
    }
    if (!isVerified) {
      return <VerificationPrompt />;
    }
    return <SellForm />;
  }

  return (
    <div className="container mx-auto py-xl">
      <div className="text-center mb-xl">
        <h1 className="text-h1 font-heading uppercase">
          Sell Your Car With Us
        </h1>
        <p className="text-body-lg text-neutral-metallic-silver/80 mt-md max-w-3xl mx-auto">
          Follow the steps below to create your listing. Our team will review it and get it live on the auction block!
        </p>
      </div>
      {renderContent()}
    </div>
  );
};

export default SellPage;
