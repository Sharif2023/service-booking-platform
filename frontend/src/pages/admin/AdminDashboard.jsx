import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { useNotification } from '../../hooks/useNotification';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

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
  if (!analytics) return <div className="text-center text-gray-500 mt-20">Failed to load analytics</div>;

  return (
    <div className="space-y-12 fade-in-up pb-12">
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
         <div>
            <h1 className="text-3xl md:text-5xl font-bold font-['Outfit'] mb-2">Admin <span className="gradient-text">Dashboard</span></h1>
            <p className="text-gray-400">Platform overview and management console</p>
         </div>
         <div className="hidden md:flex items-center gap-2 text-sm text-gray-400 bg-black/20 px-4 py-2 rounded-lg border border-white/5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            System Online
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Bookings', value: analytics.totalBookings, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: '📋' },
          { label: 'Confirmed', value: analytics.confirmedBookings, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: '✅' },
          { label: 'Pending', value: analytics.pendingBookings, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: '⏳' },
          { label: 'Total Revenue', value: `$${analytics.totalRevenue}`, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: '💰' },
        ].map((stat, i) => (
          <div key={i} className={`stat-card relative overflow-hidden group shadow`}>
            {/* Background glow based on type */}
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl ${stat.bg} opacity-50 group-hover:opacity-100 transition-opacity`}></div>
            
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 ${stat.bg} border ${stat.border}`}>
               {stat.icon}
            </div>
            
            <p className="text-gray-400 font-medium text-sm tracking-wider uppercase mb-1">{stat.label}</p>
            <p className={`text-4xl font-bold font-['Outfit'] ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link
          to="/admin/bookings"
          className="glass-card p-8 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="flex items-start justify-between relative z-10">
             <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-3xl mb-6 shadow-lg text-blue-400">
                   🗓️
                </div>
                <h2 className="text-2xl font-bold mb-3 font-['Outfit'] group-hover:text-blue-300 transition-colors">Manage Bookings</h2>
                <p className="text-gray-400 text-sm leading-relaxed max-w-sm border-l-2 border-blue-500/30 pl-3">
                  View, approve, confirm, or cancel user bookings across the platform. Handle special requests and payments.
                </p>
             </div>
             <span className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-500 group-hover:border-blue-500/50 group-hover:text-blue-400 transition-all transform group-hover:translate-x-2">
                →
             </span>
          </div>
        </Link>
        <Link
          to="/admin/services"
          className="glass-card p-8 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="flex items-start justify-between relative z-10">
             <div>
                <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-3xl mb-6 shadow-lg text-purple-400">
                   🚀
                </div>
                <h2 className="text-2xl font-bold mb-3 font-['Outfit'] group-hover:text-purple-300 transition-colors">Manage Services</h2>
                <p className="text-gray-400 text-sm leading-relaxed max-w-sm border-l-2 border-purple-500/30 pl-3">
                  Create new offerings, edit existing services, manage pricing, and curate the platform catalog.
                </p>
             </div>
             <span className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-500 group-hover:border-purple-500/50 group-hover:text-purple-400 transition-all transform group-hover:translate-x-2">
                →
             </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
