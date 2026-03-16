import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicesAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import LoadingSpinner from '../components/shared/LoadingSpinner';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
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

  if (loading) return <LoadingSpinner />;

  const handleBooking = (serviceId) => {
    if (!user) {
      addNotification('Please login to book a service', 'warning');
      navigate('/login');
      return;
    }
    navigate(`/booking/${serviceId}`);
  };

  return (
    <div className="space-y-12 fade-in-up">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-['Outfit']">
          Our <span className="gradient-text">Premium Services</span>
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed max-w-xl mx-auto">
          Explore our <span className="text-white font-medium">elite collection</span> of professional services, meticulously curated to provide the highest standard of excellence.
        </p>
      </div>

      {services.length === 0 ? (
        <div className="glass-card text-center py-20 max-w-xl mx-auto">
          <div className="text-5xl mb-6 opacity-50">🔍</div>
          <h3 className="text-xl font-bold text-white mb-2">No Services Found</h3>
          <p className="text-gray-400">We are currently updating our offerings. Please check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={service.id} 
              className="glass-card flex flex-col h-full group overflow-hidden hover:border-blue-500/30 hover:shadow-[0_20px_40px_rgba(59,130,246,0.15)] transition-all duration-500"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-56 overflow-hidden bg-[rgba(255,255,255,0.02)]">
                {service.image_url ? (
                  <img
                    src={service.image_url}
                    alt={service.name}
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900/40 to-purple-900/40">
                    <span className="text-4xl opacity-20">🔧</span>
                  </div>
                )}
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,22,35,1)] via-[rgba(15,22,35,0.4)] to-transparent opacity-80"></div>
                
                <div className="absolute bottom-4 left-6">
                  <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-blue-300 border border-white/10 uppercase tracking-wider">
                    Premium
                  </span>
                </div>
              </div>
              
              <div className="p-6 md:p-8 flex flex-col flex-1 relative z-10">
                <h3 className="text-2xl font-bold mb-3 font-['Outfit'] group-hover:text-blue-400 transition-colors">
                  {service.name}
                </h3>
                <p className="text-gray-400 mb-6 text-sm flex-1 leading-relaxed">
                  {service.description}
                </p>
                
                <div className="divider opacity-50 my-4"></div>
                
                <div className="flex justify-between items-center mt-auto gap-4">
                  <div className="flex flex-col">
                     <span className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Price & Duration</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-white font-['Outfit']">
                            <span className="text-blue-500 text-xl mr-1">$</span>{service.price}
                        </span>
                        {service.duration_minutes && (
                          <span className="text-gray-400 text-sm font-medium">
                            / {service.duration_minutes} mins
                          </span>
                        )}
                      </div>
                  </div>
                  <button
                    onClick={() => handleBooking(service.id)}
                    className="btn-primary py-3 px-6 shadow-[0_0_20px_rgba(79,142,247,0.2)]"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
