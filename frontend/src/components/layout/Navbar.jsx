import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from "../ui/LanguageSwitcher";
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleBookTickets = () => {
    if (!user) {
      navigate('/login'); // Redirect to sign-in page if no user
    } else {
      navigate('/book-tickets'); // Assuming a book-tickets page exists
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800">
          {t('MetroHub')}
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-gray-600 hover:text-blue-600">
            {t('Home')}
          </Link>
          <div className="relative group">
            <button className="text-gray-600 hover:text-blue-600 focus:outline-none">
              {t('Services')}
            </button>
            <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-md py-2 w-48 z-10">
              <Link to="/schedules" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
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
          <Link to="/about" className="text-gray-600 hover:text-blue-600">
            {t('About')}
          </Link>
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-gray-600 hover:text-blue-600">
                  {t('Admin Dashboard')}
                </Link>
              )}
              <Link to="/profile" className="text-gray-600 hover:text-blue-600">
                {t('View Profile')}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                {t('Logout')}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600">
                {t('Login')}
              </Link>
              <Link to="/register" className="text-gray-600 hover:text-blue-600">
                {t('Register')}
              </Link>
            </>
          )}
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
