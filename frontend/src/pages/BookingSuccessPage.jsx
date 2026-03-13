import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBooking } from '../hooks/useBooking';
import Confetti from 'react-confetti';
import { Mail } from 'lucide-react';

export default function BookingSuccessPage() {
  const { bookingData: booking, clearBooking } = useBooking();
  const navigate = useNavigate();
  const [windowDimension, setWindowDimension] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // If no booking found, likely accessed directly. Redirect out.
    if (!booking) {
      navigate('/services');
      return;
    }

    const handleResize = () => {
      setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener('resize', handleResize);

    // Stop confetti after 5 seconds to reduce CPU load
    const timer = setTimeout(() => setShowConfetti(false), 5000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
      // We do not call clearBooking immediately here so they can see the final page, 
      // but maybe it's managed externally or just stays resident till next booking.
    };
  }, [booking, navigate]);

  if (!booking) return null;

  return (
    <div className="min-h-[70vh] flex items-center justify-center fade-in-up relative z-10">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[100]">
          <Confetti
            width={windowDimension.width}
            height={windowDimension.height}
            recycle={false}
            numberOfPieces={500}
            colors={['#4f8ef7', '#7c5af6', '#4ade80', '#f5c842']}
            gravity={0.15}
          />
        </div>
      )}

      <div className="glass-card max-w-xl w-full p-10 md:p-14 text-center relative overflow-hidden">
        {/* Decorative background gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-green-500/20 blur-[80px] rounded-full"></div>

        <div className="relative z-10">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(52,211,153,0.4)] animate-[bounce_1s_ease_infinite] sm:animate-none">
             <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-['Outfit'] text-white">
            Booking Confirmed!
          </h1>
          
          <p className="text-gray-300 mb-8 text-lg leading-relaxed">
            Your appointment for <span className="text-white font-bold">{booking?.service_name}</span> on{' '}
            <span className="text-blue-300 font-bold">{new Date(booking?.booking_date).toLocaleDateString()}</span> at{' '}
            <span className="text-purple-300 font-bold">{booking?.booking_time}</span> has been successfully scheduled.
          </p>
          
          <div className="bg-black/20 border border-white/5 rounded-xl p-4 mb-10 text-sm text-gray-400 flex items-start text-left gap-4">
             <Mail className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
             <p>A detailed confirmation and receipt has been sent to your registered email address along with instructions.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/bookings"
              className="btn-primary shadow-[0_0_20px_rgba(79,142,247,0.3)] w-full sm:w-auto text-center"
            >
              View My Dashboard
            </Link>
            <Link
              to="/services"
              className="btn-secondary w-full sm:w-auto text-center"
            >
              Book Another
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
