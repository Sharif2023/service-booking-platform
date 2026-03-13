import { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const verificationStarted = useRef(false);

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link.');
      return;
    }

    // Prevent double execution in React Strict Mode
    if (verificationStarted.current) return;
    verificationStarted.current = true;

    const verifyToken = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/verify/${token}`);
        setStatus('success');
        setMessage(response.data.message);
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.error || 'Verification failed. The link may have expired.');
      }
    };

    verifyToken();
  }, [searchParams]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
      <div className="glass-card max-w-md w-full p-10 text-center fade-in-up">
        {status === 'verifying' && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-bold font-['Outfit'] mb-2">Verifying Account</h2>
            <p className="text-gray-400">Please wait while we confirm your email...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mb-6 text-green-400">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-3xl font-bold font-['Outfit'] mb-4">Email Verified!</h2>
            <p className="text-gray-400 mb-8">{message}</p>
            <Link to="/login" className="btn-primary w-full shadow-[0_0_20px_rgba(79,142,247,0.3)]">
              Sign In to Your Account <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mb-6 text-red-400">
              <XCircle size={40} />
            </div>
            <h2 className="text-3xl font-bold font-['Outfit'] mb-4">Verification Failed</h2>
            <p className="text-gray-400 mb-8">{message}</p>
            <div className="flex flex-col gap-3 w-full">
               <Link to="/login" className="btn-secondary w-full">
                  Try Logging In
               </Link>
               <Link to="/register" className="text-sm text-gray-500 hover:text-white transition-colors">
                  Didn't get an email? Sign up again
               </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
