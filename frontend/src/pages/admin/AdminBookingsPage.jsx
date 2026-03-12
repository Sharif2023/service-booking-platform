import { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import useNotification from '../../hooks/useNotification';
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
      addNotification('Booking status updated', 'success');
      fetchBookings();
    } catch (error) {
      addNotification('Failed to update booking', 'error');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Manage Bookings</h1>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="px-6 py-3 text-left font-bold">User</th>
              <th className="px-6 py-3 text-left font-bold">Service</th>
              <th className="px-6 py-3 text-left font-bold">Date</th>
              <th className="px-6 py-3 text-left font-bold">Amount</th>
              <th className="px-6 py-3 text-left font-bold">Status</th>
              <th className="px-6 py-3 text-left font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{booking.user_name}</td>
                <td className="px-6 py-4">{booking.service_name}</td>
                <td className="px-6 py-4">{new Date(booking.booking_date).toLocaleDateString()}</td>
                <td className="px-6 py-4">${booking.service_price}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : booking.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {booking.status === 'pending' && (
                    <button
                      onClick={() => updateStatus(booking.id, 'confirmed')}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
                    >
                      Confirm
                    </button>
                  )}
                  {booking.status !== 'cancelled' && (
                    <button
                      onClick={() => updateStatus(booking.id, 'cancelled')}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {bookings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No bookings found</p>
        </div>
      )}
    </div>
  );
}
