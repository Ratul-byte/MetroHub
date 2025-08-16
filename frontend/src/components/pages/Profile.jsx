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
  const [depositAmount, setDepositAmount] = useState('');
  const [rapidPassId, setRapidPassId] = useState('');

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

      const response = await axios.put('http://localhost:5001/api/user/profile', payload, {
        headers: {
          'x-auth-token': token,
        },
      });
      setMessage("Profile updated successfully");
      // Update auth context with new user data if successful
      login(response.data, token); // Re-login to update context
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleBecomeRapidPassUser = async () => {
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const response = await axios.put('http://localhost:5001/api/user/profile', { role: 'rapidPassUser', rapidPassId: rapidPassId }, {
        headers: {
          'x-auth-token': token,
        },
      });
      setMessage('Successfully upgraded to Rapid Pass user.');
      login(response.data, token);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upgrade.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const response = await axios.put('http://localhost:5001/api/user/profile', { passBalance: Number(depositAmount) }, {
        headers: {
          'x-auth-token': token,
        },
      });
      setMessage(`Successfully deposited ${depositAmount}.`);
      setDepositAmount('');
      login(response.data, token);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to deposit.');
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

        {user.role !== 'admin' ? (
          <>
            <Input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input type="text" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            <Input type="password" placeholder="New Password (leave blank to keep current)" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Input type="text" placeholder="Preferred Routes (comma-separated)" value={preferredRoutes} onChange={(e) => setPreferredRoutes(e.target.value)} />

            <Button onClick={handleUpdateProfile} disabled={loading} className="border-2 border-black text-black font-bold rounded-md transition-all duration-300 ease-in-out px-4 py-2 hover:bg-black hover:text-white">
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>

            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-semibold text-center">Rapid Pass</h3>
              {user.role === 'rapidPassUser' ? (
                <div className="text-center">
                  <p className="text-green-600">You are a Rapid Pass user.</p>
                  <p>Balance: ${user && user.passBalance ? user.passBalance.toFixed(2) : '0.00'}</p>
                </div>
              ) : (
                <>
                  <Input type="text" placeholder="Enter Rapid Pass ID" value={rapidPassId} onChange={(e) => setRapidPassId(e.target.value)} className="mb-4" />
                  <Button onClick={handleBecomeRapidPassUser} disabled={loading} className="w-full mt-2 border-2 border-blue-500 text-blue-500 font-bold rounded-md transition-all duration-300 ease-in-out px-4 py-2 hover:bg-blue-500 hover:text-white">
                    {loading ? 'Upgrading...' : 'Become a Rapid Pass User'}
                  </Button>
                </>
              )}
              <div className="mt-4">
                <p className="text-center text-lg font-semibold mb-2">Current Balance: ${user && user.passBalance ? user.passBalance.toFixed(2) : '0.00'}</p>
                <Input type="number" placeholder="Deposit Amount" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
                <Button onClick={handleDeposit} disabled={loading || user.role !== 'rapidPassUser'} className="w-full mt-2 border-2 border-green-500 text-green-500 font-bold rounded-md transition-all duration-300 ease-in-out px-4 py-2 hover:bg-green-500 hover:text-white">
                  {loading ? 'Depositing...' : 'Deposit'}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center text-lg text-gray-600">Admin users do not have a profile to update here.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
