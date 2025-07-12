import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import Input from '../ui/Input';
import Button from '../ui/Button';

const Profile = () => {
  const { user, token, login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [preferredRoutes, setPreferredRoutes] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (user && token) {
        try {
          setLoading(true);
          const response = await axios.get('http://localhost:5001/api/auth/profile', {
            headers: {
              'x-auth-token': token,
            },
          });
          const userData = response.data;
          setName(userData.name || '');
          setEmail(userData.email || '');
          setPhoneNumber(userData.phoneNumber || '');
          setPreferredRoutes(userData.preferredRoutes.join(', ') || '');
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to fetch profile.');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProfile();
  }, [user, token]);

  const handleUpdateProfile = async () => {
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const payload = {
        name,
        email,
        phoneNumber,
        preferredRoutes: preferredRoutes.split(',').map(route => route.trim()),
      };
      if (password) {
        payload.password = password;
      }

      const response = await axios.put('http://localhost:5001/api/auth/profile', payload, {
        headers: {
          'x-auth-token': token,
        },
      });
      setMessage(response.data.message);
      // Update auth context with new user data if successful
      login(response.data.user, token); // Re-login to update context
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return <div className="text-center mt-10">Loading profile...</div>;
  }

  if (!user) {
    return <div className="text-center mt-10 text-red-500">Please log in to view your profile.</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 animate-fadeIn opacity-0" style={{ animationDelay: '0.05s' }}>
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">User Profile</h2>
        {message && <p className="text-green-500 text-center">{message}</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        <Input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="text" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        <Input type="password" placeholder="New Password (leave blank to keep current)" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Input type="text" placeholder="Preferred Routes (comma-separated)" value={preferredRoutes} onChange={(e) => setPreferredRoutes(e.target.value)} />

        <Button onClick={handleUpdateProfile} disabled={loading} className="bg-blue-500 hover:bg-blue-600">
          {loading ? 'Updating...' : 'Update Profile'}
        </Button>
      </div>
    </div>
  );
};

export default Profile;
