import { Link } from 'react-router-dom';

// Placeholder data
const activeBids = [
  { id: '1', vehicle: '2021 Porsche 911 GT3', currentBid: 185000, myBid: 185000, status: 'Winning' },
  { id: '2', vehicle: '1995 BMW M3', currentBid: 45000, myBid: 44500, status: 'Outbid' },
];

const pastBids = [
  { id: '3', vehicle: '2022 Ford Bronco Raptor', finalBid: 82000, result: 'Won' },
  { id: '4', vehicle: '2005 Acura NSX', finalBid: 110000, result: 'Lost' },
];

const BidRow = ({ bid, isPast = false }: { bid: any, isPast?: boolean }) => (
    <tr className="border-b border-glass last:border-b-0">
        <td className="py-md px-md"><Link to={`/inventory/${bid.id}`} className="hover:text-secondary-golden-yellow">{bid.vehicle}</Link></td>
        {isPast ? (
            <td className="py-md px-md">${bid.finalBid.toLocaleString()}</td>
        ) : (
            <>
                <td className="py-md px-md">${bid.currentBid.toLocaleString()}</td>
                <td className="py-md px-md">${bid.myBid.toLocaleString()}</td>
            </>
        )}
        <td className={`py-md px-md font-bold ${bid.status === 'Winning' || bid.result === 'Won' ? 'text-green-400' : 'text-red-400'}`}>
            {isPast ? bid.result : bid.status}
        </td>
    </tr>
);

const DashboardBids = () => {
  return (
    <div>
      <h1 className="text-h2 font-heading mb-lg">My Bids</h1>

      <div className="bg-glass/50 border border-glass rounded-xl p-lg mb-lg">
        <h2 className="text-h3 font-heading mb-md">Active Bids</h2>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-glass text-sm uppercase tracking-caption text-neutral-metallic-silver/70">
                        <th className="py-sm px-md">Vehicle</th>
                        <th className="py-sm px-md">Current Bid</th>
                        <th className="py-sm px-md">My Bid</th>
                        <th className="py-sm px-md">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {activeBids.map(bid => <BidRow key={bid.id} bid={bid} />)}
                </tbody>
            </table>
        </div>
      </div>

      <div className="bg-glass/50 border border-glass rounded-xl p-lg">
        <h2 className="text-h3 font-heading mb-md">Bid History</h2>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-glass text-sm uppercase tracking-caption text-neutral-metallic-silver/70">
                        <th className="py-sm px-md">Vehicle</th>
                        <th className="py-sm px-md">Final Bid</th>
                        <th className="py-sm px-md">Result</th>
                    </tr>
                </thead>
                <tbody>
                    {pastBids.map(bid => <BidRow key={bid.id} bid={bid} isPast />)}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardBids;
