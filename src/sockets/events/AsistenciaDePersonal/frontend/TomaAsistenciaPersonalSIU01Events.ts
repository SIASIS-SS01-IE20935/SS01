import { Socket } from "socket.io";
import { SocketEmitter, SocketHandler } from "../../../utils/SocketsUnitario";
import { NombresEventosTomaAsistenciaDePersonalSS01 } from "../interfaces/NombresEventosAsistenciaDePersonal";
import { SALUDAME_PAYLOAD } from "../interfaces/PayloadEventosAsisteciaDePersonal";

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

    init() {
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
}
