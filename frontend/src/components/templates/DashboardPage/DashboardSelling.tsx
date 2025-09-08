import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockVehicleData } from '../../../data/mockVehicleData';
import { Vehicle } from '../../../services/api';

const ListingRow = ({ vehicle }: { vehicle: Vehicle & { status: string } }) => (
    <div className="flex items-center justify-between p-md border-b border-glass last:border-b-0 hover:bg-glass/50 transition-colors">
        <div>
            <Link to={`/inventory/${vehicle.id}`} className="font-bold hover:text-secondary-golden-yellow">{vehicle.year} {vehicle.make} {vehicle.model}</Link>
            <p className="text-sm text-neutral-metallic-silver/70">Status: {vehicle.status}</p>
        </div>
        <div>
            <Link to={`/dashboard/selling/edit/${vehicle.id}`} className="bg-primary-gradient text-white font-bold py-xs px-sm rounded-md text-sm hover:opacity-90">Manage</Link>
        </div>
    </div>
);

const DashboardSelling = () => {
  const [activeTab, setActiveTab] = useState('Live');

  // Explicitly type the listings object
  const listings: { [key: string]: (Vehicle & { status: string })[] } = {
    'Live': mockVehicleData.slice(0, 1).map(v => ({...v, status: 'Live Auction'})),
    'In Progress': mockVehicleData.slice(1, 2).map(v => ({...v, status: 'Awaiting Approval'})),
    'Sold': mockVehicleData.slice(2, 4).map(v => ({...v, status: `Sold for $${(v.price * 1.1).toLocaleString()}`})),
  };

  const tabs = ['Live', 'In Progress', 'Sold'];

  const TabButton = ({ tabName }: { tabName: string }) => (
      <button
        onClick={() => setActiveTab(tabName)}
        className={`px-lg py-sm font-bold transition-colors ${activeTab === tabName ? 'border-b-2 border-secondary-golden-yellow text-white' : 'text-neutral-metallic-silver/70 hover:text-white'}`}
      >
          {tabName}
      </button>
  );

  return (
    <div>
      <h1 className="text-h2 font-heading mb-lg">Selling Center</h1>

      <div className="bg-glass/50 border border-glass rounded-xl p-lg">
        <div className="border-b border-glass mb-md">
            <nav className="-mb-px flex space-x-lg" aria-label="Tabs">
                {tabs.map(tab => <TabButton key={tab} tabName={tab} />)}
            </nav>
        </div>

        <div>
            {listings[activeTab].length > 0 ? (
                listings[activeTab].map((vehicle: Vehicle & { status: string }) => <ListingRow key={vehicle.id} vehicle={vehicle} />)
            ) : (
                <p className="text-neutral-metallic-silver/70 p-md">No listings in this category.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default DashboardSelling;
