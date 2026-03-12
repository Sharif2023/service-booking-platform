import { useEffect, useState } from 'react';
import { servicesAPI } from '../../services/api';
import useNotification from '../../hooks/useNotification';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
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
      await servicesAPI.create({
        ...form,
        price: parseFloat(form.price),
      });
      addNotification('Service created successfully', 'success');
      setForm({ name: '', description: '', price: '', image_url: '' });
      setShowForm(false);
      fetchServices();
    } catch (error) {
      addNotification('Failed to create service', 'error');
    }
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await servicesAPI.delete(serviceId);
      addNotification('Service deleted', 'success');
      fetchServices();
    } catch (error) {
      addNotification('Failed to delete service', 'error');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Services</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Service'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-8 space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Service Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
          ></textarea>
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
            step="0.01"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="url"
            name="image_url"
            placeholder="Image URL"
            value={form.image_url}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold"
          >
            Create Service
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white p-6 rounded-lg shadow">
            {service.image_url && (
              <img src={service.image_url} alt={service.name} className="w-full h-40 object-cover rounded-lg mb-4" />
            )}
            <h3 className="text-xl font-bold mb-2">{service.name}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>
            <p className="text-2xl font-bold mb-4">${service.price}</p>
            <button
              onClick={() => handleDelete(service.id)}
              className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
