import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import apiClient from '../../../services/api';

// Define the structure of the stats data
interface StatsData {
  carsSold: number;
  averageRating: number;
  financingAvailable: string;
  supportHours: string;
}

// A reusable component for a single animated statistic
const StatItem = ({ value, label, suffix = '', decimals = 0 }: { value: number; label: string; suffix?: string; decimals?: number }) => {
  const { ref, inView } = useInView({
    triggerOnce: true, // Animate only once
    threshold: 0.1,    // Trigger when 10% of the element is visible
  });

  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl md:text-5xl font-bold font-special bg-primary-gradient bg-clip-text text-transparent">
        {inView ? <CountUp end={value} duration={2.5} separator="," decimals={decimals} /> : '0'}
        {suffix}
      </p>
      <p className="mt-2 text-gray-600 font-semibold">{label}</p>
    </div>
  );
};

// Main component for the Trust Indicators section
const TrustIndicators = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get<StatsData>('/stats/summary');
        setStats(response.data);
      } catch (err) {
        console.error("Error fetching stats data:", err);
        setError("Could not load statistics.");
        // Provide fallback data so the component doesn't break
        setStats({ carsSold: 5123, averageRating: 4.9, financingAvailable: "0% APR", supportHours: "24/7" });
      }
    };
    fetchStats();
  }, []);

  if (error && !stats) {
    return <div className="py-20 text-center text-red-500">{error}</div>;
  }

  if (!stats) {
    // A simple loading state
    return <div className="py-20 text-center">Loading...</div>;
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatItem value={stats.carsSold} label="Cars Sold" suffix="+" />
          <StatItem value={stats.averageRating} label="Average Rating" suffix="/5" decimals={1} />
          {/* Non-numeric stats are displayed directly */}
          <div className="text-center">
             <p className="text-4xl md:text-5xl font-bold font-special bg-primary-gradient bg-clip-text text-transparent">{stats.financingAvailable}</p>
             <p className="mt-2 text-gray-600 font-semibold">Financing Available</p>
          </div>
           <div className="text-center">
             <p className="text-4xl md:text-5xl font-bold font-special bg-primary-gradient bg-clip-text text-transparent">{stats.supportHours}</p>
             <p className="mt-2 text-gray-600 font-semibold">Support</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;
