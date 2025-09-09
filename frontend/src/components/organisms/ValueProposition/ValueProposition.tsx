import { CircleDollarSign, Rocket, Target } from 'lucide-react';

const ValueProposition = () => {
  const benefits = [
    {
      icon: <CircleDollarSign size={48} />,
      title: "Get 90% of Your Car's Value",
      description: "We believe in fair pricing. You get the lion's share of your car's final sale price, well above industry averages."
    },
    {
      icon: <Rocket size={48} />,
      title: "Quick to Auction",
      description: "Your listing will be live in a week or less. Our streamlined process gets your car in front of buyers, fast."
    },
    {
      icon: <Target size={48} />,
      title: "Targeted Marketing",
      description: "We don't just list your car; we market it. Our campaigns attract the right audience of serious buyers."
    }
  ];

  return (
    <section className="py-2xl">
      <div className="container mx-auto text-center">
        <h2 className="text-h2 font-heading uppercase mb-md text-white">
          Sell Your Car, The <span className="bg-clip-text text-transparent bg-primary-gradient">Smarter</span> Way
        </h2>
        <p className="text-body-lg text-neutral-metallic-silver/80 mb-xl max-w-3xl mx-auto">
          Selling your car shouldn't be a hassle. We provide a premium, transparent service that maximizes your return and minimizes your effort.
        </p>
        <div className="grid md:grid-cols-3 gap-lg">
          {benefits.map((benefit, index) => (
            <div key={index} className="p-lg bg-glass rounded-xl border border-glass transition-all duration-300 hover:border-secondary-golden-yellow/50 hover:-translate-y-2">
              <div className="text-secondary-golden-yellow mx-auto mb-md w-fit">
                {benefit.icon}
              </div>
              <h3 className="text-h4 font-heading text-white mt-md mb-sm">
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
