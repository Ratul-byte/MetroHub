import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { token } = useAuth();

  const fetchUsers = async () => {
    try {
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      const response = await axios.get('import.meta.env.VITE_API_BASE_URL/api/admin/users', config);
      setUsers(response.data.users);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleRoleChange = async (id, newRole) => {
    try {
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      await axios.put(`import.meta.env.VITE_API_BASE_URL/api/admin/users/${id}/role`, { role: newRole }, config);
      fetchUsers(); // Re-fetch users to update the list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user role.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const config = {
          headers: {
            'x-auth-token': token,
          },
        };
        await axios.delete(`import.meta.env.VITE_API_BASE_URL/api/admin/users/${id}`, config);
        fetchUsers(); // Re-fetch users to update the list
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete user.');
      }
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading users...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  const handleRowClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Phone Number</th>
                <th className="py-2 px-4 border-b">Role</th>
                <th className="py-2 px-4 border-b">Rapid Pass ID</th>
                <th className="py-2 px-4 border-b">Pass Balance</th>
              </tr>
            </thead>
            <tbody>
              {users.filter(user => user.name !== 'Admin').map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleRowClick(user)}>
                  <td className="py-2 px-4 border-b text-sm">{user._id}</td>
                  <td className="py-2 px-4 border-b">{user.name}</td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b">{user.phoneNumber}</td>
                  <td className="py-2 px-4 border-b">{user.role}</td>
                  <td className="py-2 px-4 border-b">{user.rapidPassId || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{user.passBalance !== undefined ? `$${user.passBalance.toFixed(2)}` : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-bold mb-4">Actions for {selectedUser.name}</h3>
            <div className="flex flex-col space-y-2">
              {selectedUser.role === 'rapidPassUser' && (
                <button
                  onClick={() => {
                    handleRoleChange(selectedUser._id, 'normal');
                    closeModal();
                  }}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Make Regular User
                </button>
              )}
              <button
                onClick={() => {
                  handleDelete(selectedUser._id);
                  closeModal();
                }}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Delete User
              </button>
            </div>
            <button
              onClick={closeModal}
              className="mt-4 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
