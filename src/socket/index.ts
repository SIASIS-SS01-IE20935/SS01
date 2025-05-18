// // src/socket/index.ts
// import { Server as SocketServer } from 'socket.io';
// import { Server as HttpServer } from 'http';
// import socketAuth from '../middlewares/socketAuth';

// // Importar manejadores de eventos
// import registerUserEvents from './events/userEvents';
// import registerAsistenciaEvents from './events/asistenciaEvents';
// import registerChatEvents from './events/chatEvents';
// import { CustomSocket, CustomServer } from '../models/interfaces/Socket';

// /**
//  * Configuración principal de Socket.IO
//  * @param server - Servidor HTTP
//  * @returns Instancia configurada de Socket.IO
//  */
// function configureSocket(server: HttpServer): CustomServer {
//   const io: CustomServer = new SocketServer(server, {
//     cors: {
//       origin: '*', // En producción, limitar a dominios específicos
//       methods: ['GET', 'POST']
//     }
//   });

//   // Middleware de autenticación para socket
//   io.use(socketAuth);

//   // Manejo de conexiones
//   io.on('connection', (socket: CustomSocket) => {
//     console.log(`Nueva conexión establecida: ${socket.id}`);
    
//     // Registrar eventos por tipo
//     registerUserEvents(io, socket);
    
//     // Manejo de desconexión
//     socket.on('disconnect', () => {
//       console.log(`Conexión terminada: ${socket.id}`);
//     });
//   });

//   return io;
// }

// export default configureSocket;


