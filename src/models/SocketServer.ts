import express from "express";
import dotenv from "dotenv";
import http from "http";
import https from "https";
import fs from "fs";
import { Server } from "socket.io";
import cors from "cors";
import authRoutes from "./../routes/authRoutes";
import Sockets from "./Sockets";

dotenv.config();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const USE_HTTPS = process.env.USE_HTTPS === 'true';
const SSL_KEY_PATH = process.env.SSL_KEY_PATH || './ssl/private.key';
const SSL_CERT_PATH = process.env.SSL_CERT_PATH || './ssl/certificate.crt';

class SocketServer {
  public app: ReturnType<typeof express>;
  public port: Number;
  public server: http.Server | https.Server;
  public io: Server;

  constructor() {
    this.app = express();
    this.port = Number(PORT);
    
    // Solo aplicar HTTPS cuando NODE_ENV sea "P" (Producción)
    if (NODE_ENV === "P" && USE_HTTPS && this.port === 443) {
      try {
        const sslOptions = {
          key: fs.readFileSync(SSL_KEY_PATH),
          cert: fs.readFileSync(SSL_CERT_PATH)
        };
        this.server = https.createServer(sslOptions, this.app);
        console.log('🔒 Servidor HTTPS configurado (Producción)');
      } catch (error) {
        console.error('❌ Error al cargar certificados SSL:', error);
        console.log('🔄 Fallback a HTTP...');
        this.server = http.createServer(this.app);
      }
    } else {
      // Funciona como la versión original para desarrollo o otras configuraciones
      this.server = http.createServer(this.app);
      if (NODE_ENV === "P") {
        console.log('🌐 Servidor HTTP configurado (Producción)');
      } else {
        console.log('🌐 Servidor HTTP configurado (Desarrollo)');
      }
    }

    this.io = new Server(this.server, {
      cors: {
        origin: "*", // En producción, limitar a dominios específicos
        methods: ["GET", "POST"],
      },
    });
  }

  middlewares() {
    // Middleware de seguridad para HTTPS solo en producción
    if (NODE_ENV === "P" && USE_HTTPS) {
      this.app.use((req, res, next) => {
        if (req.header('x-forwarded-proto') !== 'https') {
          res.redirect(`https://${req.header('host')}${req.url}`);
        } else {
          next();
        }
      });
    }

    // Middleware
    this.app.use(cors());
    this.app.use(express.json());

    // Rutas
    this.app.use("/api", authRoutes);

    // Ruta de prueba
    this.app.get("/", (_req, res) => {
      res.send(
        "Servidor de Sockets del Sistema de Control de Asistencia SIASIS - I.E. 20935 Asunción 8"
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

    // Inicializar Server - Escuchar en todas las interfaces
    this.server.listen(Number(this.port), '0.0.0.0', () => {
      const protocol = (NODE_ENV === "P" && USE_HTTPS) ? 'https' : 'http';
      const environment = NODE_ENV === "P" ? 'Producción' : 'Desarrollo';
      console.log(`🚀 Server corriendo en ${protocol}://0.0.0.0:${this.port} - Entorno: ${environment}`);
    });
  }
}

export default SocketServer;