import { Server } from "socket.io";

class Sockets {
  constructor(private io: Server) {
    this.io = io;
    // this.bandList = new BandList();
    this.setSocketEvents();
  }

  setSocketEvents() {
    // On connection
    this.io.on("connection", (socket) => {
      console.log(`Nueva conexión establecida: ${socket.id}`);

      //   // Emitir al cliente conectado, todas las bandas actuales
      //   socket.emit("current-bands", this.bandList.getBands());

      //   // votar por la banda
      //   socket.on("votar-banda", (id) => {
      //     this.bandList.increaseVotes(id);
      //     this.io.emit("current-bands", this.bandList.getBands());
      //   });

      //   // Borrar banda
      //   socket.on("borrar-banda", (id) => {
      //     this.bandList.removeBand(id);
      //     this.io.emit("current-bands", this.bandList.getBands());
      //   });

      //   // Cambiar nombre de la banda
      //   socket.on("cambiar-nombre-banda", ({ id, nombre }) => {
      //     this.bandList.changeName(id, nombre);
      //     this.io.emit("current-bands", this.bandList.getBands());
      //   });

      //   // Crear una nueva banda
      //   socket.on("crear-banda", ({ nombre }) => {
      //     this.bandList.addBand(nombre);
      //     this.io.emit("current-bands", this.bandList.getBands());
      //   });

      socket.on("disconnect", () => {
        console.log(`Conexión terminada: ${socket.id}`);
      });
    });
  }
}

export default Sockets;
