import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

const auth = (request, response, next) => {
  try {
    const token = request.header('x-auth-token');

    if (!token) {
      return response.status(401).json({ message: 'No authentication token, authorization denied.' });
    }

    const verified = jwt.verify(token, JWT_SECRET);
    if (!verified) {
      return response.status(401).json({ message: 'Token verification failed, authorization denied.' });
    }

    request.user = verified.userId;
    request.role = verified.role;
    next();
  } catch (err) {
    response.status(500).json({ error: err.message });
  }
};

export default auth;
