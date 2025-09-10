import { Construction } from 'lucide-react';

const PlaceholderPage = ({ title }: { title: string }) => {
    return (
        <div className="container mx-auto py-2xl text-center">
            <Construction size={64} className="mx-auto text-secondary-golden-yellow mb-md" />
            <h1 className="text-h1 font-heading uppercase">
                {title}
            </h1>
            <p className="text-body-lg text-neutral-metallic-silver/80 mt-md">
                This page is under construction. Check back soon!
            </p>
        </div>
    );
};

export default PlaceholderPage;
