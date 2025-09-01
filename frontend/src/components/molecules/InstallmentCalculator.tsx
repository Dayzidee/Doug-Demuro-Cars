import React, { useState } from 'react';

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
  const [loanTerm, setLoanTerm] = useState('72'); // months
  const [interestRate, setInterestRate] = useState('5.9'); // annual %

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/v1/tools/calculate-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vehicle_price: parseFloat(vehiclePrice) || 0,
          down_payment: parseFloat(downPayment) || 0,
          loan_term_months: parseInt(loanTerm, 10) || 0,
          annual_interest_rate: parseFloat(interestRate) || 0,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Calculation failed');
      }

      setResult(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 p-8 rounded-lg shadow-2xl max-w-2xl mx-auto text-white">
      <h3 className="text-2xl font-bold text-center mb-6">Payment Calculator</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="vehiclePrice" className="block text-sm font-medium text-gray-300 mb-1">Vehicle Price ($)</label>
            <input type="number" id="vehiclePrice" value={vehiclePrice} onChange={(e) => setVehiclePrice(e.target.value)} className="w-full bg-gray-800 rounded border border-gray-700 focus:border-blue-500 p-2 text-white" placeholder="e.g., 50000" />
          </div>
          <div>
            <label htmlFor="downPayment" className="block text-sm font-medium text-gray-300 mb-1">Down Payment ($)</label>
            <input type="number" id="downPayment" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} className="w-full bg-gray-800 rounded border border-gray-700 focus:border-blue-500 p-2 text-white" placeholder="e.g., 10000" />
          </div>
          <div>
            <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-300 mb-1">Loan Term (months)</label>
            <input type="number" id="loanTerm" value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} className="w-full bg-gray-800 rounded border border-gray-700 focus:border-blue-500 p-2 text-white" placeholder="e.g., 72" />
          </div>
          <div>
            <label htmlFor="interestRate" className="block text-sm font-medium text-gray-300 mb-1">Interest Rate (%)</label>
            <input type="number" step="0.1" id="interestRate" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="w-full bg-gray-800 rounded border border-gray-700 focus:border-blue-500 p-2 text-white" placeholder="e.g., 5.9" />
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed">
          {loading ? 'Calculating...' : 'Calculate Payment'}
        </button>
      </form>

      {error && <div className="mt-6 text-center text-red-400 bg-red-900/30 p-3 rounded-lg">{error}</div>}

      {result && (
        <div className="mt-8 border-t-2 border-gray-700 pt-6">
          <h4 className="text-xl font-bold text-center mb-4">Estimated Payment</h4>
          <div className="text-center mb-6">
            <span className="text-5xl font-bold text-blue-400">${result.monthly_payment.toFixed(2)}</span>
            <span className="text-gray-400">/month</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-center">
            <div className="bg-gray-800 p-3 rounded-lg"><span className="block text-gray-400">Loan Amount</span><span className="font-semibold text-lg">${result.total_loan_amount.toFixed(2)}</span></div>
            <div className="bg-gray-800 p-3 rounded-lg"><span className="block text-gray-400">Total Interest</span><span className="font-semibold text-lg">${result.total_interest_paid.toFixed(2)}</span></div>
            <div className="bg-gray-800 p-3 rounded-lg col-span-1 sm:col-span-2"><span className="block text-gray-400">Total Vehicle Cost</span><span className="font-semibold text-lg">${result.total_cost_of_vehicle.toFixed(2)}</span></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstallmentCalculator;
