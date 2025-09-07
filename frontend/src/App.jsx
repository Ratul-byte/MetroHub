import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate, Outlet } from 'react-router-dom';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Profile from './components/pages/Profile';
import Navbar from './components/layout/Navbar';
import { useAuth } from './context/AuthContext';
import logo from './assets/logo main 1.png';
import { Menu, Github, Twitter, Linkedin, Mail, Phone } from 'lucide-react';
import LandingPage from './components/pages/LandingPage';
import UserDashboard from './components/pages/UserDashboard';
import Map from './components/pages/Map';
import AdminDashboard from './components/pages/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import UserManagement from './components/pages/UserManagement';
import SearchSchedules from './components/pages/SearchSchedules';
import LanguageSwitcher from './components/ui/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import ScrollToTop from './components/ui/ScrollToTop';

import ResetPassword from './components/pages/ResetPassword';
import BookTicket from './components/pages/BookTicket'; // Import the new component
import PaymentSuccess from './components/pages/PaymentSuccess';
import BookingHistory from './components/pages/BookingHistory';
import {Extras} from './components/pages/Extras';
import {AboutUs} from './components/pages/AboutUs';

const Button = ({ className, variant, size, asChild = false, ...props }) => {
  const Comp = asChild ? 'div' : 'button';
  return <Comp className={`${variant} ${size} ${className}`} {...props} />;
};

const Header = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBookTickets = () => {
    if (!user) {
      navigate('/login'); // Redirect to sign-in page if no user
    } else {
      navigate('/book-tickets'); // Assuming a book-tickets page exists
    }
  };

  return (
    <header className="w-full bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Link to="/">
              <img src={logo} alt="MetroHub Logo" className="h-12 w-auto" />
            </Link>
            <span className="text-2xl font-semibold text-foreground">{t('MetroHub')}</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors hover:bg-black hover:text-white rounded-md transition-all duration-300 ease-in-out px-4 py-2">
              {t('Home')}
            </Link>
            <div className="relative group">
              <button className="text-foreground hover:text-primary transition-colors focus:outline-none hover:bg-black hover:text-white rounded-md transition-all duration-300 ease-in-out px-4 py-2">
                {t('services')}
              </button>
              <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-md py-2 w-48 z-10">
                <Link to="/search-schedules" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  {t('View Schedules')}
                </Link>
                <Link to="/map" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  {t('Find Station')}
                </Link>
                <button onClick={handleBookTickets} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">
                  {t('Book Tickets')}
                </button>
              </div>
            </div>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors hover:bg-black hover:text-white rounded-md transition-all duration-300 ease-in-out px-4 py-2">
              {t('About')}
            </Link>
            {user && user.role !== 'admin' && ( // Conditionally render View Profile
              <Link to="/profile" className="text-foreground hover:text-primary transition-colors hover:bg-black hover:text-white rounded-md transition-all duration-300 ease-in-out px-4 py-2">
                {t('View Profile')}
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <div className="mr-2"> {/* Added wrapper div with right margin */}
              <LanguageSwitcher />
            </div>
            {!user ? (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="hidden md:flex hover:bg-black hover:text-white rounded-md transition-all duration-300 ease-in-out px-4 py-2">
                    {t('Sign In')}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="hover:bg-black hover:text-white rounded-md transition-all duration-300 ease-in-out px-4 py-2">
                    {t('Register')}
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <span className="text-foreground text-lg font-semibold mr-4">
                  {user.role === 'admin' ? t('Welcome Admin') : t('Welcome, {{userName}}', { userName: user.name })}
                </span>
                <Button onClick={logout} variant="ghost" className="hover:bg-red-700 hover:text-white rounded-md transition-all duration-300 ease-in-out px-4 py-2">
                  {t('Sign Out')}
                </Button>
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
  const { t } = useTranslation();
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Link to="/extras">
                <img src={logo} alt="MetroHub Logo" className="h-8 w-auto" />
              </Link>
              <span className="text-lg font-semibold">MetroHub</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              {t('footer_tagline')}
            </p>
            <div className="flex space-x-4">
              <a href="#"><Github className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" /></a>
              <a href="#"><Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" /></a>
              <a href="#"><Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" /></a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">{t('services')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/search-schedules" className="hover:text-foreground transition-colors">{t('real_time_schedules')}</Link></li>
              <li><Link to="/book-tickets" className="hover:text-foreground transition-colors">{t('ticket_booking')}</Link></li> {/* Assuming /book-tickets exists, or will redirect to login */}
              <li><Link to="/map" className="hover:text-foreground transition-colors">{t('station_finder')}</Link></li>
              <li><Link to="/map" className="hover:text-foreground transition-colors">{t('route_planning')}</Link></li> {/* Linking to map as a fallback */}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">{t('support')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">{t('help_center')}</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">{t('contact_us')}</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">{t('faq')}</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">{t('privacy_policy')}</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">{t('contact')}</h3>
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
          <p>{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

const PrivateRoute = () => {
    const { user } = useAuth();
    return user ? <Outlet /> : <Navigate to="/login" />;
  };

const App = () => {
  const { user } = useAuth();
  const isAdmin = user && user.role === 'admin';

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
        {!isAdmin && <Header />}
        <div className="flex-grow">
          <ScrollToTop />
          <Routes>
            <Route
              path="/"
              element={
                isAdmin ? (
                  <AdminDashboard />
                ) : user ? (
                  <UserDashboard />
                ) : (
                  <LandingPage />
                )
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/map" element={<Map />} />
            <Route path="/admin" element={<AdminRoute />}>
              <Route path="" element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
            </Route>
            <Route path="/dashboard" element={<PrivateRoute />}>
                <Route path="" element={<UserDashboard />} />
            </Route>
            <Route path="/search-schedules" element={<SearchSchedules />} />
            <Route path="/book-tickets" element={<BookTicket />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/booking-history" element={<BookingHistory />} />
            <Route path="/extras" element={<Extras />} />
            <Route path="/about" element={<AboutUs />} />
          </Routes>
        </div>
        {!isAdmin && <Footer />}
      </div>
    </Router>
  );
};

export default App;
