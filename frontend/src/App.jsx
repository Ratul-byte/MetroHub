import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Profile from './components/pages/Profile';
import Navbar from './components/layout/Navbar';
import { useAuth } from './context/AuthContext';
import homepageImg from './assets/homepage_img2.jpg';
import Map from './components/pages/Map';
import AdminDashboard from './components/pages/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import UserManagement from './components/pages/UserManagement';

import ResetPassword from './components/pages/ResetPassword';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="relative h-full">
      <img
        src={homepageImg}
        alt="Homepage"
        className="absolute left-0 top-0 w-1/2 h-full object-cover"
        style={{ zIndex: 2 }}
      />
      <div className="absolute left-1/2 w-1/2 h-full bg-[conic-gradient(from_0deg,_#b91c1c_0%,_#dc2626_25%,_#15803d_50%,_#16a34a_75%,_#b91c1c_100%)] animate-radialPulse"></div>
      <div className={`relative z-10 flex flex-col items-end justify-center h-full text-white ${user ? 'pr-52' : 'pr-32'}`}>
        <div 
          className="bg-white bg-opacity-10 p-8 rounded-lg shadow-lg backdrop-blur-2xl animate-fadeIn opacity-0"
          style={{ animationDelay: '0.05s' }}
        >
          <h1 
            className="text-center text-5xl font-bold mb-4 animate-fadeIn opacity-0" 
            style={{ animationDelay: '0.1s', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}
          >
            {user && user.role === 'admin' ? 'Welcome, Admin!' : user ? `Welcome, ${user.name}!` : 'Welcome to MetroHub'}
          </h1>
          <p 
            className="text-center text-xl mb-8 animate-fadeIn opacity-0" 
            style={{ animationDelay: '0.2s', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)' }}
          >
            {user && user.role === 'admin' ? null : user ? 'Where are we heading today?' : 'Your one-stop app to enjoy your metro journey.'}
          </p>
          <div className="flex justify-center items-center space-x-4 animate-fadeIn opacity-0" style={{ animationDelay: '0.5s' }}>
            {!user ? (
              <>
                <Link 
                  to="/login" 
                  className="px-6 py-3 bg-blue-700 text-white rounded-md text-lg hover:bg-blue-800 transition duration-300" 
                  style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)' }}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-6 py-3 bg-green-700 text-white rounded-md text-lg hover:bg-green-800 transition duration-300" 
                  style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)' }}
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                {user && user.role === 'admin' ? (
                <>
                <Link
                  to="/admin/stations" 
                  className="px-6 py-3 bg-orange-600 text-white rounded-md text-lg hover:bg-orange-700 transition duration-300" 
                  style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)' }}
                >
                  Show Station Details
                </Link>
                <Link
                  to="/admin/users"
                  className="px-6 py-3 bg-purple-600 text-white rounded-md text-lg hover:bg-purple-700 transition duration-300"
                  style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)' }}
                >
                  Manage Users
                </Link>
                </>
              ) : (
                <Link 
                  to="/book-ticket" 
                  className="px-6 py-3 bg-orange-600 text-white rounded-md text-lg hover:bg-orange-700 transition duration-300" 
                  style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)' }}
                >
                  Book Ticket
                </Link>
              )}
                <Link 
                  to="/map" 
                  className="px-6 py-3 bg-indigo-600 text-white rounded-md text-lg hover:bg-indigo-700 transition duration-300" 
                  style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)' }}
                >
                  View Map
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <div className="flex flex-col h-screen" style={{ margin: 0, overflowY: 'auto', fontFamily: "'Open Sans', sans-serif" }}>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap');

            @keyframes waveRotate {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            .animate-waveRotate {
              animation: waveRotate 10s linear infinite;
            }
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            .animate-fadeIn {
              animation: fadeIn 1s ease-in forwards;
            }
          `}
        </style>
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/map" element={<Map />} />
            <Route path="/admin" element={<AdminRoute />}>
              <Route path="" element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
            </Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;