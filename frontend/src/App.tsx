import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/organisms/Layout';
import HomePage from './components/templates/HomePage/HomePage';
import GalleryPage from './components/templates/GalleryPage/GalleryPage';
import LoginPage from './components/templates/LoginPage/LoginPage';
import SignUpPage from './components/templates/SignUpPage/SignUpPage';
import SellPage from './components/templates/SellPage/SellPage';
import AuctionsPage from './components/templates/AuctionsPage/AuctionsPage';
import DashboardLayout from './components/templates/DashboardPage/DashboardLayout';
import DashboardOverview from './components/templates/DashboardPage/DashboardOverview';
import DashboardSettings from './components/templates/DashboardPage/DashboardSettings';
import DashboardBids from './components/templates/DashboardPage/DashboardBids';
import DashboardWatchlist from './components/templates/DashboardPage/DashboardWatchlist';
import DashboardSelling from './components/templates/DashboardPage/DashboardSelling';
import InventoryPage from './components/templates/InventoryPage/InventoryPage';
import VehicleDetailPage from './components/templates/VehicleDetailPage/VehicleDetailPage';
import ComparePage from './components/templates/ComparePage/ComparePage';
import AdminPromotionsPage from './components/templates/AdminPromotionsPage/AdminPromotionsPage';
import PlaceholderPage from './components/templates/PlaceholderPage/PlaceholderPage';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/molecules/ProtectedRoute';
import AdminProtectedRoute from './components/molecules/AdminProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Core Pages */}
            <Route index element={<HomePage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="inventory/:id" element={<VehicleDetailPage />} />
            <Route path="gallery" element={<GalleryPage />} />
            <Route path="auctions" element={<AuctionsPage />} />
            <Route path="compare" element={<ComparePage />} />
            <Route path="sell" element={<SellPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignUpPage />} />

            {/* Placeholder Pages */}
            <Route path="promos" element={<PlaceholderPage title="Promotions" />} />
            <Route path="how-it-works/:topic" element={<PlaceholderPage title="How It Works" />} />
            <Route path="faqs" element={<PlaceholderPage title="FAQs" />} />
            <Route path="guides/:topic" element={<PlaceholderPage title="Guides" />} />
            <Route path="community" element={<PlaceholderPage title="Community" />} />
            <Route path="support" element={<PlaceholderPage title="Support" />} />
            <Route path="careers" element={<PlaceholderPage title="Careers" />} />

            {/* Protected Routes for standard users */}
            <Route element={<ProtectedRoute />}>
              <Route path="dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardOverview />} />
                <Route path="bids" element={<DashboardBids />} />
                <Route path="watchlist" element={<DashboardWatchlist />} />
                <Route path="selling" element={<DashboardSelling />} />
                <Route path="settings" element={<DashboardSettings />} />
              </Route>
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
