import { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import { useNotification } from '../../hooks/useNotification';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await adminAPI.getBookings();
      setBookings(response.data);
    } catch (error) {
      addNotification('Failed to load bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bookingId, newStatus) => {
    try {
      await adminAPI.updateBookingStatus(bookingId, newStatus);
      addNotification(`Booking status updated to ${newStatus}`, 'success');
      fetchBookings();
    } catch (error) {
      addNotification('Failed to update booking', 'error');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="fade-in-up pb-12 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
         <div>
            <h1 className="text-3xl md:text-4xl font-bold font-['Outfit'] mb-2">Bookings <span className="gradient-text">Database</span></h1>
            <p className="text-gray-400">Total records: {bookings.length}</p>
         </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="premium-table min-w-[800px]">
            <thead>
              <tr>
                <th className="w-1/6">User</th>
                <th className="w-1/4">Service</th>
                <th className="w-1/6">Date</th>
                <th className="w-1/6">Value</th>
                <th className="w-1/6">Status</th>
                <th className="w-1/6 rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="group">
                  <td className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold font-['Outfit']">
                        {booking.user_name?.charAt(0)?.toUpperCase()}
                      </div>
                      <span className="truncate max-w-[120px]" title={booking.user_name}>{booking.user_name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="font-semibold text-gray-200">{booking.service_name}</span>
                  </td>
                  <td className="text-gray-400 text-sm whitespace-nowrap">
                    {new Date(booking.booking_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}
                    <div className="text-xs text-gray-500 mt-0.5">{booking.booking_time}</div>
                  </td>
                  <td className="font-['Outfit'] text-lg text-white">
                    <span className="text-blue-500 text-sm mr-0.5">$</span>{booking.service_price}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        booking.status === 'confirmed'
                          ? 'badge-success'
                          : booking.status === 'cancelled'
                          ? 'badge-error'
                          : 'badge-warning'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 inline-block ${
                         booking.status === 'confirmed' ? 'bg-green-400' :
                         booking.status === 'cancelled' ? 'bg-red-400 animate-pulse' : 'bg-yellow-400 animate-pulse'
                      }`}></span>
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => updateStatus(booking.id, 'confirmed')}
                          className="px-3 py-1.5 bg-green-500/20 text-green-400 hover:bg-green-500/40 border border-green-500/30 rounded-md text-xs font-bold transition-all whitespace-nowrap"
                        >
                          Confirm
                        </button>
                      )}
                      {booking.status !== 'cancelled' && (
                        <button
                          onClick={() => updateStatus(booking.id, 'cancelled')}
                          className="px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/40 border border-red-500/30 rounded-md text-xs font-bold transition-all whitespace-nowrap"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {bookings.length === 0 && (
             <div className="p-16 text-center flex flex-col items-center">
                 <div className="text-5xl mb-4 opacity-30">📭</div>
                 <h3 className="text-xl font-bold text-gray-300">No records found</h3>
                 <p className="text-gray-500 mt-2">There are currently no bookings in the database.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
