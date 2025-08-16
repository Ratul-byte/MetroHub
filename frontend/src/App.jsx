import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Profile from './components/pages/Profile';
import Navbar from './components/layout/Navbar';
import { useAuth } from './context/AuthContext';
import logo from './assets/logo main 1.png';
import { Menu, Github, Twitter, Linkedin, Mail, Phone } from 'lucide-react';
import LandingPage from './components/pages/LandingPage';
import Map from './components/pages/Map';
import AdminDashboard from './components/pages/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import UserManagement from './components/pages/UserManagement';

import ResetPassword from './components/pages/ResetPassword';

const Button = ({ className, variant, size, asChild = false, ...props }) => {
  const Comp = asChild ? 'div' : 'button';
  return <Comp className={`${variant} ${size} ${className}`} {...props} />;
};

const Header = () => {
  const { user, logout } = useAuth();
  return (
    <header className="w-full bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Link to="/">
              <img src={logo} alt="MetroHub Logo" className="h-12 w-auto" />
            </Link>
            <span className="text-2xl font-semibold text-foreground">MetroHub</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#schedules" className="text-foreground hover:text-primary transition-colors">
              Schedules
            </a>
            <a href="#booking" className="text-foreground hover:text-primary transition-colors">
              Book Tickets
            </a>
            <a href="#map" className="text-foreground hover:text-primary transition-colors">
              Find Stations
            </a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors">
              About
            </a>
          </nav>
          
          <div className="flex items-center space-x-4">
            {!user ? (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="hidden md:flex hover:bg-black hover:text-white rounded-md transition-all duration-300 ease-in-out px-4 py-2">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="hover:bg-black hover:text-white rounded-md transition-all duration-300 ease-in-out px-4 py-2">
                    Register
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <span className="text-foreground text-lg font-semibold mr-4">
                  {user.role === 'admin' ? 'Welcome Admin' : `Welcome, ${user.name}`}
                </span>
                <Button onClick={logout} variant="ghost" className="hover:bg-red-700 hover:text-white rounded-md transition-all duration-300 ease-in-out px-4 py-2">
                  Sign Out
                </Button>
                {user.role !== 'admin' && (
                  <Link to="/profile">
                    <Button className="hover:bg-black hover:text-white rounded-md transition-all duration-300 ease-in-out px-4 py-2">
                      Update My Profile
                    </Button>
                  </Link>
                )}
              </>
            )}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img src={logo} alt="MetroHub Logo" className="h-8 w-auto" />
              <span className="text-lg font-semibold">MetroHub</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Making metro travel easier and more efficient for everyone, one journey at a time.
            </p>
            <div className="flex space-x-4">
              <a href="#"><Github className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" /></a>
              <a href="#"><Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" /></a>
              <a href="#"><Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" /></a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Real-time Schedules</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Ticket Booking</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Station Finder</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Route Planning</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                support@metrohub.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                1-800-METRO-HUB
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 MetroHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

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
        {/* <Navbar /> */}
        <Header />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<Home />} />
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
        <Footer />
      </div>
    </Router>
  );
};

export default App;