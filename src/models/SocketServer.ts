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
const NODE_ENV = process.env.NODE_ENV || "D"; // P=Producción, D=Desarrollo, C=Certificación
const USE_HTTPS = process.env.USE_HTTPS === "true";
const SSL_KEY_PATH = process.env.SSL_KEY_PATH || "./ssl/private.key";
const SSL_CERT_PATH = process.env.SSL_CERT_PATH || "./ssl/certificate.crt";
const BASE_PATH = process.env.BASE_PATH || ""; // Para dev/cert será /dev o /cert

class SocketServer {
  public app: ReturnType<typeof express>;
  public port: Number;
  public server: http.Server | https.Server;
  public io: Server;

  constructor() {
    this.app = express();
    this.port = Number(PORT);

    // Crear servidor HTTP o HTTPS según configuración
    // PRODUCCIÓN: HTTPS en puerto 443 con certificados SSL
    // DEV/CERT: HTTP en puertos 4000/5000 (Nginx maneja SSL)
    if (USE_HTTPS && this.port === 443) {
      try {
        console.log("🔍 Intentando cargar certificados SSL...");
        console.log(`📄 Key: ${SSL_KEY_PATH}`);
        console.log(`📄 Cert: ${SSL_CERT_PATH}`);

        const sslOptions = {
          key: fs.readFileSync(SSL_KEY_PATH),
          cert: fs.readFileSync(SSL_CERT_PATH),
        };
        this.server = https.createServer(sslOptions, this.app);
        console.log("🔒 Servidor HTTPS configurado correctamente (PRODUCCIÓN)");
      } catch (error) {
        console.error("❌ Error al cargar certificados SSL:", error);
        console.log("🔄 Fallback a HTTP...");
        this.server = http.createServer(this.app);
      }
    } else {
      this.server = http.createServer(this.app);
      const envName = this.getEnvironmentName();
      console.log(`🌐 Servidor HTTP configurado (${envName})`);
    }

    this.io = new Server(this.server, {
      cors: {
        origin: "*", // En producción, limitar a dominios específicos
        methods: ["GET", "POST"],
      },
      // Configurar path para WebSockets según ambiente
      path: BASE_PATH ? `${BASE_PATH}/socket.io/` : "/socket.io/",
    });
  }

  private getEnvironmentName(): string {
    switch (NODE_ENV) {
      case "P":
        return "PRODUCCIÓN";
      case "D":
        return "DESARROLLO";
      case "C":
        return "CERTIFICACIÓN";
      default:
        return "DESARROLLO";
    }
  }

  private getEnvironmentEmoji(): string {
    switch (NODE_ENV) {
      case "P":
        return "🚀";
      case "D":
        return "🛠️";
      case "C":
        return "✅";
      default:
        return "🛠️";
    }
  }

  middlewares() {
    // Middleware básico
    this.app.use(cors());
    this.app.use(express.json());

    // Rutas con base path (para dev/cert) o sin base path (para producción)
    if (BASE_PATH) {
      // Para DESARROLLO y CERTIFICACIÓN (con base path)
      this.app.use(`${BASE_PATH}/api`, authRoutes);

      this.app.get(`${BASE_PATH}/`, (_req, res) => {
        const envName = this.getEnvironmentName();
        const emoji = this.getEnvironmentEmoji();
        res.json({
          message: `${emoji} Servidor de Sockets del Sistema de Control de Asistencia SIASIS - I.E. 20935 Asunción 8 2025`,
          environment: envName,
          basePath: BASE_PATH,
          port: Number(this.port),
          timestamp: new Date().toISOString(),
          version: "2025.1.0",
        });
      });

      // Health check específico para el ambiente
      this.app.get(`${BASE_PATH}/health`, (_req, res) => {
        res.json({
          status: "OK",
          environment: this.getEnvironmentName(),
          basePath: BASE_PATH,
          port: Number(this.port),
        });
      });
    } else {
      // Para PRODUCCIÓN (sin base path) - RETROCOMPATIBILIDAD TOTAL
      this.app.use("/api", authRoutes);

      this.app.get("/", (_req, res) => {
        res.send(
          "🚀 Servidor de Sockets del Sistema de Control de Asistencia SIASIS - I.E. 20935 Asunción 8 2025"
        );
      });
    }

    // Health check global (funciona en todos los ambientes)
    this.app.get("/health", (_req, res) => {
      res.json({
        status: "OK",
        environment: this.getEnvironmentName(),
        port: Number(this.port),
        basePath: BASE_PATH || "root",
      });
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
    this.server.listen(Number(this.port), "0.0.0.0", () => {
      const protocol = USE_HTTPS ? "https" : "http";
      const envName = this.getEnvironmentName();
      const emoji = this.getEnvironmentEmoji();

      console.log(
        `${emoji} Server ${envName} corriendo en ${protocol}://0.0.0.0:${this.port}`
      );

      // URLs específicas por ambiente
      if (NODE_ENV === "P") {
        // PRODUCCIÓN
        console.log(
          `🌐 Accesible desde: ${protocol}://siasis-ss01-ie20935.duckdns.org`
        );
      } else {
        // DESARROLLO Y CERTIFICACIÓN
        console.log(
          `🌐 Accesible desde: https://siasis-ss01-dev-cert.duckdns.org${BASE_PATH}`
        );
      }

      // Información adicional de debug
      console.log(`📊 Configuración:`);
      console.log(`   - Ambiente: ${envName} (${NODE_ENV})`);
      console.log(`   - Puerto: ${this.port}`);
      console.log(`   - HTTPS: ${USE_HTTPS}`);
      console.log(`   - Base Path: ${BASE_PATH || "ninguno (root)"}`);
      console.log(
        `   - Certificados: ${USE_HTTPS ? "Cargados" : "No requeridos"}`
      );
      console.log(
        `   - WebSocket Path: ${
          BASE_PATH ? `${BASE_PATH}/socket.io/` : "/socket.io/"
        }`
      );
    });
  }
}

export default SocketServer;
