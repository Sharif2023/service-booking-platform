import { useEffect, useState } from 'react';
import { servicesAPI } from '../../services/api';
import { useNotification } from '../../hooks/useNotification';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { Sparkles, Link as LinkIcon, Package, Trash2, Settings } from 'lucide-react';

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    duration_minutes: '',
    image_url: '',
  });
  const { addNotification } = useNotification();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await servicesAPI.getAll();
      setServices(response.data);
    } catch (error) {
      addNotification('Failed to load services', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await servicesAPI.update(editingService.id, {
          ...form,
          price: parseFloat(form.price),
          duration_minutes: parseInt(form.duration_minutes),
        });
        addNotification('Service updated successfully', 'success');
      } else {
        await servicesAPI.create({
          ...form,
          price: parseFloat(form.price),
          duration_minutes: parseInt(form.duration_minutes),
        });
        addNotification('Service created successfully', 'success');
      }
      setForm({ name: '', description: '', price: '', duration_minutes: '', image_url: '' });
      setShowForm(false);
      setEditingService(null);
      fetchServices();
    } catch (error) {
      addNotification(`Failed to ${editingService ? 'update' : 'create'} service`, 'error');
    }
  };

  const handleEditClick = (service) => {
    setEditingService(service);
    setForm({
      name: service.name,
      description: service.description,
      price: service.price?.toString() || '',
      duration_minutes: service.duration_minutes?.toString() || '',
      image_url: service.image_url || '',
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingService(null);
    setForm({ name: '', description: '', price: '', duration_minutes: '', image_url: '' });
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm('Are you certain you want to delete this service? This may affect historical data.')) return;
    try {
      await servicesAPI.delete(serviceId);
      addNotification('Service has been permanently deleted', 'success');
      fetchServices();
    } catch (error) {
      addNotification('Failed to delete service', 'error');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="fade-in-up pb-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 border-b border-white/5 pb-6">
        <div>
           <h1 className="text-3xl md:text-4xl font-bold font-['Outfit'] mb-2">Service <span className="gradient-text">Catalog</span></h1>
           <p className="text-gray-400">Manage {services.length} active offerings in the marketplace</p>
        </div>
        <button
          onClick={showForm ? handleCancelForm : () => setShowForm(true)}
          className={`btn-primary shadow-[0_0_20px_rgba(79,142,247,0.3)] ${showForm ? '!bg-gradient-to-r !from-gray-600 !to-gray-700 !shadow-none' : ''}`}
        >
          {showForm ? 'Cancel' : '➕ Add New Service'}
        </button>
      </div>

      {showForm && (
        <div className="mb-12 relative">
          <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-2xl -z-10"></div>
          <form onSubmit={handleSubmit} className="glass-card p-8 border border-blue-500/30">
            <h3 className="text-xl font-bold mb-6 font-['Outfit'] flex items-center gap-2 text-blue-400">
               <span className="p-1.5 bg-blue-500/20 rounded text-blue-300 border border-blue-500/30 text-sm"><Sparkles className="w-4 h-4 text-blue-300" /></span>
               {editingService ? `Edit Service: ${editingService.name}` : 'Create New Offering'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
               <div className="space-y-1">
                 <label className="form-label text-blue-200">Service Name</label>
                 <input
                   type="text"
                   name="name"
                   placeholder="e.g. VIP Consultation"
                   value={form.name}
                   onChange={handleChange}
                   required
                   className="form-input bg-black/40 focus:bg-[rgba(79,142,247,0.05)]"
                 />
               </div>
               
                <div className="space-y-1">
                  <label className="form-label text-blue-200">Price (USD)</label>
                  <div className="relative">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                     <input
                       type="number"
                       name="price"
                       placeholder="99.99"
                       value={form.price}
                       onChange={handleChange}
                       required
                       step="0.01"
                       className="form-input bg-black/40 !pl-10 focus:bg-[rgba(79,142,247,0.05)]"
                     />
                  </div>
               </div>

               <div className="space-y-1">
                 <label className="form-label text-blue-200">Duration (Minutes)</label>
                 <div className="relative">
                    <input
                      type="number"
                      name="duration_minutes"
                      placeholder="60"
                      value={form.duration_minutes}
                      onChange={handleChange}
                      required
                      className="form-input bg-black/40 focus:bg-[rgba(79,142,247,0.05)]"
                    />
                 </div>
               </div>
            </div>

            <div className="space-y-1 mb-6">
              <label className="form-label text-blue-200">Cover Image URL (Optional)</label>
              <div className="relative">
                 <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                 <input
                   type="url"
                   name="image_url"
                   placeholder="https://example.com/image.jpg"
                   value={form.image_url}
                   onChange={handleChange}
                   className="form-input bg-black/40 !pl-12 focus:bg-[rgba(79,142,247,0.05)]"
                 />
              </div>
            </div>

            <div className="space-y-1 mb-6">
               <label className="form-label text-blue-200">Full Description</label>
               <textarea
                 name="description"
                 placeholder="Describe the premium value this service provides..."
                 value={form.description}
                 onChange={handleChange}
                 required
                 className="form-input bg-black/40 h-28 resize-none focus:bg-[rgba(79,142,247,0.05)]"
               ></textarea>
            </div>

            <div className="flex justify-end pt-4 border-t border-white/10">
                <button
                  type="submit"
                  className="btn-success shadow-[0_0_20px_rgba(34,197,94,0.3)] bg-green-500/20 text-green-400 hover:bg-green-500/30 px-8 py-3 w-full md:w-auto font-bold uppercase tracking-wider"
                >
                  {editingService ? 'Save Changes' : 'Publish Service Catalog'}
                </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div key={service.id} className="glass-card flex flex-col h-full group overflow-hidden" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="relative h-48 overflow-hidden bg-black/40">
              {service.image_url ? (
                 <>
                   <img src={service.image_url} alt={service.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110" />
                   <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,22,35,1)] to-transparent opacity-90"></div>
                 </>
              ) : (
                 <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-b border-white/5">
                    <Package className="w-12 h-12 text-blue-400 opacity-20" />
                 </div>
              )}
              
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center backdrop-blur-sm z-20 gap-4">
                 <button
                   onClick={() => handleEditClick(service)}
                   className="btn-primary flex items-center gap-2 px-6 py-3 shadow-xl transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
                 >
                   <Settings className="w-5 h-5" />
                   <span className="text-xs font-bold tracking-wider uppercase">Edit Service</span>
                 </button>
                 <button
                   onClick={() => handleDelete(service.id)}
                   className="bg-red-500/20 text-red-400 hover:bg-red-500/40 border border-red-500/30 rounded-lg flex items-center gap-2 px-6 py-3 shadow-xl transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75"
                 >
                   <Trash2 className="w-5 h-5" />
                   <span className="text-xs font-bold tracking-wider uppercase">Delete Item</span>
                 </button>
              </div>
            </div>
            
            <div className="p-6 flex flex-col flex-1 relative z-10 -mt-10">
              <div className="flex justify-between items-start mb-4 z-10">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-black font-['Outfit'] px-4 py-2 rounded-xl shadow-[0_8px_20px_rgba(79,142,247,0.3)] border border-white/20 text-xl transform group-hover:-translate-y-1 transition-transform">
                   <span className="text-sm mr-1.5 opacity-80">$</span>{service.price}
                </div>
                {service.duration_minutes && (
                  <div className="bg-white/5 backdrop-blur-md text-blue-300 font-bold font-['Outfit'] px-3 py-1.5 rounded-lg border border-white/10 text-sm">
                    {service.duration_minutes} Mins
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold mb-2 font-['Outfit'] leading-tight">{service.name}</h3>
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                 {service.description}
              </p>
            </div>
          </div>
        ))}
        {services.length === 0 && !showForm && (
           <div className="col-span-full py-16 text-center text-gray-500">
              No services found. Click Add New Service to begin building your catalog.
           </div>
        )}
      </div>
    </div>
  );
}
