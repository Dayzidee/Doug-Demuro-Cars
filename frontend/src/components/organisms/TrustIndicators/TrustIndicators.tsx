import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';

// Icons can be replaced with actual SVG components or an icon library
const CarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 text-secondary-golden-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17l-5-5 1.41-1.41L9 14.17l7.59-7.59L18 8l-9 9z" /></svg>;
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 text-secondary-golden-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.539 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.05 10.1c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.95-.69L11.049 2.927z" /></svg>;
const SupportIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 text-secondary-golden-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const PercentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 text-secondary-golden-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a4 4 0 014-4h10a4 4 0 014 4v12a4 4 0 01-4 4H7z" /></svg>;

interface StatsData {
  carsSold: number;
  averageRating: number;
  financingAvailable: string;
  supportHours: string;
}

const StatItem = ({ value, label, suffix = '', decimals = 0, isNumeric = true, icon }: { value: number | string; label: string; suffix?: string; decimals?: number, isNumeric?: boolean, icon: React.ReactNode }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div ref={ref} className="text-center text-neutral-metallic-silver">
      {icon}
      <p className="text-h3 font-accent bg-clip-text text-transparent bg-primary-gradient">
        {isNumeric && typeof value === 'number' ? (inView ? <CountUp end={value} duration={2.5} separator="," decimals={decimals} /> : '0') : value}
        {suffix}
      </p>
      <p className="mt-sm text-body-sm uppercase tracking-caption">{label}</p>
    </div>
  );
};

const TrustIndicators = () => {
  // Using static data as the API endpoint might not be ready.
  // This can be replaced with the useEffect and fetch logic later.
  const stats: StatsData = { carsSold: 5123, averageRating: 4.9, financingAvailable: "0% APR", supportHours: "24/7" };

  return (
    <section className="py-2xl bg-glass border-y border-glass">
      <div className="container mx-auto">
        <h2 className="text-h2 font-heading uppercase text-center mb-xl">Built on Trust</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-lg">
          <StatItem icon={<CarIcon />} value={stats.carsSold} label="Cars Sold" suffix="+" isNumeric />
          <StatItem icon={<StarIcon />} value={stats.averageRating} label="Average Rating" suffix="/5" decimals={1} isNumeric />
          <StatItem icon={<PercentIcon />} value={stats.financingAvailable} label="Financing Available" isNumeric={false} />
          <StatItem icon={<SupportIcon />} value={stats.supportHours} label="Support" isNumeric={false} />
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;
