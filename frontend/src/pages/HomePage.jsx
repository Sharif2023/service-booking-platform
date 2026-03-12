import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to ServiceHub</h1>
        <p className="text-xl mb-8">Find and book professional services in minutes</p>
        <Link
          to="/services"
          className="inline-block px-8 py-3 bg-green-500 hover:bg-green-600 rounded-lg text-white font-bold transition"
        >
          Browse Services
        </Link>
      </div>

      {/* Features */}
      <div>
        <h2 className="text-3xl font-bold mb-8 text-center">Why Choose ServiceHub?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: '⚡',
              title: 'Quick Booking',
              desc: 'Book services in just a few clicks',
            },
            {
              icon: '💳',
              title: 'Secure Payment',
              desc: 'Safe transactions with Stripe',
            },
            {
              icon: '📧',
              title: 'Instant Confirmation',
              desc: 'Get email confirmations for all bookings',
            },
          ].map((feature, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow text-center">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-100 p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
        {user ? (
          <Link
            to="/services"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Browse Services Now
          </Link>
        ) : (
          <>
            <p className="text-gray-600 mb-4">Sign up to start booking services</p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/login"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Register
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
