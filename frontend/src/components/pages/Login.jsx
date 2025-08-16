import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo main 1.png'; 
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../ui/LanguageSwitcher';

const Login = () => {
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', {
        credential,
        password,
      });
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || t('An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const credential = window.prompt(t('Please enter your email or phone number.'));
    if (!credential) return;

    const securityAnswer = window.prompt(t('What is your favourite character?'));
    if (!securityAnswer) return;

    try {
      const response = await axios.post('http://localhost:5001/api/auth/forgot-password', {
        credential,
        securityAnswer,
      });

      navigate('/reset-password', { state: { token: response.data.token } });

    } catch (err) {
      setError(err.response?.data?.message || t('An error occurred'));
    }
  };

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(96.05deg, #FF0000 14.49%, #FF2000 24.47%, #FF4000 34.45%, #FF6000 44.43%, #FF7000 49.41%, #FF8000 54.4%, #E68626 64.38%, #D98939 69.37%, #D28859 71.87%, #CC8D4D 74.36%, #D28859 76.86%, #D4875D 77.48%, #D68660 78.11%, #D98466 79.35%, #DC816D 80.6%, #DF7F73 81.85%, #E67B80 84.34%, #EC768D 86.84%, #F2729A 89.33%, #F96DA7 90.63%, #FF69B4 91.93%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start', 
      paddingTop: '50px', 
    }}>
      <div style={{ position: 'absolute', top: '20px', right: '20px' }}> {/* LanguageSwitcher container */}
        <LanguageSwitcher />
      </div>
      {/* Rectangle 2 - Login Card */}
      <div style={{
        position: 'relative', 
        width: '400px',
        height: '500px',
        background: 'rgba(245, 245, 245, 0.5)',
        border: '2px solid #FFFFFF',
        borderRadius: '39px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        boxSizing: 'border-box',
      }}>
        {/* Logo */}
        <img src={logo} alt="MetroHub Logo" style={{
          width: '135px',
          height: '87px',
          marginTop: '31px',
        }} />

        {/* Log In to Metro Hub */}
        <h2 style={{
          fontFamily: 'Roboto',
          fontStyle: 'normal',
          fontWeight: '700',
          fontSize: '24px',
          lineHeight: '28px',
          textAlign: 'center',
          color: '#000000',
          marginTop: '10px', 
        }}>{t('Log In to Metro Hub')}</h2>

        {/* Email or Phone Number Input */}
        <input
          type="text"
          placeholder={t('Email or Phone Number')}
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          style={{
            boxSizing: 'border-box',
            width: '320px',
            height: '50px',
            background: 'rgba(255, 255, 255, 0.4)',
            border: '1px solid #FFFFFF',
            borderRadius: '15px',
            paddingLeft: '20px',
            fontFamily: 'Roboto',
            fontStyle: 'bold',
            fontWeight: '300',
            fontSize: '16px',
            lineHeight: '19px',
            color: '#1E1E1E', 
            marginTop: '40px', 
          }}
        />

        {/* Password Input */}
        <input
          type={showPassword ? "text" : "password"}
          placeholder={t('Password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            boxSizing: 'border-box',
            width: '320px',
            height: '50px',
            background: 'rgba(255, 255, 255, 0.4)',
            border: '1px solid #FFFFFF',
            borderRadius: '15px',
            paddingLeft: '20px',
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: '300',
            fontSize: '16px',
            lineHeight: '19px',
            color: '#1E1E1E', 
            marginTop: '16px', 
          }}
        />

        {/* Show Password Checkbox */}
        <div style={{
          display: 'flex',
          alignSelf: 'flex-start',
          marginLeft: '40px',
          marginTop: '10px',
        }}>
          <input type="checkbox" id="showPassword" style={{ marginRight: '8px', transform: 'scale(1.2)' }} onChange={() => setShowPassword(!showPassword)} />
          <label htmlFor="showPassword" style={{ color: '#1E1E1E', fontFamily: 'Roboto', fontSize: '16px' }}>{t('Show Password')}</label>
        </div>

        {/* Log In Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            position: 'relative',
            width: '150px',
            height: '50px',
            background: isHovered ? '#024C29': '#036638' , // Hover effect
            borderRadius: '25px',
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: '600',
            fontSize: '22px',
            lineHeight: '26px',
            color: '#FFFFFF',
            marginTop: '30px', 
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.3s ease',
          }}
        >
          {loading ? t('Logging in...') : t('Log In')}
        </button>

        {/* Register Link */}
        <p style={{ marginTop: '20px', fontFamily: 'Roboto', fontSize: '14px', color: '#1E1E1E' }}>
          {t('Don\'t have an account?')} <Link to="/register" style={{ color: '#007bff', textDecoration: 'underline' }}>{t('Register now')}</Link>
        </p>

        <p style={{ marginTop: '10px', fontFamily: 'Roboto', fontSize: '14px', color: '#1E1E1E' }}>
          <a href="#" onClick={handleForgotPassword} style={{ color: '#007bff', textDecoration: 'underline' }}>{t('Forgot Password?')}</a>
        </p>

        {error && <p style={{ color: 'red', marginTop: '10px' }}>{t(error)}</p>}
      </div>
      <style>
        {`
          input::placeholder {
            color: #1E1E1E !important;
          }
        `}
      </style>
    </div>
  );
};

export default Login;
