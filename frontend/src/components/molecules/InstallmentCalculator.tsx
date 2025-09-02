import React, { useState } from 'react';
import apiClient from '../../../services/api';

// Type for the calculation result from the backend
interface CalculationResult {
  monthly_payment: number;
  total_loan_amount: number;
  total_interest_paid: number;
  total_cost_of_loan: number;
  total_cost_of_vehicle: number;
}

const InstallmentCalculator: React.FC = () => {
  const [vehiclePrice, setVehiclePrice] = useState('50000');
  const [downPayment, setDownPayment] = useState('10000');
  const [loanTerm, setLoanTerm] = useState('72');
  const [interestRate, setInterestRate] = useState('5.9');

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await apiClient.post('/tools/calculate-payment', {
        vehicle_price: parseFloat(vehiclePrice) || 0,
        down_payment: parseFloat(downPayment) || 0,
        loan_term_months: parseInt(loanTerm, 10) || 0,
        annual_interest_rate: parseFloat(interestRate) || 0,
      });
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = "w-full bg-glass border-b-2 border-glass p-sm text-white placeholder-neutral-metallic-silver/50 focus:outline-none focus:border-secondary-golden-yellow transition-colors";

  return (
    <div className="bg-glass/50 border border-glass p-lg rounded-xl shadow-2xl max-w-2xl mx-auto text-neutral-metallic-silver">
      <h3 className="text-h3 font-heading text-center mb-lg">Payment Calculator</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mb-lg">
          <div>
            <label htmlFor="vehiclePrice" className="block text-sm font-medium text-neutral-metallic-silver/80 mb-xs">Vehicle Price ($)</label>
            <input type="number" id="vehiclePrice" value={vehiclePrice} onChange={(e) => setVehiclePrice(e.target.value)} className={inputStyles} placeholder="e.g., 50000" />
          </div>
          <div>
            <label htmlFor="downPayment" className="block text-sm font-medium text-neutral-metallic-silver/80 mb-xs">Down Payment ($)</label>
            <input type="number" id="downPayment" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} className={inputStyles} placeholder="e.g., 10000" />
          </div>
          <div>
            <label htmlFor="loanTerm" className="block text-sm font-medium text-neutral-metallic-silver/80 mb-xs">Loan Term (months)</label>
            <input type="number" id="loanTerm" value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} className={inputStyles} placeholder="e.g., 72" />
          </div>
          <div>
            <label htmlFor="interestRate" className="block text-sm font-medium text-neutral-metallic-silver/80 mb-xs">Interest Rate (%)</label>
            <input type="number" step="0.1" id="interestRate" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className={inputStyles} placeholder="e.g., 5.9" />
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-primary-gradient hover:opacity-90 text-white font-bold py-sm rounded-lg transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? 'Calculating...' : 'Calculate Payment'}
        </button>
      </form>

      {error && <div className="mt-md text-center text-red-400 bg-red-900/30 p-sm rounded-lg">{error}</div>}

      {result && (
        <div className="mt-lg border-t-2 border-glass pt-lg">
          <h4 className="text-h4 text-center mb-md">Estimated Payment</h4>
          <div className="text-center mb-md">
            <span className="text-5xl font-accent text-secondary-golden-yellow">${result.monthly_payment.toFixed(2)}</span>
            <span className="text-neutral-metallic-silver/80">/month</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md text-sm text-center">
            <div className="bg-glass p-sm rounded-lg"><span className="block text-neutral-metallic-silver/70">Loan Amount</span><span className="font-semibold text-lg">${result.total_loan_amount.toFixed(2)}</span></div>
            <div className="bg-glass p-sm rounded-lg"><span className="block text-neutral-metallic-silver/70">Total Interest</span><span className="font-semibold text-lg">${result.total_interest_paid.toFixed(2)}</span></div>
            <div className="bg-glass p-sm rounded-lg col-span-1 sm:col-span-2"><span className="block text-neutral-metallic-silver/70">Total Vehicle Cost</span><span className="font-semibold text-lg">${result.total_cost_of_vehicle.toFixed(2)}</span></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstallmentCalculator;
