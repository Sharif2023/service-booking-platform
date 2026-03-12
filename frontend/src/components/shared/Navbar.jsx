import { useAuth } from '../../hooks/useAuth';
import useNotification from '../../hooks/useNotification';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { addNotification } = useNotification();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    addNotification('Logged out successfully', 'success');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold hover:text-blue-100">
            ServiceHub
          </Link>

          <div className="flex items-center gap-8">
            <Link to="/" className={`hover:text-blue-100 ${isActive('/') ? 'font-bold' : ''}`}>
              Home
            </Link>
            <Link to="/services" className={`hover:text-blue-100 ${isActive('/services') ? 'font-bold' : ''}`}>
              Services
            </Link>

            {user ? (
              <>
                <Link to="/bookings" className={`hover:text-blue-100 ${isActive('/bookings') ? 'font-bold' : ''}`}>
                  My Bookings
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className={`hover:text-blue-100 ${isActive('/admin') ? 'font-bold' : ''}`}>
                    Admin
                  </Link>
                )}
                <div className="flex items-center gap-4 pl-4 border-l border-blue-400">
                  <span>{user.full_name}</span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className={`hover:text-blue-100 ${isActive('/login') ? 'font-bold' : ''}`}>
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`px-3 py-1 bg-green-500 hover:bg-green-600 rounded transition ${
                    isActive('/register') ? 'font-bold' : ''
                  }`}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
