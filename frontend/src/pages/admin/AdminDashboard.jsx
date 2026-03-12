import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/api';
import useNotification from '../hooks/useNotification';
import LoadingSpinner from '../components/shared/LoadingSpinner';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await adminAPI.getAnalytics();
      setAnalytics(response.data);
    } catch (error) {
      addNotification('Failed to load analytics', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!analytics) return <div>Failed to load analytics</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Bookings', value: analytics.totalBookings, color: 'bg-blue-500' },
          { label: 'Confirmed', value: analytics.confirmedBookings, color: 'bg-green-500' },
          { label: 'Pending', value: analytics.pendingBookings, color: 'bg-yellow-500' },
          { label: 'Total Revenue', value: `$${analytics.totalRevenue}`, color: 'bg-purple-500' },
        ].map((stat, i) => (
          <div key={i} className={`${stat.color} text-white p-6 rounded-lg shadow`}>
            <p className="text-gray-200">{stat.label}</p>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/admin/bookings"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-bold mb-2">Manage Bookings</h2>
          <p className="text-gray-600">View and update booking statuses</p>
        </Link>
        <Link
          to="/admin/services"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-bold mb-2">Manage Services</h2>
          <p className="text-gray-600">Create, edit, or delete services</p>
        </Link>
      </div>
    </div>
  );
}
