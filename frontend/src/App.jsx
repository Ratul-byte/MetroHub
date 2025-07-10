import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Profile from './components/pages/Profile';
import Navbar from './components/layout/Navbar';
import { useAuth } from './context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">
        {user ? `Welcome, ${user.name} to MetroHub!` : 'Welcome to MetroHub'}
      </h1>
      {!user && (
        <div className="space-x-4">
          <Link to="/login" className="px-6 py-3 bg-blue-500 text-white rounded-md text-lg hover:bg-blue-600 transition duration-300">Login</Link>
          <Link to="/register" className="px-6 py-3 bg-green-500 text-white rounded-md text-lg hover:bg-green-600 transition duration-300">Register</Link>
        </div>
      )}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default App;