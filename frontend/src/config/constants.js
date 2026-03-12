export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

export const SERVICE_CATEGORIES = ['Cleaning', 'Repair', 'Automotive', 'Renovation', 'Gardening', 'Pet Care', 'Other'];

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

export const ROUTES = {
  HOME: '/',
  SERVICES: '/services',
  BOOKING: '/booking/:id',
  CHECKOUT: '/checkout',
  LOGIN: '/login',
  REGISTER: '/register',
  MY_BOOKINGS: '/bookings',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_BOOKINGS: '/admin/bookings',
  ADMIN_SERVICES: '/admin/services',
};
