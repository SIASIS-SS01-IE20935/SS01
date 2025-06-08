import { RolesSistema } from "./shared/RolesSistema";

export interface SocketUserData {
  /** ID único del usuario */
  ID_Usuario: string;
  /** Nombre de usuario */
  Nombre_Usuario: string;
  /** Rol del usuario en el sistema */
  Rol: RolesSistema;
  /** Instancia RDP02 asignada (opcional) */
  rdp02Instance?: string;
  /** Instancia RDP03 asignada (opcional) */
  rdp03Instance?: string;
  /** Fecha y hora de autenticación */
  authenticatedAt: Date;
  /** Timestamp de expiración del token */
  tokenExp?: number;
}
