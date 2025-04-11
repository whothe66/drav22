
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthError = () => {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const errorMessage = params.get('error') || 'Unknown error';

  let readableError = 'An unknown error occurred during authentication.';
  
  // Map error codes to user-friendly messages
  switch (errorMessage) {
    case 'invalid_state':
      readableError = 'Invalid authentication state. Please try again.';
      break;
    case 'invalid_code':
      readableError = 'Invalid authorization code received. Please try again.';
      break;
    case 'token_exchange_failed':
      readableError = 'Failed to exchange authorization code for access token. Please try again.';
      break;
    case 'user_info_failed':
      readableError = 'Failed to retrieve user information. Please try again.';
      break;
    case 'auth_failed':
      readableError = 'Authentication failed. Please try again.';
      break;
    default:
      if (errorMessage !== 'Unknown error') {
        readableError = `Authentication error: ${errorMessage}`;
      }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer);
          navigate('/login');
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white shadow-lg rounded-lg max-w-md text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Authentication Failed</h1>
        <p className="text-gray-600 mb-6">
          {readableError}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Redirecting to login page in {countdown} seconds...
        </p>
        <button 
          onClick={() => navigate('/login')} 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Return to Login
        </button>
      </div>
    </div>
  );
};

export default AuthError;
