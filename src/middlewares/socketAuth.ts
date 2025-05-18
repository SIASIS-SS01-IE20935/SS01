// src/middlewares/socketAuth.ts
import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'tu-secreto-aqui';

/**
 * Middleware de autenticación para Socket.IO
 */
const socketAuth = (socket: Socket, next: (err?: ExtendedError) => void) => {
  // Obtener token de los headers de la conexión
  const token = socket.handshake.auth.token || socket.handshake.headers.token;
  
  if (!token) {
    return next(new Error('Autenticación requerida'));
  }
  
  try {
    // Verificar token JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Guardar datos del usuario en el objeto socket
    socket.data.user = decoded;
    
    return next();
  } catch (error) {
    return next(new Error('Token no válido'));
  }
};

export default socketAuth;