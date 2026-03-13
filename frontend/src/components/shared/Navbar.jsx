import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { Link, useLocation } from 'react-router-dom';
import logoImg from '../../assets/logo.jpg';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { addNotification } = useNotification();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    addNotification('Logged out successfully', 'success');
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children }) => (
    <Link 
      to={to} 
      className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-lg hover:bg-white/5 ${
        isActive(to) ? 'text-white' : 'text-gray-400 hover:text-white'
      }`}
    >
      {children}
      {isActive(to) && (
        <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-full"></span>
      )}
    </Link>
  );

  return (
    <nav className={`w-full sticky top-0 z-50 transition-all duration-300 border-b ${
      scrolled 
        ? 'bg-gray-900/80 backdrop-blur-xl border-white/10 shadow-xl' 
        : 'bg-transparent border-transparent'
    }`}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shadow-lg group-hover:shadow-blue-500/30 transition-shadow bg-white">
              <img src={logoImg} alt="ServiceHub Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 font-['Outfit']">
              ServiceHub
            </span>
          </Link>

          <div className="hidden md:flex flex-1 items-center justify-center gap-2">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/services">Services</NavLink>
            {user && <NavLink to="/bookings">My Bookings</NavLink>}
            {user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
          </div>

          <div className="flex items-center justify-end gap-4 flex-shrink-0">
            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-full flex items-center justify-center text-sm font-bold shadow-inner">
                    {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden lg:block text-sm font-medium text-gray-300 max-w-[120px] truncate">
                    {user.full_name}
                  </span>
                </div>
                <button onClick={handleLogout} className="text-sm font-medium text-gray-400 hover:text-red-400 transition-colors px-2 py-1">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                  Log in
                </Link>
                <Link to="/register" className="btn-primary px-5 py-2 !text-sm">
                  Sign up
                </Link>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </nav>
  );
}
