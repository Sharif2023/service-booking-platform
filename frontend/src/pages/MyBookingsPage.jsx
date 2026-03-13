import { useEffect, useState } from 'react';
import { bookingsAPI } from '../services/api';
import { useNotification } from '../hooks/useNotification';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';

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
    if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) return;

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
    <div className="max-w-5xl mx-auto fade-in-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-white/5 gap-4">
         <div>
            <h1 className="text-3xl md:text-4xl font-bold font-['Outfit'] mb-2">My <span className="gradient-text">Bookings</span></h1>
            <p className="text-gray-400">Manage your upcoming and past appointments</p>
         </div>
         <Link to="/services" className="btn-secondary text-sm px-6">
            Book Another Service
         </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center p-16 text-center">
          <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
             <Calendar className="w-12 h-12 text-gray-500 opacity-50" />
          </div>
          <h2 className="text-2xl font-bold mb-3 font-['Outfit']">No Bookings Yet</h2>
          <p className="text-gray-400 max-w-sm mb-8">You haven't scheduled any services yet. Browse our professional catalog to get started.</p>
          <Link to="/services" className="btn-primary shadow-[0_0_20px_rgba(79,142,247,0.3)]">
            Explore Services
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking, i) => (
            <div 
               key={booking.id} 
               className="glass-card p-0 overflow-hidden group hover:border-[rgba(79,142,247,0.4)] transition-colors duration-500"
               style={{ animationDelay: `${i * 0.1}s` }}
            >
               {/* Decorative left border line based on status */}
               <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                  booking.status === 'confirmed' ? 'bg-green-500' :
                  booking.status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'
               } opacity-70`}></div>
               
               <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-4">
                       <h3 className="text-xl md:text-2xl font-bold font-['Outfit']text-white">
                         {booking.service_name}
                       </h3>
                       <span
                         className={`badge ${
                           booking.status === 'confirmed'
                             ? 'badge-success'
                             : booking.status === 'cancelled'
                             ? 'badge-error'
                             : 'badge-warning'
                         }`}
                       >
                         {/* Circle indicator */}
                         <span className={`w-2 h-2 rounded-full mr-2 inline-block ${
                            booking.status === 'confirmed' ? 'bg-green-400' :
                            booking.status === 'cancelled' ? 'bg-red-400 animate-pulse' : 'bg-yellow-400 animate-pulse'
                         }`}></span>
                         {booking.status}
                       </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                       <div className="flex items-center gap-2">
                          <span className="p-1.5 rounded bg-white/5 border border-white/5 text-gray-300"><Calendar className="w-4 h-4" /></span>
                          {new Date(booking.booking_date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric'})}
                       </div>
                       <div className="flex items-center gap-2">
                          <span className="p-1.5 rounded bg-white/5 border border-white/5 text-gray-300"><Clock className="w-4 h-4" /></span>
                          {booking.booking_time}
                       </div>
                    </div>

                    {booking.special_requests && (
                      <div className="bg-black/20 p-4 rounded-lg border border-white/5 w-full mt-4">
                        <span className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1 block">Special Requests</span>
                        <p className="text-gray-300 text-sm italic">{booking.special_requests}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 border-t border-white/5 md:border-none pt-4 md:pt-0">
                     <span className="text-3xl font-bold font-['Outfit']">
                        <span className="text-blue-500 text-xl mr-1">$</span>{booking.service_price}
                     </span>
                     
                     {booking.status === 'pending' && (
                       <button
                         onClick={() => handleCancel(booking.id)}
                         className="btn-danger w-full md:w-auto whitespace-nowrap"
                       >
                         Cancel Booking
                       </button>
                     )}
                     
                     {booking.status === 'confirmed' && (
                       <div className="text-xs text-green-400 bg-green-400/10 px-3 py-1.5 rounded-full border border-green-400/20">
                          Payment Complete
                       </div>
                     )}
                  </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
