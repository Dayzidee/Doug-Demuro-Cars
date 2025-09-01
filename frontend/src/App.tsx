import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/organisms/Layout';
import HomePage from './components/templates/HomePage/HomePage';
import GalleryPage from './components/templates/GalleryPage/GalleryPage';
import LoginPage from './components/templates/LoginPage/LoginPage';
import SellPage from './components/templates/SellPage/SellPage';
import DashboardPage from './components/templates/DashboardPage/DashboardPage';
import InventoryPage from './components/templates/InventoryPage/InventoryPage';
import VehicleDetailPage from './components/templates/VehicleDetailPage/VehicleDetailPage';
import AdminPromotionsPage from './components/templates/AdminPromotionsPage/AdminPromotionsPage';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/molecules/ProtectedRoute';
import AdminProtectedRoute from './components/molecules/AdminProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="inventory/:id" element={<VehicleDetailPage />} />
            <Route path="gallery" element={<GalleryPage />} />
            <Route path="sell" element={<SellPage />} />
            <Route path="login" element={<LoginPage />} />

            {/* Protected Routes for standard users */}
            <Route element={<ProtectedRoute />}>
              <Route path="dashboard" element={<DashboardPage />} />
            </Route>

            {/* Protected Routes for admins */}
            <Route element={<AdminProtectedRoute />}>
              <Route path="admin/promotions" element={<AdminPromotionsPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
