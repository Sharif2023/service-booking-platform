import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { servicesAPI } from '../services/api';
import { useBooking } from '../hooks/useBooking';
import { useNotification } from '../hooks/useNotification';
import LoadingSpinner from '../components/shared/LoadingSpinner';

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bookingData: booking, setBooking } = useBooking();
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
  if (!service) return <div className="text-center mt-10 text-gray-400">Service not found</div>;

  return (
    <div className="max-w-4xl mx-auto fade-in-up">
      <div className="flex items-center gap-4 mb-8">
         <button onClick={() => navigate('/services')} className="btn-secondary px-3 py-2 text-sm border-transparent hover:border-white/10 hover:bg-white/5">
            ← Back
         </button>
         <h1 className="text-3xl md:text-4xl font-bold font-['Outfit']">Secure Your <span className="gradient-text">Booking</span></h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Service Summary Card */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 h-full flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full"></div>
            
            <span className="section-label mb-4 text-xs w-max">Service Details</span>
            <h2 className="text-2xl font-bold mb-3 text-white font-['Outfit']">{service.name}</h2>
            
            <div className="text-3xl font-bold text-white mb-6">
              <span className="text-blue-500 text-xl align-top mr-1">$</span>{service.price}
            </div>
            
            <p className="text-gray-400 text-sm leading-relaxed flex-1">
              {service.description}
            </p>

            <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
               <div className="flex items-center gap-3 text-sm text-gray-300 transform hover:translate-x-1 transition-transform">
                  <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">✓</span>
                  Instant Confirmation
               </div>
               <div className="flex items-center gap-3 text-sm text-gray-300 transform hover:translate-x-1 transition-transform">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">🔒</span>
                  Secure Payment (Stripe)
               </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="glass-card p-6 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>

            <h3 className="text-xl font-bold mb-8 font-['Outfit']">Schedule Your Appointment</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="group">
                <label className="form-label group-hover:text-blue-400 transition-colors">Date</label>
                <div className="relative">
                   <input
                     type="date"
                     name="booking_date"
                     value={form.booking_date}
                     onChange={handleChange}
                     required
                     className="form-input bg-[rgba(0,0,0,0.2)] pl-12 focus:bg-white/5"
                     style={{ colorScheme: 'dark' }}
                   />
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">📅</span>
                </div>
              </div>

              <div className="group">
                <label className="form-label group-hover:text-purple-400 transition-colors">Time</label>
                <div className="relative">
                   <input
                     type="time"
                     name="booking_time"
                     value={form.booking_time}
                     onChange={handleChange}
                     required
                     className="form-input bg-[rgba(0,0,0,0.2)] pl-12 focus:bg-white/5"
                     style={{ colorScheme: 'dark' }}
                   />
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">⏰</span>
                </div>
              </div>
            </div>

            <div className="mb-8 group">
              <label className="form-label group-hover:text-blue-400 transition-colors">Special Requests (Optional)</label>
              <textarea
                name="special_requests"
                placeholder="Any special instructions or requirements we should know about..."
                value={form.special_requests}
                onChange={handleChange}
                className="form-input bg-[rgba(0,0,0,0.2)] focus:bg-white/5 h-32 resize-none"
              ></textarea>
            </div>

            <div className="flex justify-end pt-4 border-t border-white/5">
               <button
                 type="submit"
                 className="btn-primary w-full md:w-auto px-10 py-4 text-lg shadow-[0_0_30px_rgba(79,142,247,0.3)]"
               >
                 Proceed to Checkout
                 <span className="ml-2">→</span>
               </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
