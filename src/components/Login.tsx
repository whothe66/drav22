
import { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLarkLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get the authorization URL from your backend
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/lark/login`);
      
      if (response.data && response.data.authUrl) {
        // Redirect to Lark authorization page
        window.location.href = response.data.authUrl;
      } else {
        setError('Failed to get authorization URL');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Failed to initiate login:', err);
      setError('Failed to initiate login. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Asset Maturity Dashboard</h1>
          <p className="mt-2 text-gray-600">Login to access your dashboard</p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <div className="mt-6">
          <button
            onClick={handleLarkLogin}
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isLoading ? 'Loading...' : 'Login with Lark'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
