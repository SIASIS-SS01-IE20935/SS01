// // src/socket/events/userEvents.ts
// import { CustomServer, CustomSocket } from '../../models/interfaces/Socket.ts';
// import userHandler from '../handlers/userHandler';

// /**
//  * Registra los eventos relacionados con usuarios
//  * @param io - Instancia del servidor Socket.IO
//  * @param socket - Socket de conexión del cliente
//  */
// function registerUserEvents(io: CustomServer, socket: CustomSocket): void {
//   // Evento para identificar al usuario
//   socket.on('MY-USERNAME', (username: string) => {
//     userHandler.identifyUser(io, socket, username);
//   });

//   // Evento para cambiar el estado del usuario
//   socket.on('CHANGE-STATE', (state: string) => {
//     userHandler.changeUserState(socket, state);
//   });

//   // Evento para eliminar usuario
//   socket.on('DELETE-USER-FROM-DATABASE', () => {
//     userHandler.deleteUser(io, socket);
//   });

//   // Evento para unirse a salas según el rol
//   socket.on('JOIN-ROLE-ROOM', () => {
//     if (socket.user?.role) {
//       socket.join(socket.user.role);
//       console.log(`Usuario ${socket.id} unido a sala: ${socket.user.role}`);
//     }
//   });

//   // Evento para obtener usuario aleatorio
//   socket.on('GET-ALEATORY-USER', (pendingRequestsIDs: string) => {
//     userHandler.getAleatoryUser(socket, pendingRequestsIDs);
//   });

//   // Evento para obtener usuario aleatorio magnético
//   socket.on('GET-ALEATORY-MAGNETIC-USER', () => {
//     userHandler.getAleatoryMagneticUser(io, socket);
//   });

//   // Evento para solicitar temchat con un usuario específico
//   socket.on('(SERVER)REQUEST-FOR-X-USER', (usernameOfUser: string, type: string, waitTime: number) => {
//     userHandler.requestForUser(io, socket, usernameOfUser, type, waitTime);
//   });

//   // Eventos adicionales según tus necesidades
//   socket.on('(SERVER)REQUEST-RECEIVED-WAS-RECEIVED', (username: string) => {
//     userHandler.requestReceivedWasReceived(socket, username);
//   });

//   socket.on('(SERVER)REQUEST-RECEIVED', (username: string) => {
//     userHandler.notifyRequestReceived(io, socket, username);
//   });

//   socket.on('(SERVER)CANCEL-REQUEST-FOR-X-USER', (username: string) => {
//     userHandler.cancelRequest(io, socket, username);
//   });
// }

// export default registerUserEvents;