import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import { Car, Star, LifeBuoy, Percent } from 'lucide-react';

interface StatsData {
  carsSold: number;
  averageRating: number;
  financingAvailable: string;
  supportHours: string;
}

const StatItem = ({ value, label, suffix = '', decimals = 0, isNumeric = true, icon }: { value: number | string; label: string; suffix?: string; decimals?: number, isNumeric?: boolean, icon: React.ReactNode }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div ref={ref} className="text-center text-white bg-glass p-lg rounded-xl border border-glass transition-all duration-300 hover:border-secondary-golden-yellow/50 hover:-translate-y-2">
      <div className="text-secondary-golden-yellow mx-auto mb-sm w-fit">
        {icon}
      </div>
      <p className="text-h3 font-accent bg-clip-text text-transparent bg-primary-gradient">
        {isNumeric && typeof value === 'number' ? (inView ? <CountUp end={value} duration={2.5} separator="," decimals={decimals} /> : '0') : value}
        {suffix}
      </p>
      <p className="mt-sm text-body-sm uppercase tracking-caption text-neutral-metallic-silver/80">{label}</p>
    </div>
  );
};

const TrustIndicators = () => {
  const stats: StatsData = { carsSold: 5123, averageRating: 4.9, financingAvailable: "0% APR", supportHours: "24/7" };

  return (
    <section className="py-2xl">
      <div className="container mx-auto">
        <h2 className="text-h2 font-heading uppercase text-center mb-xl">Built on Trust</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-lg">
          <StatItem icon={<Car size={40} />} value={stats.carsSold} label="Cars Sold" suffix="+" isNumeric />
          <StatItem icon={<Star size={40} />} value={stats.averageRating} label="Average Rating" suffix="/5" decimals={1} isNumeric />
          <StatItem icon={<Percent size={40} />} value={stats.financingAvailable} label="Financing Available" isNumeric={false} />
          <StatItem icon={<LifeBuoy size={40} />} value={stats.supportHours} label="Support" isNumeric={false} />
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;
