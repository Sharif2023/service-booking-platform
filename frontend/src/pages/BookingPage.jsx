import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { servicesAPI, bookingsAPI } from '../services/api';
import useBooking from '../hooks/useBooking';
import useNotification from '../hooks/useNotification';
import LoadingSpinner from '../components/shared/LoadingSpinner';

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { booking, setBooking } = useBooking();
  const { addNotification } = useNotification();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    booking_date: booking?.booking_date || '',
    booking_time: booking?.booking_time || '',
    special_requests: booking?.special_requests || '',
  });

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      const response = await servicesAPI.getById(id);
      setService(response.data);
    } catch (error) {
      addNotification('Failed to load service', 'error');
      navigate('/services');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (new Date(form.booking_date) < new Date()) {
      addNotification('Booking date must be in the future', 'error');
      return;
    }
    setBooking({
      ...form,
      service_id: id,
      service_name: service.name,
      service_price: service.price,
    });
    navigate('/checkout');
  };

  if (loading) return <LoadingSpinner />;
  if (!service) return <div className="text-center mt-10">Service not found</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Book {service.name}</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-bold mb-2">${service.price}</h2>
        <p className="text-gray-600">{service.description}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        <div>
          <label className="block font-bold mb-2">Date</label>
          <input
            type="date"
            name="booking_date"
            value={form.booking_date}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-bold mb-2">Time</label>
          <input
            type="time"
            name="booking_time"
            value={form.booking_time}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-bold mb-2">Special Requests</label>
          <textarea
            name="special_requests"
            placeholder="Any special instructions..."
            value={form.special_requests}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold transition"
        >
          Continue to Checkout
        </button>
      </form>
    </div>
  );
}
