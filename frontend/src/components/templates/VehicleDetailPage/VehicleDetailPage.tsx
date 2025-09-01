import React from 'react';
import { useParams } from 'react-router-dom';
import VehicleDetailLayout from '../../organisms/VehicleDetailLayout';

const VehicleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div className="text-red-500 text-center p-8">Error: Vehicle ID is missing.</div>;
  }

  // The VehicleDetailLayout component will handle fetching data and displaying the page content.
  // We pass the vehicleId to it as a prop.
  return (
    <VehicleDetailLayout vehicleId={id} />
  );
};

export default VehicleDetailPage;
