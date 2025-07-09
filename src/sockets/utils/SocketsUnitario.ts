import { Server, Socket } from "socket.io";

export class SocketEmitter<T> {
  constructor(
    private socketConnection: Socket | SocketIOClient.Socket,
    private nombreEvento: string,
    private data?: T,
    private sala?: string,
    private io?: Server
  ) {}

  execute() {
    if (this.sala) {
      this.io!.to(this.sala).emit(this.nombreEvento, JSON.stringify(this.data??""));
    } else {
      this.socketConnection.emit(this.nombreEvento, JSON.stringify(this.data??""));
    }
  }
}

export class SocketHandler<T> {
  constructor(
    private socketConnection: Socket | SocketIOClient.Socket,
    private nombreEvento: string,
    private callback: (data: T) => void
  ) {}

  hand() {
    this.socketConnection.on(this.nombreEvento, this.callback);
  }
}
