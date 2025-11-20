import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { apiService } from '../../services/api';

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await apiService.adminLogin(credentials);
      
      if (response.success && (response.data as any)?.token) {
        // Token is already stored in localStorage by apiService
        navigate('/admin/dashboard');
      } else {
        setError(response.error?.message || 'Invalid email or password');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')`
        }}
      />
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <Header currentPage="admin" />
        
        {/* Login Form */}
        <div className="flex items-center justify-center min-h-[calc(100vh-140px)] sm:min-h-[calc(100vh-160px)] px-4 relative z-10">
          <Card className="w-full max-w-md">
            <div className="text-center mb-6 sm:mb-8">
              <div className="flex items-center justify-center mb-3 sm:mb-4">
                <Shield className="text-primary-900 mr-2 sm:mr-3" size={28} />
                <h1 className="text-responsive-xl font-bold text-gray-900">Admin Portal</h1>
              </div>
              <p className="text-gray-600 text-responsive-sm">Sign in to access the admin dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email"
                type="email"
                value={credentials.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                icon={<User size={16} />}
                error={error ? 'Invalid credentials' : ''}
              />

              <Input
                label="Password"
                type="password"
                value={credentials.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter your password"
                icon={<Lock size={16} />}
              />

              <Button
                type="submit"
                className="w-full"
                leftIcon={<Lock size={16} />}
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </form>

            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-xs sm:text-sm text-gray-500">
                Demo credentials: <span className="font-medium">admin@airlinebooking.com</span> / <span className="font-medium">admin123</span>
              </p>
            </div>
          </Card>
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default AdminLoginPage;