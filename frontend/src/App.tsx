import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/organisms/Layout';
import HomePage from './components/templates/HomePage/HomePage';
import LoginPage from './components/templates/LoginPage/LoginPage';
import DashboardPage from './components/templates/DashboardPage/DashboardPage';
import InventoryPage from './components/templates/InventoryPage/InventoryPage';
import AdminVehiclesPage from './components/templates/AdminVehiclesPage/AdminVehiclesPage';
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
            <Route path="login" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="dashboard" element={<DashboardPage />} />
            </Route>

            <Route element={<AdminProtectedRoute />}>
              <Route path="admin/vehicles" element={<AdminVehiclesPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
