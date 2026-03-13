import Navbar from './Navbar';
import Toast from './Toast';
import logoImg from '../../assets/logo.jpg';

export default function Layout({ children }) {
  return (
    <div className="relative flex flex-col min-h-screen w-full overflow-hidden">
      <div className="mesh-bg"></div>

      <Navbar />
      
      {/* Container wrapper directly ensures alignment */}
      <main className="flex-1 w-full flex flex-col items-center pt-8 pb-16">
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto flex-1 flex flex-col">
          {children}
        </div>
      </main>
      
      <Toast />
      
      <footer className="w-full border-t border-white/10 bg-gray-900/50 backdrop-blur-md py-8">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg overflow-hidden bg-white flex items-center justify-center">
                <img src={logoImg} alt="ServiceHub Logo" className="w-full h-full object-cover" />
             </div>
             <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 font-['Outfit']">ServiceHub</span>
          </div>
          
          <div className="text-sm text-gray-400 flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <p>&copy; {new Date().getFullYear()} ServiceHub.</p>
            <span className="hidden md:inline text-gray-600">|</span>
            <p className="flex items-center gap-1">
              Developed by
              <a 
                href="https://engineer-sharif.infinityfreeapp.com/" 
                target="_blank" 
                rel="noreferrer"
                className="text-white hover:text-blue-400 transition-colors font-medium flex items-center gap-1 group"
              >
                Shariful Islam
                <svg className="w-3 h-3 text-gray-500 group-hover:text-blue-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
