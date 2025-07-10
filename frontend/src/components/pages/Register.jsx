import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


const Register = () => {
  const [name, setName] = useState('');
  const [credential, setCredential] = useState(''); // This will hold either email or phone number
  const [password, setPassword] = useState('');
  const [useEmail, setUseEmail] = useState(true); // true for email, false for phone number
  const [isRapidPassUser, setIsRapidPassUser] = useState(false);
  const [rapidPassId, setRapidPassId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        name,
        password,
        role: isRapidPassUser ? 'rapidPassUser' : 'normal',
      };

      if (useEmail) {
        payload.email = credential;
      } else {
        payload.phoneNumber = credential;
      }

      if (isRapidPassUser) {
        payload.rapidPassId = rapidPassId;
      }

      const response = await axios.post('http://localhost:5001/api/auth/register', payload);

      login(response.data.user, response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Register</h2>
        {error && <p className="text-red-500">{error}</p>}
        <Input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        {useEmail ? (
          <Input type="email" placeholder="Email" value={credential} onChange={(e) => setCredential(e.target.value)} />
        ) : (
          <Input type="text" placeholder="Phone Number" value={credential} onChange={(e) => setCredential(e.target.value)} />
        )}
        <Button onClick={() => setUseEmail(!useEmail)} className="bg-blue-500 hover:bg-blue-600">
          {useEmail ? 'Use Phone Number Instead' : 'Use Email Instead'}
        </Button>
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="rapidPassCheckbox"
            checked={isRapidPassUser}
            onChange={(e) => setIsRapidPassUser(e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <label htmlFor="rapidPassCheckbox" className="text-gray-700">I am a Rapid Pass User</label>
        </div>
        {isRapidPassUser && (
          <Input
            type="text"
            placeholder="Rapid Pass ID"
            value={rapidPassId}
            onChange={(e) => setRapidPassId(e.target.value)}
          />
        )}
        <Button onClick={handleRegister} disabled={loading} className="bg-green-500 hover:bg-green-600">
          {loading ? 'Registering...' : 'Register'}
        </Button>
      </div>
    </div>
  );
};

export default Register;
