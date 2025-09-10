import PromotionsManager from '../../organisms/PromotionsManager';

const AdminPromotionsPage: React.FC = () => {
  return (
    <div className="container mx-auto py-xl">
      <div className="text-center mb-xl">
        <h1 className="text-h1 font-heading uppercase">
          Manage <span className="bg-clip-text text-transparent bg-secondary-gradient">Promotions</span>
        </h1>
        <p className="text-body-lg text-neutral-metallic-silver/80 mt-md max-w-3xl mx-auto">
          Use this interface to create, edit, and delete promotional offers for the website.
        </p>
      </div>
      <PromotionsManager />
    </div>
  );
};

export default AdminPromotionsPage;
