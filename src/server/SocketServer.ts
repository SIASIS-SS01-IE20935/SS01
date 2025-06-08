// src/server/SocketServer.ts
import express from "express";
import dotenv from "dotenv";
import http from "http";
import https from "https";
import { Server } from "socket.io";
import cors from "cors";
import {
  createServerInstance,
  getSocketIOConfig,
  ServerConfig,
} from "./config/ServerConfig";
import { ServerLogger } from "./utils/ServerLogger";
import { setupHealthChecks, setupRoutes } from "./handlers/RouteHandler";
import Sockets from "../sockets/Sockets";

dotenv.config();

class SocketServer {
  public app: ReturnType<typeof express>;
  public port: number;
  public server: http.Server | https.Server;
  public io: Server;
  private config: ServerConfig;
  private logger: ServerLogger;

  constructor() {
    this.config = new ServerConfig();
    this.logger = new ServerLogger(this.config);
    this.app = express();
    this.port = this.config.port;

    // Crear servidor HTTP/HTTPS según configuración
    this.server = createServerInstance(this.app, this.config, this.logger);

    // Configurar Socket.IO
    this.io = new Server(this.server, getSocketIOConfig(this.config));

    this.logger.logServerCreated();
  }

  private middlewares(): void {
    // Middleware básico
    this.app.use(cors());
    this.app.use(express.json());

    // Configurar rutas principales
    setupRoutes(this.app, this.config);

    // Configurar health checks
    setupHealthChecks(this.app, this.config);
  }

  private configurarSockets(): void {
    new Sockets(this.io);
  }

  public execute(): void {
    this.middlewares();
    this.configurarSockets();

    this.server.listen(this.port, "0.0.0.0", () => {
      this.logger.logServerStarted();
    });
  }
}

export default SocketServer;
