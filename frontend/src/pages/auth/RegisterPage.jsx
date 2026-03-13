import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { User, Mail, Phone, Lock } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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
      const response = await authAPI.register(
        form.email,
        form.password,
        form.full_name,
        form.phone
      );
      setSuccess(true);
      addNotification(response.data.message || 'Verification email sent!', 'success');
    } catch (error) {
      addNotification(error.response?.data?.error || error.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 relative">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/10 to-green-600/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="glass-card max-w-md w-full p-10 text-center fade-in-up relative z-10 border-t-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-400">
             <Mail size={40} />
          </div>
          <h2 className="text-3xl font-bold font-['Outfit'] mb-4">Check your <span className="gradient-text">Email</span></h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            We've sent a verification link to <span className="text-white font-semibold">{form.email}</span>. 
            Please check your inbox (and spam folder) to activate your account.
          </p>
          <Link to="/login" className="btn-primary w-full shadow-[0_0_20px_rgba(79,142,247,0.3)]">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center relative fade-in-up py-12 px-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-green-500/10 to-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="glass-card w-full max-w-[500px] p-8 md:p-10 relative overflow-hidden border-t-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        <div className="text-center mb-10 relative z-10">
           <h2 className="text-3xl font-bold font-['Outfit'] mb-2">Create <span className="gradient-text text-green-400">Account</span></h2>
           <p className="text-gray-400 text-sm">Join the premier network for professional services</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div className="grid grid-cols-1 gap-5">
             <div className="space-y-1">
                <label className="form-label text-gray-300">Full Legal Name</label>
                <div className="relative group">
                   <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                   <input
                     type="text"
                     name="full_name"
                     placeholder="John Doe"
                     value={form.full_name}
                     onChange={handleChange}
                     required
                     className="form-input bg-black/40 !pl-14 focus:bg-[rgba(79,142,247,0.05)] border-white/5 focus:border-blue-500/50"
                     autoComplete="name"
                   />
                </div>
             </div>

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
                <label className="form-label text-gray-300">Phone Number</label>
                <div className="relative group">
                   <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                   <input
                     type="tel"
                     name="phone"
                     placeholder="+1 (555) 000-0000"
                     value={form.phone}
                     onChange={handleChange}
                     required
                     className="form-input bg-black/40 !pl-14 focus:bg-[rgba(79,142,247,0.05)] border-white/5 focus:border-blue-500/50"
                     autoComplete="tel"
                   />
                </div>
             </div>

             <div className="space-y-1">
                <label className="form-label text-gray-300">Secure Password</label>
                <div className="relative group">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                   <input
                     type="password"
                     name="password"
                     placeholder="••••••••"
                     value={form.password}
                     onChange={handleChange}
                     required
                     className="form-input bg-black/40 !pl-14 focus:bg-[rgba(79,142,247,0.05)] border-white/5 focus:border-blue-500/50 tracking-widest"
                     autoComplete="new-password"
                   />
                </div>
             </div>
          </div>
          
          <div className="text-xs text-gray-500 mt-4 mb-6 leading-relaxed">
             By creating an account, you agree to our Terms of Service and Privacy Policy. Your data is encrypted and securely stored.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 text-base shadow-[0_0_20px_rgba(79,142,247,0.4)] bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-500 hover:to-green-400"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                 <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                 Setting up workspace...
              </span>
            ) : (
              'Create My Account'
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center border-t border-white/5 pt-6 relative z-10">
          <p className="text-gray-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
