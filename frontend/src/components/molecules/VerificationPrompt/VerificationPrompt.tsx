import { Link } from 'react-router-dom';

const VerificationPrompt = () => {
  return (
    <div className="bg-glass border border-glass rounded-xl p-xl text-center max-w-2xl mx-auto">
      <h2 className="text-h2 font-heading mb-md">Verify Your Account to Sell</h2>
      <p className="text-body-lg text-neutral-metallic-silver/80 mb-lg">
        To ensure the quality and safety of our marketplace, we require all sellers to be verified. Please complete your profile to start selling.
      </p>
      <Link to="/dashboard/settings" className="inline-block bg-primary-gradient hover:opacity-90 text-white font-bold py-sm px-lg rounded-lg transition-opacity">
        Go to Verification
      </Link>
    </div>
  );
};

export default VerificationPrompt;
