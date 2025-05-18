// // src/socket/handlers/userHandler.ts
// import { Types } from 'mongoose';
// import { CustomServer, CustomSocket } from '../../models/interfaces/Socket';
// import { IUser } from '../../models/interfaces/User';
// import usersController from '../../controllers/usersController';
// import CustomEvent from '../../utils/CustomEvent';

// // Evento personalizado para gestionar solicitudes recibidas
// const REQUEST_RECEIVED_EVENT = new CustomEvent();

// // Tiempo de tolerancia en segundos para respuestas a solicitudes
// const SEGUNDOS_TOLERANCIA = 5.5;


// /**
//  * Manejador de eventos relacionados con usuarios
//  */
// const userHandler = {
//   /**
//    * Identifica al usuario por su nombre de usuario
//    * @param io - Instancia del servidor Socket.IO
//    * @param socket - Socket de conexión del cliente
//    * @param username - Nombre de usuario
//    */
//   async identifyUser(io: CustomServer, socket: CustomSocket, username: string): Promise<void> {
//     try {
//       const user = await usersController.getUserByUsername(username);
      
//       if (!user) {
//         return socket.emit('YOUR-USER-NO-LONGER-EXIST');
//       }
      
//       // Guardar datos del usuario en socket
//       socket.userData = user;
      
//       // Actualizar el socketId en la base de datos
//       await usersController.setSocketIdConnection(user._id, socket.id);
      
//       // Añadir el socket ID a los datos del usuario
//       user.socketConectionID = socket.id;
      
//       // Enviar datos al usuario
//       socket.emit('TAKE-YOUR-USER-DATA', JSON.stringify(user));
      
//       console.log(`${user.username} conectado`);
      
//       // Unir al usuario a la sala según su rol
//       if (user.role) {
//         socket.join(user.role);
//         console.log(`Usuario ${user.username} unido a sala: ${user.role}`);
//       }
//     } catch (error) {
//       console.error('Error al identificar usuario:', error);
//       socket.emit('ERROR', { message: 'Error al identificar usuario' });
//     }
//   },
  
//   /**
//    * Cambia el estado del usuario
//    * @param socket - Socket de conexión del cliente
//    * @param state - Nuevo estado
//    */
//   async changeUserState(socket: CustomSocket, state: string): Promise<void> {
//     try {
//       if (!socket.userData || !socket.userData._id) {
//         return;
//       }
      
//       await usersController.changeState(socket.userData._id, state);
//     } catch (error) {
//       console.error('Error al cambiar estado:', error);
//       socket.emit('ERROR', { message: 'Error al cambiar estado' });
//     }
//   },
  
//   /**
//    * Elimina al usuario de la base de datos
//    * @param io - Instancia del servidor Socket.IO
//    * @param socket - Socket de conexión del cliente
//    */
//   async deleteUser(io: CustomServer, socket: CustomSocket): Promise<void> {
//     try {
//       if (!socket.userData || !socket.userData._id) {
//         return;
//       }
      
//       await usersController.deleteTemporaryUser(socket.userData._id);
      
//       // Si el usuario estaba en chat con alguien, notificar fin de chat
//       if (socket.userData.activeChatWith) {
//         const otherUser = await usersController.getUserByUsername(socket.userData.activeChatWith);
        
//         if (otherUser && otherUser.socketConectionID) {
//           io.to(otherUser.socketConectionID).emit('TEMCHAT-FINISHED-FOR-YOU');
//         }
//       }
//     } catch (error) {
//       console.error('Error al eliminar usuario:', error);
//       socket.emit('ERROR', { message: 'Error al eliminar usuario' });
//     }
//   },
  
//   /**
//    * Obtiene un usuario aleatorio
//    * @param socket - Socket de conexión del cliente
//    * @param pendingRequestsIDs - IDs de solicitudes pendientes
//    */
//   async getAleatoryUser(socket: CustomSocket, pendingRequestsIDs: string): Promise<void> {
//     try {
//       if (!socket.userData || !socket.userData._id) {
//         return;
//       }
      
//       let pendingIDs = pendingRequestsIDs ? JSON.parse(pendingRequestsIDs) : [];
//       pendingIDs = pendingIDs.map((id: string) => new Types.ObjectId(id));
      
//       const aleatoryUser = await usersController.getAleatoryUser(
//         [socket.userData._id, ...pendingIDs]
//       );
      
//       socket.emit('TAKE-YOUR-ALEATORY-USER', JSON.stringify(aleatoryUser[0] || null));
//     } catch (error) {
//       console.error('Error al obtener usuario aleatorio:', error);
//       socket.emit('ERROR', { message: 'Error al obtener usuario aleatorio' });
//     }
//   },
  
//   /**
//    * Obtiene un usuario aleatorio "magnético" (autoconexión inmediata)
//    * @param io - Instancia del servidor Socket.IO 
//    * @param socket - Socket de conexión del cliente
//    */
//   async getAleatoryMagneticUser(io: CustomServer, socket: CustomSocket): Promise<void> {
//     try {
//       if (!socket.userData || !socket.userData._id) {
//         return;
//       }
      
//       const usuarioAleatorio = await usersController.getAleatoryUser(
//         [socket.userData._id], 
//         2 // Tipo específico de usuario aleatorio
//       );
      
//       socket.emit('TAKE-YOUR-MAGNETIC-USER', JSON.stringify(usuarioAleatorio[0] || null));
      
//       if (!usuarioAleatorio[0]) return;
      
//       if (usuarioAleatorio[0].socketConectionID) {
//         io.to(usuarioAleatorio[0].socketConectionID).emit(
//           'TEMCHAT-REQUEST-ACCEPTED-FOR-YOU',
//           JSON.stringify(usuarioAleatorio[0]),
//           JSON.stringify(socket.userData)
//         );
//       }
//     } catch (error) {
//       console.error('Error al obtener usuario magnético:', error);
//       socket.emit('ERROR', { message: 'Error al obtener usuario magnético' });
//     }
//   },
  
//   /**
//    * Solicita chat a un usuario específico
//    * @param io - Instancia del servidor Socket.IO
//    * @param socket - Socket de conexión del cliente
//    * @param usernameOfUser - Nombre de usuario del destinatario
//    * @param type - Tipo de solicitud
//    * @param waitTime - Tiempo de espera
//    */
//   async requestForUser(
//     io: CustomServer, 
//     socket: CustomSocket, 
//     usernameOfUser: string, 
//     type: string, 
//     waitTime: number
//   ): Promise<void> {
//     try {
//       if (!socket.userData) {
//         return socket.emit('ERROR', { message: 'Usuario no identificado' });
//       }
      
//       const userFound = await usersController.getUserByUsername(usernameOfUser);
      
//       if (!userFound) {
//         return socket.emit('USER-NO-LONGER-EXIST', usernameOfUser);
//       }
      
//       if (userFound.socketConectionID) {
//         io.to(userFound.socketConectionID).emit(
//           'TEMCHAT-REQUEST-FOR-YOU',
//           JSON.stringify(socket.userData),
//           type,
//           waitTime
//         );
//       }
      
//       // Promesa de recibimiento
//       const promiseOfReceipt = new Promise<void>((resolve, reject) => {
//         let eventID: string | undefined;
        
//         eventID = REQUEST_RECEIVED_EVENT.addEventListener((username: string) => {
//           if (userFound.username === username) {
//             resolve();
//             if (eventID) {
//               REQUEST_RECEIVED_EVENT.removeEventListener(eventID);
//             }
//           }
//         });
        
//         setTimeout(() => {
//           reject();
//           if (eventID) {
//             REQUEST_RECEIVED_EVENT.removeEventListener(eventID);
//           }
//         }, SEGUNDOS_TOLERANCIA * 1000);
//       });
      
//       promiseOfReceipt.catch(() => {
//         if (userFound._id && userFound.disconectionsAmount !== undefined) {
//           usersController.setDisconectionsAmount(
//             userFound._id, 
//             userFound.disconectionsAmount + 1
//           );
//         }
//       });
//     } catch (error) {
//       console.error('Error al solicitar usuario:', error);
//       socket.emit('ERROR', { message: 'Error al solicitar usuario' });
//     }
//   },
  
//   /**
//    * Registra que la solicitud recibida ha sido recibida
//    * @param socket - Socket de conexión del cliente
//    * @param username - Nombre de usuario
//    */
//   requestReceivedWasReceived(socket: CustomSocket, username: string): void {
//     REQUEST_RECEIVED_EVENT.dispatchEvent(username);
//   },
  
//   /**
//    * Notifica al usuario que se recibió su solicitud
//    * @param io - Instancia del servidor Socket.IO
//    * @param socket - Socket de conexión del cliente
//    * @param username - Nombre de usuario
//    */
//   async notifyRequestReceived(io: CustomServer, socket: CustomSocket, username: string): Promise<void> {
//     try {
//       if (!username || !socket.userData || !socket.userData.username) {
//         return;
//       }
      
//       const userFound = await usersController.getUserByUsername(username);
      
//       if (userFound && userFound.socketConectionID) {
//         io.to(userFound.socketConectionID).emit('REQUEST-RECEIVED', socket.userData.username);
//       }
//     } catch (error) {
//       console.error('Error al notificar solicitud recibida:', error);
//     }
//   },
  
//   /**
//    * Cancela una solicitud de chat
//    * @param io - Instancia del servidor Socket.IO
//    * @param socket - Socket de conexión del cliente
//    * @param username - Nombre de usuario
//    */
//   async cancelRequest(io: CustomServer, socket: CustomSocket, username: string): Promise<void> {
//     try {
//       if (!username || !socket.userData) {
//         return;
//       }
      
//       const userFound = await usersController.getUserByUsername(username);
      
//       if (!userFound) {
//         return console.log('Usuario no encontrado');
//       }
      
//       if (userFound.socketConectionID) {
//         io.to(userFound.socketConectionID).emit(
//           'CANCEL-REQUEST-FROM-X-USER', 
//           JSON.stringify(socket.userData)
//         );
//       }
//     } catch (error) {
//       console.error('Error al cancelar solicitud:', error);
//       socket.emit('ERROR', { message: 'Error al cancelar solicitud' });
//     }
//   }
// };

// export default userHandler;