import React, { useState } from 'react';
import axiosInstance from '../API/axiosInstance';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('admin@foodsters.org');
  const [password, setPassword] = useState('Password123*');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true); // Set loading to true when submitting

    if (!email || !password) {
      setError('Please fill in both fields.');
      setLoading(false); // Reset loading
      return;
    }

    try {
      const response = await axiosInstance.post('/users/login', { email, password }); // Use relative URL
      const token = response.data.data.token;  // Access token correctly
      localStorage.setItem('token', token);    // Store the token in localStorage
    
      // console.log('Token from API:', token); 
      // console.log('Full Response:', response); 
      // console.log('Token from Response:', response?.data?.data?.token); 
    

      navigate('/dashboard');
return;
      
    } catch (err: any) {
      console.error('Error:', err.response || err.message);

      // Set a generic error message
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false); // Reset loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold  text-[#5F25EB] mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className=" bg-[#5F25EB] text-white py-2 px-4 mt-2 hover:text-gray-200 focus:outline-none focus:ring-2 focus:bg-[#3A1A82]"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
