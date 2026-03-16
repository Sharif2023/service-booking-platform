import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User as UserIcon, Settings, Calendar, Briefcase } from 'lucide-react';
import logoImg from '../../assets/logo.jpg';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { addNotification } = useNotification();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

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
      isMenuOpen 
        ? 'bg-[#030712] border-white/10 shadow-2xl' 
        : scrolled 
          ? 'bg-gray-900/80 backdrop-blur-xl border-white/10 shadow-xl' 
          : 'bg-transparent border-transparent'
    }`}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          <Link to="/" className="flex items-center gap-3 flex-shrink-0 group relative z-50">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shadow-lg group-hover:shadow-blue-500/30 transition-shadow bg-white">
              <img src={logoImg} alt="ServiceHub Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 font-['Outfit']">
              ServiceHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-2">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/services">Services</NavLink>
            {user && <NavLink to="/bookings">My Bookings</NavLink>}
            {user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center justify-end gap-4 flex-shrink-0">
            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                  <Link to="/profile" className="flex items-center gap-3 group/profile">
                    <div className="w-9 h-9 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-full flex items-center justify-center text-sm font-bold shadow-inner group-hover/profile:bg-blue-500/30 transition-colors">
                      {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="hidden lg:block text-sm font-medium text-gray-300 max-w-[120px] truncate group-hover/profile:text-white transition-colors">
                      {user.full_name}
                    </span>
                  </Link>
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

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden relative z-50">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
          
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div className={`md:hidden fixed inset-0 z-40 !bg-[#030712] transition-all duration-300 ease-in-out ${
        isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
      }`}>
        <div className="flex flex-col h-full pt-28 px-6 pb-10">
          <div className="flex flex-col gap-6 text-center">
            <Link to="/" className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">Home</Link>
            <Link to="/services" className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">Services</Link>
            {user && (
              <Link to="/bookings" className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">My Bookings</Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">Admin Panel</Link>
            )}
          </div>

          <div className="mt-auto pt-10 border-t border-white/10">
            {user ? (
              <div className="space-y-6">
                <Link to="/profile" className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-inner">
                    {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="text-center">
                    <p className="text-white font-bold text-lg">{user.full_name}</p>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                  </div>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full btn-secondary text-red-400 border-red-500/20 py-4 flex items-center justify-center gap-2"
                >
                  <LogOut size={20} /> Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <Link to="/login" className="w-full btn-secondary py-4">Log in</Link>
                <Link to="/register" className="w-full btn-primary py-4">Create Account</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
