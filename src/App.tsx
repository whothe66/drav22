
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AuthCallback from './components/AuthCallback';
import AuthSuccess from './pages/AuthSuccess';
import AuthError from './pages/AuthError';
import Index from './pages/Index';
import CriticalITServices from './pages/CriticalITServices';
import DRParameters from './pages/DRParameters';
import OfficeSites from './pages/OfficeSites';
import RiskIssueRegister from './pages/RiskIssueRegister';
import MaturityAssessment from './pages/MaturityAssessment';
import NotFound from './pages/NotFound';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toaster } from './components/ui/sonner';

const App = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('authToken');
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/auth/callback" 
            element={
              <AuthCallback 
                onLoginSuccess={(token) => {
                  localStorage.setItem('authToken', token);
                }}
              />
            } 
          />
          <Route 
            path="/auth/success" 
            element={
              <AuthSuccess 
                onLoginSuccess={(token) => {
                  localStorage.setItem('authToken', token);
                }}
              />
            } 
          />
          <Route path="/auth/error" element={<AuthError />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/critical-it-services" element={<ProtectedRoute><CriticalITServices /></ProtectedRoute>} />
          <Route path="/dr-parameters" element={<ProtectedRoute><DRParameters /></ProtectedRoute>} />
          <Route path="/office-sites" element={<ProtectedRoute><OfficeSites /></ProtectedRoute>} />
          <Route path="/risk-issue-register" element={<ProtectedRoute><RiskIssueRegister /></ProtectedRoute>} />
          <Route path="/maturity-assessment" element={<ProtectedRoute><MaturityAssessment /></ProtectedRoute>} />
          
          {/* Catch-all route for 404 */}
          <Route path="*" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
};

export default App;
