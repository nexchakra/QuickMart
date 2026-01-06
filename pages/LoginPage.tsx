
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email);
    if (success) {
      navigate('/');
    } else {
      setError('Invalid email. Try "john@example.com" for user or "admin@quickmart.com" for admin.');
    }
  };

  return (
    <div className="max-w-md mx-auto py-20 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-lg border border-gray-100">
        <h1 className="text-3xl font-bold mb-2 text-center">Welcome Back</h1>
        <p className="text-gray-500 text-center mb-8">Login to your account to continue</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., john@example.com"
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 transition"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold hover:bg-green-700 transition">
            Login
          </button>
        </form>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-400">
          <p>Mock Credentials:</p>
          <p>User: john@example.com</p>
          <p>Admin: admin@quickmart.com</p>
        </div>
      </div>
    </div>
  );
};
