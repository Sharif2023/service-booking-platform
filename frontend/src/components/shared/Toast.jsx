import { useNotification } from '../../hooks/useNotification';
import { useEffect, useState } from 'react';

export default function Toast() {
  const { notifications } = useNotification();

  return (
    <div className="fixed bottom-6 right-6 space-y-4 z-[9999] flex flex-col items-end pointer-events-none">
      {notifications.map((notif) => (
        <ToastItem key={notif.id} notif={notif} />
      ))}
    </div>
  );
}

function ToastItem({ notif }) {
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    requestAnimationFrame(() => setShow(true));
  }, []);

  const config = {
    success: { border: 'rgba(34,197,94,0.3)', bg: 'rgba(34,197,94,0.1)', shadow: 'rgba(34,197,94,0.2)', icon: '✅' },
    error: { border: 'rgba(239,68,68,0.3)', bg: 'rgba(239,68,68,0.1)', shadow: 'rgba(239,68,68,0.2)', icon: '⚠️' },
    warning: { border: 'rgba(245,158,11,0.3)', bg: 'rgba(245,158,11,0.1)', shadow: 'rgba(245,158,11,0.2)', icon: '🔔' },
    info: { border: 'rgba(79,142,247,0.3)', bg: 'rgba(79,142,247,0.1)', shadow: 'rgba(79,142,247,0.2)', icon: 'ℹ️' },
  };

  const style = config[notif.type] || config.info;

  return (
    <div
      className={`
        pointer-events-auto
        flex items-center gap-3 px-5 py-4 rounded-xl backdrop-blur-xl border
        transform transition-all duration-300 ease-out shadow-lg
        ${show ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-[120%] opacity-0 scale-95'}
      `}
      style={{
        backgroundColor: '#0f1623e6',
        borderColor: style.border,
        boxShadow: `0 8px 32px ${style.shadow}`,
      }}
    >
      <div 
        className="flex items-center justify-center w-8 h-8 rounded-full"
        style={{ backgroundColor: style.bg, border: `1px solid ${style.border}` }}
      >
        <span className="text-sm">{style.icon}</span>
      </div>
      <p className="text-white font-medium text-sm tracking-wide">{notif.message}</p>
    </div>
  );
}
