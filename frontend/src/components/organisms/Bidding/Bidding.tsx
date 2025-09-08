import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { fetchBidHistory, postNewBid, Bid } from '../../../services/api';

interface BiddingProps {
  vehicleId: string;
}

interface BidFormData {
    amount: number;
}

const Bidding = ({ vehicleId }: BiddingProps) => {
    const queryClient = useQueryClient();

    const { data: bidHistory, isLoading, isError, error } = useQuery<Bid[]>({
        queryKey: ['bids', vehicleId],
        queryFn: () => fetchBidHistory(vehicleId),
        // Refetch every 30 seconds to simulate real-time updates
        refetchInterval: 30000,
    });

    const { register, handleSubmit, reset, formState: { errors } } = useForm<BidFormData>();

    const mutation = useMutation({
        mutationFn: postNewBid,
        onSuccess: () => {
            // When a new bid is placed, invalidate the bid history query to refetch it
            queryClient.invalidateQueries({ queryKey: ['bids', vehicleId] });
            reset(); // Reset the form
        },
    });

    const onSubmit = (data: BidFormData) => {
        mutation.mutate({ vehicleId, amount: data.amount });
    };

    const highestBid = bidHistory && bidHistory.length > 0 ? bidHistory[0].amount : 0;

    return (
        <div className="mt-6 border-t pt-6">
            <h2 className="text-2xl font-bold mb-4">Bidding</h2>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-lg">Current Highest Bid:</p>
                {isLoading && <p>Loading...</p>}
                {!isLoading && <p className="text-3xl font-bold text-green-600">${highestBid.toLocaleString()}</p>}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="bid_amount" className="block text-sm font-medium text-gray-700">Your Bid Amount</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                            type="number"
                            id="bid_amount"
                            {...register('amount', { required: 'Bid amount is required', valueAsNumber: true, min: highestBid + 1 })}
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                            placeholder={(highestBid + 1).toString()}
                        />
                    </div>
                    {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
                </div>
                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full px-6 py-3 font-semibold rounded-lg bg-primary-gradient text-white hover:opacity-90 disabled:opacity-50"
                >
                    {mutation.isPending ? 'Placing Bid...' : 'Place Bid'}
                </button>
                {mutation.isError && (
                    <p className="text-red-500 text-xs mt-1">Error placing bid: {mutation.error.message}</p>
                )}
            </form>

            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-2">Bid History</h3>
                {isLoading && <p>Loading history...</p>}
                {isError && <p className="text-red-500">Error loading history: {error.message}</p>}
                <ul className="space-y-2">
                    {bidHistory?.map(bid => (
                        <li key={bid.id} className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm">
                            <div>
                                <p className="font-semibold text-charcoal">${bid.amount.toLocaleString()}</p>
                                <p className="text-sm text-gray-500">by {bid.user_full_name || 'Anonymous'}</p>
                            </div>
                            <p className="text-xs text-gray-400">{new Date(bid.created_at).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Bidding;
