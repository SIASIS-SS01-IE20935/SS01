import { Server, Socket } from "socket.io";
import { SocketHandler, SocketEmitter } from "../../../utils/SocketsUnitario";
import { NombresEventosTomaAsistenciaDePersonalSS01 } from "../interfaces/NombresEventosAsistenciaDePersonal";
import {
  MARQUE_LA_ASISTENCIA_DE_ESTE_PERSONAL_PAYLOAD,
  MessagePayload,
  SALUDAME_PAYLOAD,
  SE_ACABA_DE_MARCAR_LA_ASISTENCIA_DE_ESTE_PERSONAL_PAYLOAD,
  UNIRME_A_SALA_DE_TOMA_DE_ASISTENCIA_DE_PERSONAL_PAYLOAD,
} from "../interfaces/PayloadEventosAsisteciaDePersonal";
import { SALAS_TOMA_ASISTENCIA_PERSONAL_IE20935 } from "../interfaces/SalasTomaAsistenciaDePersonal";

export class TomaAsistenciaPersonalSS01Events {
  public static socketConnection: Socket;

  static SALUDAME_SOCKET_HANDLER = class {
    private socketHandler;
    constructor(callback: () => void) {
      this.socketHandler = new SocketHandler(
        TomaAsistenciaPersonalSS01Events.socketConnection,
        NombresEventosTomaAsistenciaDePersonalSS01.SALUDAME,
        callback
      );
    }

    hand() {
      this.socketHandler.hand();
    }
  };

  static RESPUESTA_SALUDO_EMITTER = class {
    private socketEmitter;

    constructor(saludo: SALUDAME_PAYLOAD) {
      this.socketEmitter = new SocketEmitter<SALUDAME_PAYLOAD>(
        TomaAsistenciaPersonalSS01Events.socketConnection,
        NombresEventosTomaAsistenciaDePersonalSS01.RESPUESTA_SALUDO,
        saludo
      );
    }

    execute() {
      this.socketEmitter.execute();
    }
  };

  static UNIRME_A_SALA_DE_TOMA_DE_ASISTENCIA_DE_PERSONAL_HANDLER = class {
    private socketHandler;

    constructor(
      callback: (
        data: UNIRME_A_SALA_DE_TOMA_DE_ASISTENCIA_DE_PERSONAL_PAYLOAD
      ) => void
    ) {
      this.socketHandler =
        new SocketHandler<UNIRME_A_SALA_DE_TOMA_DE_ASISTENCIA_DE_PERSONAL_PAYLOAD>(
          TomaAsistenciaPersonalSS01Events.socketConnection,
          NombresEventosTomaAsistenciaDePersonalSS01.UNIRME_A_SALA_DE_TOMA_DE_ASISTENCIA_DE_PERSONAL,
          callback
        );
    }

    hand() {
      this.socketHandler.hand();
    }
  };

  static UNIDO_A_SALA_CORRECTAMENTE_EMITTER = class {
    private socketEmitter;

    constructor(data: MessagePayload) {
      this.socketEmitter = new SocketEmitter<MessagePayload>(
        TomaAsistenciaPersonalSS01Events.socketConnection,
        NombresEventosTomaAsistenciaDePersonalSS01.UNIDO_A_SALA_CORRECTAMENTE,
        data
      );
    }

    execute() {
      this.socketEmitter.execute();
    }
  };

  static MARQUE_LA_ASISTENCIA_DE_ESTE_PERSONAL_HANDLER = class {
    private socketHandler;

    constructor(
      callback: (data: MARQUE_LA_ASISTENCIA_DE_ESTE_PERSONAL_PAYLOAD) => void
    ) {
      this.socketHandler =
        new SocketHandler<MARQUE_LA_ASISTENCIA_DE_ESTE_PERSONAL_PAYLOAD>(
          TomaAsistenciaPersonalSS01Events.socketConnection,
          NombresEventosTomaAsistenciaDePersonalSS01.MARQUE_LA_ASISTENCIA_DE_ESTE_PERSONAL,
          callback
        );
    }

    hand() {
      this.socketHandler.hand();
    }
  };

  static SE_ACABA_DE_MARCAR_LA_ASISTENCIA_DE_ESTE_PERSONAL_EMITTER = class {
    private socketEmitter;

    constructor(
      data: SE_ACABA_DE_MARCAR_LA_ASISTENCIA_DE_ESTE_PERSONAL_PAYLOAD,
      sala: SALAS_TOMA_ASISTENCIA_PERSONAL_IE20935
    ) {
      this.socketEmitter =
        new SocketEmitter<SE_ACABA_DE_MARCAR_LA_ASISTENCIA_DE_ESTE_PERSONAL_PAYLOAD>(
          TomaAsistenciaPersonalSS01Events.socketConnection,
          NombresEventosTomaAsistenciaDePersonalSS01.SE_ACABA_DE_MARCAR_LA_ASISTENCIA_DE_ESTE_PERSONAL,
          data,
          sala
        );
    }

    execute() {
      this.socketEmitter.execute();
    }
  };
}
