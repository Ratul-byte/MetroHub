
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const [normalUsersCount, setNormalUsersCount] = useState(0);
  const [rapidPassUsersCount, setRapidPassUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const fetchUserCounts = async () => {
      try {
        const config = {
          headers: {
            'x-auth-token': token,
          },
        };
        const { data } = await axios.get('http://localhost:5001/api/admin/users', config);
        setNormalUsersCount(data.normalUsersCount);
        setRapidPassUsersCount(data.rapidPassUsersCount);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred');
        setLoading(false);
      }
    };

    fetchUserCounts();
  }, [token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold">User Statistics</h2>
          <p>Total Normal Users: {normalUsersCount}</p>
          <p>Total Rapid Pass Users: {rapidPassUsersCount}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
