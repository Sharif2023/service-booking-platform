import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { authAPI } from '../services/api';
import { User, Phone, Mail, Lock, Shield, Save, Key, Settings } from 'lucide-react';
import LoadingSpinner from '../components/shared/LoadingSpinner';

export default function ProfilePage() {
  const { user, login } = useAuth();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    gender: '',
    dob: '',
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        full_name: user.full_name || '',
        phone: user.phone || '',
        gender: user.gender || '',
        dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authAPI.updateProfile({
        full_name: form.full_name,
        phone: form.phone,
        gender: form.gender,
        dob: form.dob,
      });
      login(response.data, localStorage.getItem('token'));
      addNotification('Profile updated successfully', 'success');
    } catch (error) {
      addNotification(error.response?.data?.error || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (form.new_password !== form.confirm_password) {
      return addNotification('New passwords do not match', 'error');
    }
    
    setLoading(true);
    try {
      await authAPI.updateProfile({
        current_password: form.current_password,
        new_password: form.new_password,
      });
      addNotification('Password updated successfully', 'success');
      setForm((prev) => ({
        ...prev,
        current_password: '',
        new_password: '',
        confirm_password: '',
      }));
    } catch (error) {
      addNotification(error.response?.data?.error || 'Failed to update password', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-12 fade-in-up">
       <div className="border-b border-white/5 pb-8">
          <h1 className="text-3xl md:text-5xl font-bold font-['Outfit'] mb-3">Your <span className="gradient-text">Profile</span></h1>
          <p className="text-gray-400">Manage your personal information and account security</p>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Side Info */}
          <div className="space-y-6">
             <div className="glass-card p-6 text-center border-t-white/10 overflow-hidden relative group">
                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl font-bold shadow-xl relative z-10 border border-white/10">
                   {user.full_name?.charAt(0)?.toUpperCase()}
                </div>
                <h2 className="text-xl font-bold relative z-10">{user.full_name}</h2>
                <p className="text-gray-500 text-sm relative z-10">{user.email}</p>
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-xs font-medium text-gray-400">
                   <Shield className="w-3 h-3 text-blue-400" />
                   {user.role === 'admin' ? 'Administrator' : 'Verified User'}
                </div>
             </div>
             
             <div className="glass-card p-6 border-white/5 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                   <Settings className="w-4 h-4" /> Quick Info
                </h3>
                <div className="space-y-3">
                   <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Member Since</span>
                      <span className="text-gray-300 font-medium">{new Date(user.created_at).toLocaleDateString()}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Account Type</span>
                      <span className="text-blue-400 font-medium capitalize">{user.role}</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Main Forms */}
          <div className="lg:col-span-2 space-y-8">
             {/* Personal Details */}
             <div className="glass-card p-8 border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -mr-16 -mt-16 rounded-full group-hover:bg-blue-500/10 transition-all"></div>
                
                <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                   <User className="text-blue-400 w-5 h-5" /> Personal Details
                </h3>
                
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Full Name</label>
                         <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                            <input 
                               type="text" 
                               name="full_name"
                               value={form.full_name}
                               onChange={handleChange}
                               className="form-input !pl-12 bg-black/40 border-white/5 focus:border-blue-500/50" 
                               required
                            />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Phone Number</label>
                         <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                            <input 
                               type="tel" 
                               name="phone"
                               value={form.phone}
                               onChange={handleChange}
                               className="form-input !pl-12 bg-black/40 border-white/5 focus:border-blue-500/50" 
                               required
                            />
                         </div>
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Gender</label>
                         <div className="relative group">
                            <select 
                               name="gender"
                               value={form.gender}
                               onChange={handleChange}
                               className="form-input bg-black/40 border-white/5 focus:border-blue-500/50 appearance-none"
                            >
                               <option value="" disabled>Select Gender</option>
                               <option value="male">Male</option>
                               <option value="female">Female</option>
                               <option value="other">Other</option>
                            </select>
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Date of Birth</label>
                         <div className="relative group">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                            <input 
                               type="date" 
                               name="dob"
                               value={form.dob}
                               onChange={handleChange}
                               className="form-input !pl-12 bg-black/40 border-white/5 focus:border-blue-500/50" 
                            />
                         </div>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Email Address (Read Only)</label>
                      <div className="relative opacity-60">
                         <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                         <input 
                            type="email" 
                            value={user.email} 
                            disabled 
                            className="form-input !pl-12 bg-black/20 border-white/5" 
                         />
                      </div>
                   </div>

                   <div className="flex justify-end pt-4">
                      <button 
                         type="submit" 
                         disabled={loading}
                         className="btn-primary flex items-center gap-2 px-8 shadow-lg shadow-blue-500/20"
                      >
                         <Save size={18} />
                         {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                   </div>
                </form>
             </div>

             {/* Security */}
             <div className="glass-card p-8 border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl -mr-16 -mt-16 rounded-full group-hover:bg-purple-500/10 transition-all"></div>
                
                <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                   <Lock className="text-purple-400 w-5 h-5" /> Security & Password
                </h3>
                
                <form onSubmit={handleChangePassword} className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Current Password</label>
                      <div className="relative group">
                         <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                         <input 
                            type="password" 
                            name="current_password"
                            value={form.current_password}
                            onChange={handleChange}
                            placeholder="Confirm current password"
                            className="form-input !pl-12 bg-black/40 border-white/5 focus:border-purple-500/50" 
                            required={form.new_password !== ''}
                         />
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">New Password</label>
                         <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                            <input 
                               type="password" 
                               name="new_password"
                               value={form.new_password}
                               onChange={handleChange}
                               placeholder="New password"
                               className="form-input !pl-12 bg-black/40 border-white/5 focus:border-purple-500/50" 
                            />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Confirm New Password</label>
                         <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                            <input 
                               type="password" 
                               name="confirm_password"
                               value={form.confirm_password}
                               onChange={handleChange}
                               placeholder="Repeat new password"
                               className="form-input !pl-12 bg-black/40 border-white/5 focus:border-purple-500/50" 
                            />
                         </div>
                      </div>
                   </div>

                   <div className="flex justify-end pt-4">
                      <button 
                         type="submit" 
                         disabled={loading || !form.new_password}
                         className={`btn-primary !from-purple-600 !to-indigo-600 flex items-center gap-2 px-8 shadow-lg shadow-purple-500/20 ${!form.new_password ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                         <Save size={18} />
                         {loading ? 'Changing...' : 'Change Password'}
                      </button>
                   </div>
                </form>
             </div>
          </div>
       </div>
    </div>
  );
}
