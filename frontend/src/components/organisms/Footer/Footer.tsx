import { Youtube, Instagram, Facebook, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const footerSections = {
  "sections": [
    {
      "title": "Why Cars & Bids?",
      "stats": [
        { "label": "Auctions completed", "value": "29K+" },
        { "label": "Value of cars sold", "value": "$645M+" },
        { "label": "Sell-through rate", "value": "82%+" },
        { "label": "Registered members", "value": "900K+" }
      ]
    },
    {
      "title": "Customer Love",
      "testimonial": {
        "author": "Geoff A",
        "date": "May 2024",
        "content": "Great selling experience! It went smooth from start to finish. I would recommend highly!",
        "rating": "5 stars"
      }
    },
    {
      "title": "Newsletter Signup",
      "form": "Email input with gradient submit button",
      "promise": "Get daily deals and auction alerts"
    }
  ],
  "linkColumns": [
    {
      "title": "How it Works",
      "links": ["SafePay", "Buying a Car", "Selling a Car", "Finalizing the Sale", "FAQs"]
    },
    {
      "title": "Sellers",
      "links": ["Submit Your Car", "Dashboard", "Certified Sellers", "Photo Guide", "Book a Photo Shoot", "Inspections"]
    },
    {
      "title": "Helpful Links",
      "links": ["Browse", "Community", "Events", "Support", "Shipping", "Financing", "This Car Pod!", "Shop C&B Merch", "Careers"]
    }
  ],
};


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
          {footerSections.linkColumns.map((column) => (
            <div key={column.title}>
              <h3 className="font-heading text-lg uppercase mb-4">{column.title}</h3>
              <ul>
                {column.links.map((link) => (
                  <li key={link} className="mb-2">
                    <Link to="#" className="text-neutral-metallic-silver hover:text-white transition-colors">{link}</Link>
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
