import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center h-15">
      <Link to="/" className="text-2xl font-bold animate-fadeIn opacity-0" style={{ animationDelay: '0.2s' }}>MetroHub</Link>
      <div>
        {user ? (
          <div className="flex items-center space-x-4">
            <span className="text-lg animate-fadeIn opacity-0" style={{ animationDelay: '0.3s' }}>Welcome, {user.name}!</span>
            <Link
              to="/profile"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md animate-fadeIn opacity-0"
              style={{ animationDelay: '0.4s' }}
            >
              Profile
            </Link>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md animate-fadeIn opacity-0"
              style={{ animationDelay: '0.5s' }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="space-x-4">
            <Link
              to="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md animate-fadeIn opacity-0"
              style={{ animationDelay: '0.4s' }}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md animate-fadeIn opacity-0"
              style={{ animationDelay: '0.5s' }}
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
