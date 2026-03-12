import React, { createContext, useState } from 'react';

export const BookingContext = createContext();

export function BookingProvider({ children }) {
  const [bookingData, setBooking] = useState(null);

  const setBookingData = (data) => {
    setBooking(data);
  };

  const clearBooking = () => {
    setBooking(null);
  };

  return (
    <BookingContext.Provider value={{ bookingData, setBooking: setBookingData, clearBooking }}>
      {children}
    </BookingContext.Provider>
  );
}
