import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useBooking from '../hooks/useBooking';

export default function BookingSuccessPage() {
  const { booking, clearBooking } = useBooking();
  const navigate = useNavigate();

  useEffect(() => {
    // If no booking, redirect to services
    if (!booking) {
      navigate('/services');
    }
  }, []);

  return (
    <div className="max-w-md mx-auto mt-12 text-center p-6 bg-white rounded-lg shadow">
      <div className="text-6xl mb-4">✅</div>
      <h1 className="text-3xl font-bold mb-4">Booking Confirmed!</h1>
      <p className="text-gray-600 mb-6">
        Your booking for <strong>{booking?.service_name}</strong> on{' '}
        <strong>{booking?.booking_date}</strong> has been confirmed.
      </p>
      <p className="text-gray-600 mb-8">
        A confirmation email has been sent to your registered email address.
      </p>
      <div className="space-y-4">
        <Link
          to="/bookings"
          className="block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          View My Bookings
        </Link>
        <Link
          to="/services"
          className="block px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          Browse More Services
        </Link>
      </div>
    </div>
  );
}
