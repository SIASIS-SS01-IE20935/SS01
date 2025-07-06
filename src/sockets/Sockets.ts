// src/server/Sockets.ts (SS01 - Servidor)
import { Server, Socket } from "socket.io";
import socketAuth, { getAuthenticatedUser } from "../middlewares/socketAuth";

import importarEventosSocketTomaAsistenciaPersonal from "./events/AsistenciaDePersonal";
import { SalasPorRol } from "../assets/RolesTextos";
import { RolesSistema } from "../interfaces/shared/RolesSistema";

export default class Sockets {
  public io: Server;

  constructor(io: Server) {
    this.io = io;
    this.configurarMiddlewares();
    this.socketEvents();
  }

  private configurarMiddlewares(): void {
    // Aplicar middleware de autenticación a todas las conexiones
    this.io.use(socketAuth);
  }

  private socketEvents(): void {
    this.io.on("connection", (socket: Socket) => {
      const user = getAuthenticatedUser(socket);

      console.log(`🔗 [SS01] Cliente conectado: ${socket.id}`);
      console.log(
        `👤 [SS01] Usuario: ${user?.Nombre_Usuario || "Unknown"} (${
          user?.Rol || "Unknown"
        })`
      );

      // const SALA_POR_ROL =
      //   SalasPorRol[
      //     user!.Rol as
      //       | RolesSistema.Auxiliar
      //       | RolesSistema.Directivo
      //       | RolesSistema.ProfesorPrimaria
      //   ];

      // Unir al usuario a una sala basada en su rol
      // if (user?.Rol) {
      //   socket.join(SALA_POR_ROL);
      //   console.log(
      //     `🏠 [SS01] Usuario ${user.Nombre_Usuario} unido a sala: ${SALA_POR_ROL}`
      //   );
      // }

      // Eventos específicos de asistencia
      importarEventosSocketTomaAsistenciaPersonal(
        this.io,
        socket,
        this.emitError
      );

      // Evento de desconexión
      socket.on("disconnect", (reason) => {
        console.log(
          `🔌 [SS01] Cliente desconectado: ${socket.id} - Razón: ${reason}`
        );
        if (user?.Nombre_Usuario) {
          console.log(`👤 [SS01] Usuario desconectado: ${user.Nombre_Usuario}`);
        }
      });

      // Evento para verificar estado de autenticación
      // socket.on("VERIFICAR_AUTH", (callback) => {
      //   const user = getAuthenticatedUser(socket);
      //   const isValid = isTokenStillValid(socket);

      //   if (callback && typeof callback === 'function') {
      //     callback({
      //       authenticated: !!user,
      //       tokenValid: isValid,
      //       user: user ? {
      //         username: user.username,
      //         role: user.role,
      //         authenticatedAt: user.authenticatedAt
      //       } : null
      //     });
      //   }
      // });
    });
  }

  private emitError(socket: Socket, code: string, message: string): void {
    socket.emit("ERROR", {
      code,
      message,
      timestamp: new Date().toISOString(),
    });

    console.error(
      `❌ [SS01] Error enviado a ${socket.id}: ${code} - ${message}`
    );
  }
}
