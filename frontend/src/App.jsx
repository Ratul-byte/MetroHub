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
import SearchSchedules from './components/pages/SearchSchedules';
import LanguageSwitcher from './components/ui/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

import ResetPassword from './components/pages/ResetPassword';

const Button = ({ className, variant, size, asChild = false, ...props }) => {
  const Comp = asChild ? 'div' : 'button';
  return <Comp className={`${variant} ${size} ${className}`} {...props} />;
};

const Header = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
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
            <Link to="/search-schedules" className="text-foreground hover:text-primary transition-colors">
              {t('schedules')}
            </Link>
            <a href="#booking" className="text-foreground hover:text-primary transition-colors">
              {t('book_tickets')}
            </a>
            <a href="#map" className="text-foreground hover:text-primary transition-colors">
              {t('find_stations')}
            </a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors">
              {t('about')}
            </a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
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
  const { t } = useTranslation();
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
              <li><a href="#" className="hover:text-foreground transition-colors">{t('real_time_schedules')}</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">{t('ticket_booking')}</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">{t('station_finder')}</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">{t('route_planning')}</a></li>
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



const App = () => {
  const { user } = useAuth();
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
            <Route
              path="/"
              element={
                user && user.role === 'admin' ? (
                  <AdminDashboard />
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
            <Route path="/welcome" element={<LandingPage />} />
            <Route path="/admin" element={<AdminRoute />}>
              <Route path="" element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
            </Route>
            <Route path="/search-schedules" element={<SearchSchedules />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;