import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import authRoutes from "./../routes/authRoutes";
import Sockets from "./Sockets";

dotenv.config();

const PORT = process.env.PORT || 5000;

class SocketServer {
  public app: ReturnType<typeof express>;
  public port: Number;
  public server: http.Server;
  public io: Server;

  constructor() {
    
    this.app = express();

    this.port = Number(PORT);

    this.server = http.createServer(this.app);

    this.io = new Server(this.server, {
      cors: {
        origin: "*", // En producción, limitar a dominios específicos
        methods: ["GET", "POST"],
      },
    });
  }

  middlewares() {
    // Middleware
    this.app.use(cors());
    this.app.use(express.json());

    // Rutas
    this.app.use("/api", authRoutes);

    // Ruta de prueba
    this.app.get("/", (_req, res) => {
      res.send(
        "API del Sistema de Control de Asistencia - I.E. 20935 Asunción 8"
      );
    });
  }

  configurarSockets() {
    new Sockets(this.io);
  }

  execute() {
    // Inicializar Middlewares
    this.middlewares();

    // Inicializar sockets
    this.configurarSockets();

    // Inicializar Server
    this.server.listen(this.port, () => {
      console.log("Server corriendo en puerto:", this.port);
    });
  }
}

export default SocketServer;
