


// // Roles disponibles en el sistema
// export type UserRole = 
//   | 'directivo'
//   | 'auxiliar'
//   | 'profesor-primaria'
//   | 'profesor-secundaria'
//   | 'tutor-secundaria'
//   | 'responsable'
//   | 'personal-limpieza';

// // Interfaz base para usuario
// export interface IUser {
//   _id?: string | Types.ObjectId;
//   username: string;
//   nombre: string;
//   apellidos: string;
//   dni: string;
//   role: UserRole;
//   email?: string;
//   celular?: string;
//   socketConectionID?: string;
//   estado?: 'activo' | 'inactivo' | 'ausente';
//   foto?: string;
//   disconectionsAmount?: number;
//   activeChatWith?: string;
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// // Interfaz para documento de usuario de Mongoose
// export interface IUserDocument extends IUser, Document {
//   // Métodos adicionales si son necesarios
// }

// // Interfaz específica para Estudiante
// export interface IEstudiante extends IUser {
//   nivel: 'primaria' | 'secundaria';
//   grado: string;
//   seccion: string;
//   responsableId?: string | Types.ObjectId;
// }

// // Interfaz específica para Responsable
// export interface IResponsable extends IUser {
//   estudiantesACargo: Array<string | Types.ObjectId>;
//   relacion: Record<string, 'hijo' | 'a-cargo'>;
// }

// // Interfaz específica para Profesor
// export interface IProfesor extends IUser {
//   aulaAsignada?: {
//     nivel: 'primaria' | 'secundaria';
//     grado: string;
//     seccion: string;
//   };
// }