
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthCallbackProps {
  onLoginSuccess: (token: string) => void;
}

const AuthCallback = ({ onLoginSuccess }: AuthCallbackProps) => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const errorMessage = params.get('error');
    
    if (errorMessage) {
      setError(errorMessage);
      setTimeout(() => navigate('/login'), 3000);
      return;
    }
    
    if (token) {
      // Store token in localStorage
      localStorage.setItem('authToken', token);
      
      // Call the onLoginSuccess callback
      onLoginSuccess(token);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } else {
      setError('No authentication token received');
      setTimeout(() => navigate('/login'), 3000);
    }
  }, [location, navigate, onLoginSuccess]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="p-4 bg-red-100 text-red-700 rounded max-w-md">
          <h2 className="font-bold mb-2">Authentication Error</h2>
          <p>{error}</p>
          <p className="mt-2">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
        <p className="mt-4 text-lg">Authenticating...</p>
        <p className="mt-2 text-sm text-gray-600">Please wait while we complete the authentication process.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
