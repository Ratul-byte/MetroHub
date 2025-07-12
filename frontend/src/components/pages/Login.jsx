import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', {
        credential,
        password,
      });
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 animate-fadeIn opacity-0" style={{ animationDelay: '0.05s' }}>
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <Input type="text" placeholder="Email or Phone Number" value={credential} onChange={(e) => setCredential(e.target.value)} />
        <Input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className="flex items-center">
          <input type="checkbox" id="showPassword" className="mr-2" onChange={() => setShowPassword(!showPassword)} />
          <label htmlFor="showPassword">Show Password</label>
        </div>
        <Button onClick={handleLogin} disabled={loading} className="bg-blue-500 hover:bg-blue-600">
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </div>
    </div>
  );
};

export default Login;
