// components/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleLogin = (e) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    
    // Simulate login (in a real app, you would call an API)
    setTimeout(() => {
      const user = {
        id: 1,
        email,
        name: email.split('@')[0]
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      setIsLoggedIn(true);
      toast.success('Login successful!');
      navigate('/');
      
      setLoading(false);
    }, 1000);
  };
  
  return (
    <div className="auth-container flex items-center justify-center min-h-screen">
      <div className="auth-form w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Log In to TestMaster</h1>
        
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">Email</label>
            <input
              type="email"
              id="email"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:border-purple-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2">Password</label>
            <input
              type="password"
              id="password"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:border-purple-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full p-3 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Don't have an account? <Link to="/register" className="text-purple-400 hover:text-purple-300">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// components/Register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleRegister = (e) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    // Simulate registration (in a real app, you would call an API)
    setTimeout(() => {
      const user = {
        id: Date.now(),
        name,
        email
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      setIsLoggedIn(true);
      toast.success('Registration successful!');
      navigate('/');
      
      setLoading(false);
    }, 1000);
  };
  
  return (
    <div className="auth-container flex items-center justify-center min-h-screen">
      <div className="auth-form w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Create an Account</h1>
        
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2">Full Name</label>
            <input
              type="text"
              id="name"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:border-purple-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">Email</label>
            <input
              type="email"
              id="email"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:border-purple-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2">Password</label>
            <input
              type="password"
              id="password"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:border-purple-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block mb-2">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:border-purple-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full p-3 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Already have an account? <Link to="/login" className="text-purple-400 hover:text-purple-300">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export { Login, Register };
