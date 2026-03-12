import Navbar from './Navbar';
import Toast from './Toast';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
      </main>
      <Toast />
      <footer className="bg-gray-800 text-gray-300 mt-12 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p>&copy; 2024 ServiceHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
