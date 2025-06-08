// src/server/config/ServerConfig.ts
import fs from "fs";
import http from "http";
import https from "https";
import { Express } from "express";
import { ServerOptions } from "socket.io";
import { Entorno } from "../../interfaces/shared/Entornos";
import { Entornos_Emojis, Entornos_Textos } from "../../assets/Entornos";
import { ServerLogger } from "../utils/ServerLogger";

export interface SSLOptions {
  key: Buffer;
  cert: Buffer;
}

export interface EnvironmentUrls {
  internal: string;
  external: string;
  websocket: string;
}

export class ServerConfig {
  public readonly port: number;
  public readonly entorno: Entorno;
  public readonly useHttps: boolean;
  public readonly basePath: string;
  public readonly sslKeyPath?: string;
  public readonly sslCertPath?: string;

  constructor() {
    this.port = Number(process.env.PORT) || 5000;
    this.entorno = process.env.ENTORNO as Entorno;
    this.useHttps = process.env.USE_HTTPS === "true";
    this.basePath = process.env.BASE_PATH || "";
    this.sslKeyPath = process.env.SSL_KEY_PATH;
    this.sslCertPath = process.env.SSL_CERT_PATH;
  }

  get envName(): string {
    return Entornos_Textos[this.entorno];
  }

  get envEmoji(): string {
    return Entornos_Emojis[this.entorno];
  }

  get shouldUseSSL(): boolean {
    return this.useHttps && this.port === 443;
  }

  get hasBasePath(): boolean {
    return Boolean(this.basePath);
  }

  get isLocal(): boolean {
    return this.entorno === "L";
  }

  get isProduction(): boolean {
    return this.entorno === "P";
  }

  get socketPath(): string {
    return this.hasBasePath ? `${this.basePath}/socket.io/` : "/socket.io/";
  }

  get urls(): EnvironmentUrls {
    const protocol = this.useHttps ? "https" : "http";

    switch (this.entorno) {
      case "P": // PRODUCCIÓN
        return {
          internal: `${protocol}://0.0.0.0:${this.port}`,
          external: `${protocol}://siasis-ss01-ie20935.duckdns.org`,
          websocket: `/socket.io/`,
        };

      case "L": // LOCAL
        return {
          internal: `${protocol}://0.0.0.0:${this.port}`,
          external: `${protocol}://localhost:${this.port}`,
          websocket: `/socket.io/`,
        };

      default: // DESARROLLO Y CERTIFICACIÓN
        return {
          internal: `${protocol}://0.0.0.0:${this.port}`,
          external: `https://siasis-ss01-dev-cert.duckdns.org${this.basePath}`,
          websocket: `${this.basePath}/socket.io/`,
        };
    }
  }

  getSSLOptions(): SSLOptions | null {
    if (!this.shouldUseSSL || !this.sslKeyPath || !this.sslCertPath) {
      return null;
    }

    try {
      return {
        key: fs.readFileSync(this.sslKeyPath),
        cert: fs.readFileSync(this.sslCertPath),
      };
    } catch (error) {
      console.error("❌ Error al cargar certificados SSL:", error);
      return null;
    }
  }
}

export function createServerInstance(
  app: Express,
  config: ServerConfig,
  logger: ServerLogger
): http.Server | https.Server {
  if (config.shouldUseSSL) {
    const sslOptions = config.getSSLOptions();

    if (sslOptions) {
      logger.logSSLConfigured();
      return https.createServer(sslOptions, app);
    } else {
      logger.logSSLFallback();
      return http.createServer(app);
    }
  }

  logger.logHTTPConfigured();
  return http.createServer(app);
}

export function getSocketIOConfig(
  config: ServerConfig
): Partial<ServerOptions> {
  return {
    cors: {
      origin: config.isProduction
        ? ["https://siasis-ss01-ie20935.duckdns.org"]
        : "*",
      methods: ["GET", "POST"],
    },
    path: config.socketPath,
  };
}
