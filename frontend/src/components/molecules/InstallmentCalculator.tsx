import React, { useState, useEffect } from 'react';

interface CalculationResult {
  monthly_payment: number;
  total_loan_amount: number;
  total_interest_paid: number;
  total_cost_of_loan: number;
  total_cost_of_vehicle: number;
}

interface InstallmentCalculatorProps {
  defaultPrice?: number;
}

const InstallmentCalculator: React.FC<InstallmentCalculatorProps> = ({ defaultPrice }) => {
  const [vehiclePrice, setVehiclePrice] = useState(defaultPrice?.toString() || '50000');
  const [downPayment, setDownPayment] = useState('10000');
  const [loanTerm, setLoanTerm] = useState('72');
  const [interestRate, setInterestRate] = useState('5.9');

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (defaultPrice) {
      setVehiclePrice(defaultPrice.toString());
    }
  }, [defaultPrice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/v1/tools/calculate-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicle_price: parseFloat(vehiclePrice) || 0,
          down_payment: parseFloat(downPayment) || 0,
          loan_term_months: parseInt(loanTerm, 10) || 0,
          annual_interest_rate: parseFloat(interestRate) || 0,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Calculation failed');
      setResult(data);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-white">
      <h3 className="text-xl font-bold text-center mb-4">Payment Calculator</h3>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="vehiclePrice" className="block text-sm font-medium text-gray-300 mb-1">Vehicle Price ($)</label>
            <input type="number" id="vehiclePrice" value={vehiclePrice} onChange={(e) => setVehiclePrice(e.target.value)} className="w-full bg-gray-800 rounded border border-gray-700 p-2" />
          </div>
          <div>
            <label htmlFor="downPayment" className="block text-sm font-medium text-gray-300 mb-1">Down Payment ($)</label>
            <input type="number" id="downPayment" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} className="w-full bg-gray-800 rounded border border-gray-700 p-2" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-300 mb-1">Term (mo)</label>
              <input type="number" id="loanTerm" value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} className="w-full bg-gray-800 rounded border border-gray-700 p-2" />
            </div>
            <div>
              <label htmlFor="interestRate" className="block text-sm font-medium text-gray-300 mb-1">Rate (%)</label>
              <input type="number" step="0.1" id="interestRate" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="w-full bg-gray-800 rounded border border-gray-700 p-2" />
            </div>
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors disabled:bg-gray-500">
          {loading ? 'Calculating...' : 'Calculate'}
        </button>
      </form>

      {error && <div className="mt-4 text-center text-red-400 bg-red-900/30 p-2 rounded-lg text-sm">{error}</div>}

      {result && (
        <div className="mt-6 border-t-2 border-gray-700 pt-4">
          <div className="text-center">
            <span className="text-3xl font-bold text-blue-400">${result.monthly_payment.toFixed(2)}</span>
            <span className="text-gray-400 text-sm">/month</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstallmentCalculator;
