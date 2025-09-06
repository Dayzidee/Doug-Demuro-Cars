import React from 'react';

const DollarSignIcon = () => <svg className="w-12 h-12 mx-auto text-secondary-golden-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 10v-2m0-4h.01M4.93 4.93l.707.707M4.93 19.07l.707-.707M19.07 4.93l-.707.707M19.07 19.07l-.707-.707" /></svg>;
const RocketIcon = () => <svg className="w-12 h-12 mx-auto text-secondary-golden-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const TargetIcon = () => <svg className="w-12 h-12 mx-auto text-secondary-golden-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;

const ValueProposition = () => {
  const benefits = [
    {
      icon: <DollarSignIcon />,
      title: "Get 90% of Your Car's Value",
      description: "We believe in fair pricing. You get the lion's share of your car's final sale price, well above industry averages."
    },
    {
      icon: <RocketIcon />,
      title: "Quick to Auction",
      description: "Your listing will be live in a week or less. Our streamlined process gets your car in front of buyers, fast."
    },
    {
      icon: <TargetIcon />,
      title: "Targeted Marketing",
      description: "We don't just list your car; we market it. Our campaigns attract the right audience of serious buyers."
    }
  ];

  return (
    <section className="py-2xl">
      <div className="container mx-auto text-center">
        <h2 className="text-h2 font-heading uppercase mb-md text-neutral-metallic-silver">
          Sell Your Car, The <span className="bg-clip-text text-transparent bg-primary-gradient">Smarter</span> Way
        </h2>
        <p className="text-body-lg text-neutral-metallic-silver/80 mb-xl max-w-3xl mx-auto">
          Selling your car shouldn't be a hassle. We provide a premium, transparent service that maximizes your return and minimizes your effort.
        </p>
        <div className="grid md:grid-cols-3 gap-lg">
          {benefits.map((benefit, index) => (
            <div key={index} className="p-lg bg-glass rounded-xl border border-glass">
              {benefit.icon}
              <h3 className="text-h4 font-heading text-neutral-metallic-silver mt-md mb-sm">
                {benefit.title}
              </h3>
              <p className="text-body text-neutral-metallic-silver/80">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
