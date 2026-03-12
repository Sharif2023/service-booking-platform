import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { servicesAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import useNotification from '../hooks/useNotification';
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Our Services</h1>
        <p className="text-gray-600">Choose from our professional services</p>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No services available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              {service.image_url && (
                <img
                  src={service.image_url}
                  alt={service.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="text-xl font-bold mb-2">{service.name}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">${service.price}</span>
                <button
                  onClick={() => handleBooking(service.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
