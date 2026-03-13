import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { bookingsAPI } from '../services/api';
import { useBooking } from '../hooks/useBooking';
import { useNotification } from '../hooks/useNotification';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { Lock } from 'lucide-react';
import { STRIPE_PUBLIC_KEY } from '../config/constants';

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { bookingData: booking, clearBooking } = useBooking();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    if (!booking || !booking.service_id) {
      addNotification('No booking details found, please select a service first', 'error');
      navigate('/services');
      return;
    }

    createStripeSession();
  }, [booking]);

  const createStripeSession = async () => {
    try {
      const response = await bookingsAPI.createSession(booking);
      setClientSecret(response.data.clientSecret);
    } catch (error) {
      addNotification(
        error.response?.data?.message || 'Failed to initialize secure checkout session',
        'error'
      );
      navigate('/services');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!clientSecret) {
    return (
      <div className="max-w-md mx-auto mt-20 fade-in-up text-center glass-card p-10">
        <h2 className="text-2xl font-bold mb-4 font-['Outfit'] text-red-400">Checkout Error</h2>
        <p className="text-gray-400 mb-8">Unable to secure payment session. Please try again later.</p>
        <button onClick={() => navigate('/services')} className="btn-secondary">Return to Services</button>
      </div>
    );
  }

  // Define custom appearance for Stripe Elements to match the dark theme
  const appearance = {
    theme: 'night',
    variables: {
      fontFamily: 'Inter, system-ui, sans-serif',
      colorBackground: '#0f1623',
      colorText: '#e8eaf0',
      colorDanger: '#ef4444',
      colorPrimary: '#4f8ef7',
      borderRadius: '8px',
      spacingUnit: '4px',
    },
    rules: {
      '.Input': {
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderColor: 'rgba(255, 255, 255, 0.07)',
        boxShadow: 'none',
      },
      '.Input:focus': {
        borderColor: '#4f8ef7',
        boxShadow: '0 0 0 1px #4f8ef7',
      },
      '.Label': {
        color: '#8892a4',
        fontWeight: '500',
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto fade-in-up pb-12">
      <div className="text-center mb-10">
         <h1 className="text-3xl md:text-5xl font-bold mb-4 font-['Outfit']">Secure <span className="gradient-text">Checkout</span></h1>
         <p className="text-gray-400 max-w-xl mx-auto flex items-center justify-center gap-2">
            <Lock className="text-green-400 w-5 h-5 inline-block mr-1" /> Payments processed securely via Stripe encryption
         </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
         <div className="lg:col-span-1 glass-card p-6 md:p-8 order-2 lg:order-1">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </div>
            
            <h3 className="text-lg font-bold mb-4 font-['Outfit'] border-b border-white/5 pb-4">Order Summary</h3>
            
            <div className="space-y-4 mb-6">
               <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Service</span>
                  <span className="font-medium text-white text-right max-w-[60%]">{booking?.service_name}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Date</span>
                  <span className="font-medium text-white">{booking?.booking_date}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Time</span>
                  <span className="font-medium text-white">{booking?.booking_time}</span>
               </div>
            </div>
            
            <div className="bg-black/20 rounded-lg p-4 flex justify-between items-center border border-white/5">
                <span className="font-bold text-gray-300">Total</span>
                <span className="text-2xl font-black text-white font-['Outfit']">${booking?.service_price}</span>
            </div>
            
            <button onClick={() => navigate(-1)} className="w-full text-sm text-gray-500 hover:text-white mt-6 transition-colors">
               ← Go back to edit details
            </button>
         </div>

         <div className="lg:col-span-2 glass-card p-4 md:p-8 order-1 lg:order-2">
            <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret, appearance }}>
              <div className="min-h-[500px]">
                 <EmbeddedCheckout />
              </div>
            </EmbeddedCheckoutProvider>
         </div>
      </div>
    </div>
  );
}
