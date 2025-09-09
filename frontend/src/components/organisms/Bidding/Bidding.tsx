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
            queryClient.invalidateQueries({ queryKey: ['bids', vehicleId] });
            reset();
        },
    });

    const onSubmit = (data: BidFormData) => {
        mutation.mutate({ vehicleId, amount: data.amount });
    };

    const highestBid = bidHistory && bidHistory.length > 0 ? bidHistory[0].amount : 0;
    const formInputStyles = "w-full bg-backgrounds-card border border-glass p-sm text-white placeholder-neutral-metallic-silver/50 focus:outline-none focus:ring-2 focus:ring-primary-electric-cyan transition-all duration-300 rounded-md pl-7";

    return (
        <div>
            <div className="bg-glass/50 p-lg rounded-lg mb-lg text-center">
                <p className="text-lg text-white/80">Current Highest Bid:</p>
                {isLoading && <p className="text-3xl font-bold text-secondary-golden-yellow animate-pulse">Loading...</p>}
                {!isLoading && <p className="text-3xl font-bold text-secondary-golden-yellow">${highestBid.toLocaleString()}</p>}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-md">
                <div>
                    <label htmlFor="bid_amount" className="sr-only">Your Bid Amount</label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-neutral-metallic-silver/50 sm:text-sm">$</span>
                        </div>
                        <input
                            type="number"
                            id="bid_amount"
                            {...register('amount', { required: 'Bid amount is required', valueAsNumber: true, min: { value: highestBid + 1, message: `Must be > $${highestBid.toLocaleString()}` }})}
                            className={formInputStyles}
                            placeholder={(highestBid + 1).toString()}
                        />
                    </div>
                    {errors.amount && <p className="text-red-400 text-xs mt-xs">{errors.amount.message}</p>}
                </div>
                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full px-6 py-sm font-semibold rounded-lg bg-primary-gradient text-white hover:opacity-90 disabled:opacity-50"
                >
                    {mutation.isPending ? 'Placing Bid...' : 'Place Bid'}
                </button>
                {mutation.isError && (
                    <p className="text-red-400 text-xs mt-1 text-center">Error placing bid: {mutation.error.message}</p>
                )}
            </form>

            <div className="mt-lg">
                <h3 className="text-xl font-semibold mb-md">Bid History</h3>
                {isLoading && <p className="text-white/70">Loading history...</p>}
                {isError && <p className="text-red-400">Error loading history: {error.message}</p>}
                <ul className="space-y-sm">
                    {bidHistory?.map(bid => (
                        <li key={bid.id} className="flex justify-between items-center bg-glass p-sm rounded-md">
                            <div>
                                <p className="font-semibold text-white">${bid.amount.toLocaleString()}</p>
                                <p className="text-sm text-neutral-metallic-silver/70">by {bid.user_full_name || 'Anonymous'}</p>
                            </div>
                            <p className="text-xs text-neutral-metallic-silver/70">{new Date(bid.created_at).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Bidding;
