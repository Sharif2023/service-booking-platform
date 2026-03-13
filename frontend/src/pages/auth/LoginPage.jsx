import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addNotification } = useNotification();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login(form.email, form.password);
      const { user, token } = response.data;
      login(user, token);
      addNotification('Welcome back!', 'success');
      navigate('/');
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Invalid credentials';
      addNotification(errorMsg, error.response?.status === 403 ? 'warning' : 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center relative fade-in-up py-12 px-4">
      {/* Decorative elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/20 to-purple-600/20 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="glass-card w-full max-w-[420px] p-8 md:p-10 relative overflow-hidden border-t-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 right-0 p-6 opacity-10">
           <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
        </div>

        <div className="text-center mb-10 relative z-10">
           <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/20 border border-white/10">
              <span className="text-white font-black text-2xl font-['Inter']">S</span>
           </div>
           <h2 className="text-3xl font-bold font-['Outfit'] mb-2"><span className="gradient-text">Welcome Back</span></h2>
           <p className="text-gray-400 text-sm">Secure access to your professional dashboard</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-1">
             <label className="form-label text-gray-300">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="form-input bg-black/40 !pl-14 focus:bg-[rgba(79,142,247,0.05)] border-white/5 focus:border-blue-500/50"
                  autoComplete="email"
                />
             </div>
          </div>
          
          <div className="space-y-1">
             <div className="flex justify-between items-center">
                <label className="form-label text-gray-300 mb-0">Password</label>
             </div>
             <div className="relative group mt-1">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="form-input bg-black/40 !pl-14 focus:bg-[rgba(79,142,247,0.05)] border-white/5 focus:border-blue-500/50 tracking-widest"
                  autoComplete="current-password"
                />
             </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 text-base shadow-[0_0_20px_rgba(79,142,247,0.4)] mt-4 group"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                 <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                 Authenticating...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2 w-full">
                 Sign In 
                 <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </span>
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center border-t border-white/5 pt-6 relative z-10">
          <p className="text-gray-400 text-sm">
            New to ServiceHub?{' '}
            <Link to="/register" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
