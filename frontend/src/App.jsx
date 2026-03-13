import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { BookingProvider } from './context/BookingContext';
import Layout from './components/shared/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// Pages
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import BookingPage from './pages/BookingPage';
import CheckoutPage from './pages/CheckoutPage';
import BookingSuccessPage from './pages/BookingSuccessPage';
import MyBookingsPage from './pages/MyBookingsPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminServicesPage from './pages/admin/AdminServicesPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <BookingProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/booking/:id" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                <Route path="/booking-success" element={<ProtectedRoute><BookingSuccessPage /></ProtectedRoute>} />
                <Route path="/bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />

                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />

                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/bookings" element={<AdminRoute><AdminBookingsPage /></AdminRoute>} />
                <Route path="/admin/services" element={<AdminRoute><AdminServicesPage /></AdminRoute>} />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </BookingProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
