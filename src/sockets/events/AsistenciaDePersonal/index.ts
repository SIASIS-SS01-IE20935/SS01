import { Server, Socket } from "socket.io";

import { SocketUserData } from "../../../interfaces/UserData";
import { TomaAsistenciaPersonalSS01Events } from "./backend/TomaAsistenciaPersonalSS01Events";

/**
 * Registra los eventos relacionados con la asistencia
 * @param io Servidor de Socket.IO
 * @param socket Socket del cliente
 */
const importarEventosSocketTomaAsistenciaPersonal = (
  io: Server,
  socket: Socket,
  emitError: (socket: Socket, code: string, message: string) => void
) => {
  // Obtener información del usuario
  const { Nombre_Usuario, Rol } = socket.data.user as SocketUserData;

  TomaAsistenciaPersonalSS01Events.socketConnection = socket;

  new TomaAsistenciaPersonalSS01Events.SALUDAME_SOCKET_HANDLER(() => {
    new TomaAsistenciaPersonalSS01Events.RESPUESTA_SALUDO_EMITTER({
      saludo: `Hola usuario ➡️ ${Nombre_Usuario} con ROL ${Rol}`,
    }).execute();
  }).hand();

  new TomaAsistenciaPersonalSS01Events.UNIRME_A_SALA_DE_TOMA_DE_ASISTENCIA_DE_PERSONAL_HANDLER(
    ({ Sala_Toma_Asistencia_de_Personal }) => {
      // Antes salir de todas las salas
      // socket.rooms.forEach((sala) => {
      //   if (sala !== socket.id) {
      //     // No salir de tu sala personal
      //     socket.leave(sala);
      //     console.log(`${Nombre_Usuario} ha salido de la sala: ${sala}`);
      //   }
      // });

      // Unirse a la sala de toma de asistencia de personal
      socket.join(Sala_Toma_Asistencia_de_Personal);
      console.log(
        `${Nombre_Usuario} se ha unido a la sala: ${Sala_Toma_Asistencia_de_Personal}`
      );

      new TomaAsistenciaPersonalSS01Events.UNIDO_A_SALA_CORRECTAMENTE_EMITTER({
        message: `Usuario ➡️ ${Nombre_Usuario} con ROL ${Rol} se ha unido a la sala: ${Sala_Toma_Asistencia_de_Personal}`,
      }).execute();
    }
  ).hand();

  new TomaAsistenciaPersonalSS01Events.MARQUE_LA_ASISTENCIA_DE_ESTE_PERSONAL_HANDLER(
    ({
      id_o_dni,
      nombres,
      apellidos,
      RegistroEntradaSalida,
      Sala_Toma_Asistencia_de_Personal,
      modoRegistro,
      rol,
    }) => {
      console.log({
        id_o_dni,
        nombres,
        apellidos,
        RegistroEntradaSalida,
        Sala_Toma_Asistencia_de_Personal,
        modoRegistro,
        rol,
      });
      new TomaAsistenciaPersonalSS01Events.SE_ACABA_DE_MARCAR_LA_ASISTENCIA_DE_ESTE_PERSONAL_EMITTER(
        {
          id_o_dni,
          nombres,
          apellidos,
          modoRegistro,
          rol,
          RegistroEntradaSalida,
        },
        Sala_Toma_Asistencia_de_Personal
      ).execute();
    }
  ).hand();
};

export default importarEventosSocketTomaAsistenciaPersonal;
