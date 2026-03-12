import { useEffect, useState } from 'react';
import { bookingsAPI } from '../services/api';
import useNotification from '../hooks/useNotification';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { BOOKING_STATUS } from '../config/constants';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingsAPI.getMyBookings();
      setBookings(response.data);
    } catch (error) {
      addNotification('Failed to load bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await bookingsAPI.cancelBooking(bookingId);
      addNotification('Booking cancelled successfully', 'success');
      fetchBookings();
    } catch (error) {
      addNotification(
        error.response?.data?.message || 'Failed to cancel booking',
        'error'
      );
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="bg-blue-100 p-8 rounded-lg text-center">
          <p className="text-gray-600 mb-4">No bookings yet</p>
          <a href="/services" className="text-blue-600 hover:underline">
            Browse services
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{booking.service_name}</h3>
                  <p className="text-gray-600">
                    {new Date(booking.booking_date).toLocaleDateString()} at {booking.booking_time}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full font-bold text-sm ${
                    booking.status === 'confirmed'
                      ? 'bg-green-100 text-green-800'
                      : booking.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {booking.status}
                </span>
              </div>
              <p className="text-gray-600 mb-4">${booking.service_price}</p>
              {booking.special_requests && (
                <p className="text-gray-600 mb-4">
                  <strong>Requests:</strong> {booking.special_requests}
                </p>
              )}
              {booking.status === 'pending' && (
                <button
                  onClick={() => handleCancel(booking.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
