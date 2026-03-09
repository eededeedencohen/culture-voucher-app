import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import VouchersPage from './pages/VouchersPage';
import StudentsPage from './pages/StudentsPage';
import SettingsPage from './pages/SettingsPage';
import MyVouchersPage from './pages/MyVouchersPage';
import GenerateBarcodePage from './pages/GenerateBarcodePage';
import ScannerPage from './pages/ScannerPage';

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  const defaultRoute = user
    ? user.role === 'admin' ? '/dashboard'
    : user.role === 'student' ? '/my-vouchers'
    : '/scanner'
    : '/login';

  return (
    <>
      {user && <Header />}
      <Routes>
        <Route path="/login" element={user ? <Navigate to={defaultRoute} /> : <LoginPage />} />

        {/* Admin Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute roles={['admin']}><DashboardPage /></ProtectedRoute>
        } />
        <Route path="/vouchers" element={
          <ProtectedRoute roles={['admin']}><VouchersPage /></ProtectedRoute>
        } />
        <Route path="/students" element={
          <ProtectedRoute roles={['admin']}><StudentsPage /></ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute roles={['admin']}><SettingsPage /></ProtectedRoute>
        } />

        {/* Student Routes */}
        <Route path="/my-vouchers" element={
          <ProtectedRoute roles={['student']}><MyVouchersPage /></ProtectedRoute>
        } />
        <Route path="/generate" element={
          <ProtectedRoute roles={['student']}><GenerateBarcodePage /></ProtectedRoute>
        } />

        {/* Business Routes */}
        <Route path="/scanner" element={
          <ProtectedRoute roles={['business']}><ScannerPage /></ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to={defaultRoute} />} />
      </Routes>
      {user && <BottomNav />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <AppRoutes />
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
