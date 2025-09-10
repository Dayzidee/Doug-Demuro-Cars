import { Youtube, Instagram, Facebook, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const linkColumns = [
    {
      title: "How it Works",
      links: [
        { label: "SafePay", path: "/how-it-works/safepay" },
        { label: "Buying a Car", path: "/how-it-works/buying" },
        { label: "Selling a Car", path: "/sell" },
        { label: "FAQs", path: "/faqs" },
      ]
    },
    {
      title: "Sellers",
      links: [
        { label: "Submit Your Car", path: "/sell" },
        { label: "Dashboard", path: "/dashboard/selling" },
        { label: "Photo Guide", path: "/guides/photography" },
      ]
    },
    {
      title: "Helpful Links",
      links: [
        { label: "Browse", path: "/inventory" },
        { label: "Community", path: "/community" },
        { label: "Support", path: "/support" },
        { label: "Careers", path: "/careers" },
      ]
    }
];


const SocialLinks = () => (
  <div className="flex space-x-4">
    <a href="#" className="text-neutral-metallic-silver hover:text-white"><Youtube /></a>
    <a href="#" className="text-neutral-metallic-silver hover:text-white"><Instagram /></a>
    <a href="#" className="text-neutral-metallic-silver hover:text-white"><Facebook /></a>
    <a href="#" className="text-neutral-metallic-silver hover:text-white"><Twitter /></a>
  </div>
);

const Footer = () => {
  return (
    <footer className="bg-neutral-charcoal-black text-white py-16">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {linkColumns.map((column) => (
            <div key={column.title}>
              <h3 className="font-heading text-lg uppercase mb-4">{column.title}</h3>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label} className="mb-2">
                    <Link to={link.path} className="text-neutral-metallic-silver hover:text-white transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="font-heading text-lg uppercase mb-4">Newsletter</h3>
            <p className="text-neutral-metallic-silver mb-4">Get daily deals and auction alerts</p>
            <form className="flex">
              <input type="email" placeholder="Your email" className="bg-backgrounds-card p-2 rounded-l-md flex-grow focus:outline-none focus:ring-2 focus:ring-primary-electric-cyan" />
              <button type="submit" className="bg-primary-gradient text-white p-2 rounded-r-md">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-glass flex justify-between items-center">
          <p className="text-neutral-metallic-silver">&copy; {new Date().getFullYear()} Doug DeNero Cars and Promos LLC</p>
          <SocialLinks />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
