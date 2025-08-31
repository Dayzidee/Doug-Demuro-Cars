import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/organisms/Layout';
import HomePage from './components/templates/HomePage/HomePage';
import LoginPage from './components/templates/LoginPage/LoginPage';
import DashboardPage from './components/templates/DashboardPage/DashboardPage';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/molecules/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="dashboard" element={<DashboardPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
