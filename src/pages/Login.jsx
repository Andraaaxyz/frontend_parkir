import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import logo from '../assets/logo.png';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/login', formData);
      const { user, token } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'petugas') navigate('/petugas/dashboard');
      else if (user.role === 'owner') navigate('/owner/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.errors?.username?.[0] || 
        err.response?.data?.message || 
        'Login failed, please check your credentials'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div>
          <div className="mx-auto h-20 w-20 flex items-center justify-center">
            <img src={logo} alt="ParkirinAzzZ Logo" className="h-full w-auto object-contain" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            ParkirinAzzZ
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sistem Manajemen Parkir Modern
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm text-center">
              {error}
            </div>
          )}
          
          <div className="rounded-md shadow-sm -space-y-px mt-4">
            <div>
              <label className="sr-only">Username</label>
              <input
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
            <div>
              <label className="sr-only">Password</label>
              <input
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
