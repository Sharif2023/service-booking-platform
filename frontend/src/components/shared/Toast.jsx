import { useEffect, useState } from 'react';
import useNotification from '../../hooks/useNotification';

export default function Toast() {
  const { notifications } = useNotification();

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`px-4 py-3 rounded shadow-lg text-white animate-pulse ${
            notif.type === 'success'
              ? 'bg-green-500'
              : notif.type === 'error'
              ? 'bg-red-500'
              : notif.type === 'warning'
              ? 'bg-yellow-500'
              : 'bg-blue-500'
          }`}
        >
          {notif.message}
        </div>
      ))}
    </div>
  );
}
