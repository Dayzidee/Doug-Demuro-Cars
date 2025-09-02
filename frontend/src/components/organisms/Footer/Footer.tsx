import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary-deep-blue text-neutral-metallic-silver pt-2xl pb-lg">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-xl">
          <div>
            <h3 className="font-heading text-h4 uppercase mb-md">How it Works</h3>
            <ul className="space-y-sm">
              <li><Link to="/how-it-works/safepay" className="hover:text-secondary-golden-yellow">SafePay</Link></li>
              <li><Link to="/how-it-works/buying" className="hover:text-secondary-golden-yellow">Buying a Car</Link></li>
              <li><Link to="/how-it-works/selling" className="hover:text-secondary-golden-yellow">Selling a Car</Link></li>
              <li><Link to="/faq" className="hover:text-secondary-golden-yellow">FAQs</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-heading text-h4 uppercase mb-md">Sellers</h3>
            <ul className="space-y-sm">
              <li><Link to="/sell" className="hover:text-secondary-golden-yellow">Submit Your Car</Link></li>
              <li><Link to="/dashboard" className="hover:text-secondary-golden-yellow">Dashboard</Link></li>
              <li><Link to="/sellers/inspections" className="hover:text-secondary-golden-yellow">Inspections</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-heading text-h4 uppercase mb-md">Helpful Links</h3>
            <ul className="space-y-sm">
              <li><Link to="/inventory" className="hover:text-secondary-golden-yellow">Browse</Link></li>
              <li><Link to="/community" className="hover:text-secondary-golden-yellow">Community</Link></li>
              <li><Link to="/support" className="hover:text-secondary-golden-yellow">Support</Link></li>
              <li><Link to="/merch" className="hover:text-secondary-golden-yellow">Shop C&B Merch</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-heading text-h4 uppercase mb-md">Newsletter</h3>
            <p className="mb-md">Get daily deals and auction alerts.</p>
            <form>
              <div className="flex">
                <input type="email" placeholder="Your email" className="bg-glass border border-glass rounded-l-md p-sm w-full text-white placeholder-neutral-metallic-silver/50" />
                <button type="submit" className="bg-primary-gradient text-white font-bold rounded-r-md px-md">Sign Up</button>
              </div>
            </form>
          </div>
        </div>
        <div className="mt-xl pt-lg border-t border-glass text-center text-sm text-neutral-metallic-silver/70">
          <p>&copy; {new Date().getFullYear()} Cars and Bids LLC. All Rights Reserved.</p>
          <div className="mt-sm">
            <Link to="/terms" className="mr-md hover:text-secondary-golden-yellow">Terms of Use</Link>
            <Link to="/privacy" className="hover:text-secondary-golden-yellow">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
