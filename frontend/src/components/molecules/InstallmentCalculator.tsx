import React, { useState } from 'react';

// Reverting to local calculation as the backend endpoint is not ready.
// This ensures the UI remains functional for development and testing.
const calculatePayment = (price: number, downPayment: number, term: number, rate: number) => {
  const loanAmount = price - downPayment;
  if (loanAmount <= 0) return { monthlyPayment: 0, loanAmount };
  const monthlyRate = rate / 100 / 12;
  if (monthlyRate === 0) return { monthlyPayment: loanAmount / term, loanAmount };
  const monthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));
  return { monthlyPayment, loanAmount };
};


const InstallmentCalculator: React.FC = () => {
  const [vehiclePrice, setVehiclePrice] = useState('50000');
  const [downPayment, setDownPayment] = useState('10000');
  const [loanTerm, setLoanTerm] = useState('72');
  const [interestRate, setInterestRate] = useState('5.9');

  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { monthlyPayment: newPayment } = calculatePayment(
      parseFloat(vehiclePrice) || 0,
      parseFloat(downPayment) || 0,
      parseInt(loanTerm, 10) || 0,
      parseFloat(interestRate) || 0
    );
    setMonthlyPayment(newPayment);
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
        <button type="submit" className="w-full bg-primary-gradient hover:opacity-90 text-white font-bold py-sm rounded-lg transition-opacity">
          Calculate Payment
        </button>
      </form>

      {monthlyPayment !== null && (
        <div className="mt-lg border-t-2 border-glass pt-lg">
          <h4 className="text-h4 text-center mb-md">Estimated Payment</h4>
          <div className="text-center">
            <span className="text-5xl font-accent text-secondary-golden-yellow">${monthlyPayment.toFixed(2)}</span>
            <span className="text-neutral-metallic-silver/80">/month</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstallmentCalculator;
