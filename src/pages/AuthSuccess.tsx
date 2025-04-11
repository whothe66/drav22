
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthSuccessProps {
  onLoginSuccess: (token: string) => void;
}

const AuthSuccess = ({ onLoginSuccess }: AuthSuccessProps) => {
  const [countdown, setCountdown] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    
    if (token) {
      onLoginSuccess(token);
      
      // Set up countdown for automatic redirect
      const timer = setInterval(() => {
        setCountdown((prevCount) => {
          if (prevCount <= 1) {
            clearInterval(timer);
            navigate('/'); // Redirect to main index instead of /dashboard
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    } else {
      // No token provided, redirect to login
      navigate('/login');
    }
  }, [location, navigate, onLoginSuccess]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white shadow-lg rounded-lg max-w-md text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Login Successful!</h1>
        <p className="text-gray-600 mb-4">
          You have successfully logged in. Redirecting to dashboard in {countdown} seconds...
        </p>
        <button 
          onClick={() => navigate('/')} 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Go to Dashboard Now
        </button>
      </div>
    </div>
  );
};

export default AuthSuccess;
