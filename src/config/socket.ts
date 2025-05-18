// src/config/socket.ts
import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import socketAuth from '../middlewares/socketAuth';
import registerAsistenciaEvents from '../socket/events/asistenciaEvents';

/**
 * Configura el servidor de Socket.IO
 * @param server Servidor HTTP
 */
const configureSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: '*', // En producción, limitar a dominios específicos
      methods: ['GET', 'POST']
    }
  });

  // Aplicar middleware de autenticación
  // io.use(socketAuth);

  // Manejo de conexiones de socket
  io.on('connection', (socket) => {
    console.log(`Nueva conexión establecida: ${socket.id}`);
    
    // Obtener información del usuario
    // const { id, username, role } = socket.data.user;
    
    // Unir al usuario a una sala según su rol
    // if (role) {
    //   socket.join(role);
    //   console.log(`Usuario ${username} unido a sala: ${role}`);
    // }
    
    // Registrar eventos específicos
    // registerAsistenciaEvents(io, socket);
    
    // Evento para enviar mensaje a todos los usuarios
    // socket.on('BROADCAST-MESSAGE', (message) => {
    //   io.emit('MESSAGE', {
    //     from: username,
    //     message,
    //     timestamp: new Date()
    //   });
    // });
    
    // Evento para enviar mensaje a un rol específico
    // socket.on('ROLE-MESSAGE', (role, message) => {
    //   io.to(role).emit('MESSAGE', {
    //     from: username,
    //     message,
    //     forRole: role,
    //     timestamp: new Date()
    //   });
    // });
    
    // Manejo de desconexión
    socket.on('disconnect', () => {
      console.log(`Conexión terminada: ${socket.id}`);
    });
  });

  return io;
};

export default configureSocket;