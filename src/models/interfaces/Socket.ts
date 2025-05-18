// src/models/interfaces/Socket.ts
import { DefaultEventsMap, Socket as SocketIO } from "socket.io";
import { Server } from "socket.io";

// import { IUser } from "./User";

// Extiende el objeto Socket para incluir datos de usuario
export interface CustomSocket
  extends SocketIO<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> {
  user?: {
    id: string;
    role: string;
    username?: string;
  };
  // userData?: IUser;
}

// Extiende el objeto Server para agregar métodos personalizados si es necesario
export interface CustomServer
  extends Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> {
  // Puedes agregar métodos o propiedades adicionales aquí
}

// Interfaz para datos de asistencia
export interface IAsistenciaData {
  estudianteId: string;
  estado: "A" | "T" | "F" | "-" | "!" | "E"; // Códigos de asistencia
  aula?: string;
  fecha?: Date;
}

// Interfaz para solicitudes de asistencia por aula
export interface IAulaAsistenciaQuery {
  aula: string;
  fecha?: string | Date;
}

// Interfaz para justificación de inasistencia
export interface IJustificacionData {
  asistenciaId: string;
  motivo: string;
  descripcion?: string;
  evidenciaUrl?: string;
}

// Interfaz para datos de notificación
export interface INotificationData {
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
  targetUser?: string;
  targetRole?: string;
}
