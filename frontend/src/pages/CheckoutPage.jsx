import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { bookingsAPI } from '../services/api';
import useBooking from '../hooks/useBooking';
import useNotification from '../hooks/useNotification';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { STRIPE_PUBLIC_KEY } from '../config/constants';

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { booking, clearBooking } = useBooking();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    if (!booking || !booking.service_id) {
      addNotification('No booking details found', 'error');
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
        error.response?.data?.message || 'Failed to create checkout session',
        'error'
      );
      navigate('/services');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!clientSecret) {
    return <div className="text-center mt-10">Failed to load checkout</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Complete Payment</h1>
      <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
