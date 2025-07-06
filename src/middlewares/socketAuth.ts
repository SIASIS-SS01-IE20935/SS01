// src/middlewares/socketAuth.ts (SS01 - Servidor)
import { Socket } from "socket.io";
import { ExtendedError } from "socket.io";
import jwt from "jsonwebtoken";
import { Entorno } from "../interfaces/shared/Entornos";
import { RolesSistema } from "../interfaces/shared/RolesSistema";
import { JWTPayload } from "../interfaces/shared/JWTPayload";
import { getJwtKeyForRole } from "../lib/utils/env/getJWTKeyForRole";
import { SocketUserData } from "../interfaces/UserData";
import {
  PermissionErrorTypes,
  SystemErrorTypes,
  TokenErrorTypes,
} from "../interfaces/shared/apis/errors";

const ENTORNO = process.env.ENTORNO as Entorno;

// Roles permitidos para acceder a Socket.IO
const ALLOWED_ROLES: RolesSistema[] = [
  RolesSistema.Directivo,
  RolesSistema.Auxiliar,
  RolesSistema.ProfesorPrimaria,
  RolesSistema.ProfesorSecundaria,
  RolesSistema.PersonalAdministrativo,
  RolesSistema.Tutor,
  //SOLO RESPONSABLES NO TENDRAN ACCESO A OPERACIONES EN IEMPO REAL
];

/**
 * Middleware de autenticación para Socket.IO del servidor SS01
 * Se ejecuta solo al momento de la conexión inicial
 * Solo permite acceso a Directivos, Auxiliares y Profesores de Primaria
 */
const socketAuth = (socket: Socket, next: (err?: ExtendedError) => void) => {
  console.log(`🔐 [SS01] Verificando autenticación para socket: ${socket.id}`);
  console.log(`🔍 [SS01] Entorno actual: ${ENTORNO}`);

  try {
    // Solo en entornos que NO sean LOCAL, verificar autenticación
    console.log(`🔐 [SS01] Entorno ${ENTORNO} - Verificando autenticación`);

    // Obtener token del handshake
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.replace("Bearer ", "") ||
      socket.handshake.query?.token;

    console.log(
      `🔍 [SS01] Token recibido para socket ${socket.id}:`,
      token ? "Token presente" : "Token ausente"
    );

    // Verificar que exista el token
    if (!token) {
      console.error(
        `❌ [SS01] Token no proporcionado para socket: ${socket.id} en entorno ${ENTORNO}`
      );
      const error = new Error(TokenErrorTypes.TOKEN_MISSING);
      error.message = "Token de autenticación requerido";
      return next(error);
    }

    // Primero, decodificar el token SIN verificar la firma para obtener el rol
    let preliminaryDecoded: JWTPayload;
    try {
      preliminaryDecoded = jwt.decode(token) as JWTPayload;
    } catch (error) {
      console.error(
        `❌ [SS01] Error al decodificar token preliminarmente para socket: ${socket.id}`,
        error
      );
      const authError = new Error(TokenErrorTypes.TOKEN_MALFORMED);
      authError.message = "Token con formato inválido";
      return next(authError);
    }

    // Verificar que el token tenga la estructura básica esperada
    if (!preliminaryDecoded || !preliminaryDecoded.Rol) {
      console.error(
        `❌ [SS01] Token sin estructura válida para socket: ${socket.id}`
      );
      const structError = new Error(TokenErrorTypes.TOKEN_MALFORMED);
      structError.message = "Token sin estructura válida";
      return next(structError);
    }

    const rol = preliminaryDecoded.Rol;

    // Verificar que el rol esté permitido
    if (!ALLOWED_ROLES.includes(rol)) {
      console.error(
        `❌ [SS01] Rol ${rol} no autorizado para socket: ${socket.id}`
      );
      const roleError = new Error(PermissionErrorTypes.INSUFFICIENT_PERMISSIONS);
      roleError.message = `Rol ${rol} no autorizado para este servicio`;
      return next(roleError);
    }

    // Seleccionar la clave JWT correcta según el rol extraído del token
    const jwtKey = getJwtKeyForRole(rol);
    if (!jwtKey) {
      console.error(
        `❌ [SS01] Configuración de seguridad inválida para rol ${rol} - socket: ${socket.id}`
      );
      const configError = new Error(SystemErrorTypes.UNKNOWN_ERROR);
      configError.message = "Configuración de seguridad inválida";
      return next(configError);
    }

    // Ahora sí, decodificar y verificar el token JWT con la clave correcta
    let decodedToken: JWTPayload;
    try {
      decodedToken = jwt.verify(token, jwtKey) as JWTPayload;
    } catch (jwtError) {
      console.error(
        `❌ [SS01] Error al verificar token para socket: ${socket.id}`,
        jwtError
      );

      let error: Error;
      if (jwtError instanceof jwt.TokenExpiredError) {
        error = new Error(TokenErrorTypes.TOKEN_EXPIRED);
        error.message = "Token de autenticación expirado";
      } else if (jwtError instanceof jwt.JsonWebTokenError) {
        error = new Error(TokenErrorTypes.TOKEN_INVALID_SIGNATURE);
        error.message = "Token de autenticación inválido";
      } else {
        error = new Error(TokenErrorTypes.TOKEN_UNAUTHORIZED);
        error.message = "Error al verificar token de autenticación";
      }
      return next(error);
    }

    // Verificar tiempo de expiración explícitamente
    const now = Math.floor(Date.now() / 1000);
    if (decodedToken.exp && decodedToken.exp < now) {
      console.error(
        `❌ [SS01] Token expirado para socket: ${socket.id} - Exp: ${decodedToken.exp}, Now: ${now}`
      );
      const expError = new Error(TokenErrorTypes.TOKEN_EXPIRED);
      expError.message = "Token de autenticación expirado";
      return next(expError);
    }

    // Verificar campos obligatorios del token
    if (
      !decodedToken.ID_Usuario ||
      !decodedToken.Nombre_Usuario ||
      !decodedToken.Rol
    ) {
      console.error(
        `❌ [SS01] Token con estructura inválida para socket: ${socket.id}`
      );
      const structError = new Error(TokenErrorTypes.TOKEN_MALFORMED);
      structError.message = "Token con datos incompletos";
      return next(structError);
    }

    // Doble verificación: el rol del token debe coincidir con el rol usado para la verificación
    if (decodedToken.Rol !== rol) {
      console.error(
        `❌ [SS01] Inconsistencia en rol del token para socket: ${socket.id}`
      );
      const roleError = new Error(TokenErrorTypes.TOKEN_WRONG_ROLE);
      roleError.message = "Inconsistencia en datos de autenticación";
      return next(roleError);
    }

    // Guardar datos del usuario autenticado en el socket
    socket.data.user = {
      ID_Usuario: decodedToken.ID_Usuario,
      Nombre_Usuario: decodedToken.Nombre_Usuario,
      Rol: decodedToken.Rol,
      rdp02Instance: decodedToken.RDP02_INSTANCE,
      rdp03Instance: decodedToken.RDP03_INSTANCE,
      authenticatedAt: new Date(),
      tokenExp: decodedToken.exp,
    } as SocketUserData;

    console.log(
      `✅ [SS01] Usuario autenticado: ${decodedToken.Nombre_Usuario} (${decodedToken.Rol}) - Socket: ${socket.id}`
    );
    return next();
  } catch (error) {
    console.error(
      `❌ [SS01] Error general en autenticación para socket: ${socket.id}`,
      error
    );
    const systemError = new Error(SystemErrorTypes.UNKNOWN_ERROR);
    systemError.message = "Error interno del servidor de autenticación";
    return next(systemError);
  }
};

/**
 * Helper para obtener datos del usuario autenticado desde un socket
 */
export const getAuthenticatedUser = (socket: Socket): SocketUserData | null => {
  return (socket.data.user as SocketUserData) || null;
};

/**
 * Helper para verificar si el usuario tiene un rol específico
 */
export const hasRole = (
  socket: Socket,
  requiredRole: RolesSistema
): boolean => {
  const user = getAuthenticatedUser(socket);
  return user?.Rol === requiredRole;
};

/**
 * Helper para verificar si el usuario tiene alguno de los roles permitidos
 */
export const hasAnyRole = (
  socket: Socket,
  allowedRoles: RolesSistema[]
): boolean => {
  const user = getAuthenticatedUser(socket);
  return user ? allowedRoles.includes(user.Rol) : false;
};

/**
 * Helper para verificar si el token del usuario sigue siendo válido
 */
export const isTokenStillValid = (socket: Socket): boolean => {
  const user = getAuthenticatedUser(socket);

  if (!user?.tokenExp) return false;

  const now = Math.floor(Date.now() / 1000);
  return user.tokenExp > now;
};

export default socketAuth;
