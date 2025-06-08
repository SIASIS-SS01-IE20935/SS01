// src/server/middleware/RouteHandler.ts
import { Express } from "express";
import { ServerConfig } from "../config/ServerConfig";
import authRoutes from "../../routes/authRoutes";

interface ServerResponse {
  message: string;
  environment: string;
  basePath?: string;
  port: number;
  timestamp: string;
  version: string;
  mode?: string;
}

export function setupRoutes(app: Express, config: ServerConfig): void {
  if (config.hasBasePath) {
    // Para DESARROLLO y CERTIFICACIÓN (con base path)
    setupBasepathRoutes(app, config);
  } else {
    // Para PRODUCCIÓN y LOCAL (sin base path)
    setupRootRoutes(app, config);
  }
}

function setupBasepathRoutes(app: Express, config: ServerConfig): void {
  const { basePath } = config;

  // API Routes
  app.use(`${basePath}/api`, authRoutes);

  // Main Route
  app.get(`${basePath}/`, (_req, res) => {
    res.json(createServerResponse(config, true));
  });
}

function setupRootRoutes(app: Express, config: ServerConfig): void {
  // API Routes
  app.use("/api", authRoutes);

  // Main Route
  app.get("/", (_req, res) => {
    const response = createServerResponse(config, false);

    if (config.isLocal) {
      // JSON response para LOCAL (más informativa)
      res.json({
        ...response,
        mode: "LOCAL_DEVELOPMENT",
      });
    } else {
      // Texto simple para PRODUCCIÓN (retrocompatibilidad)
      res.send(response.message);
    }
  });
}

function createServerResponse(
  config: ServerConfig,
  includeBasePath: boolean
): ServerResponse {
  const response: ServerResponse = {
    message: `${
      config.envEmoji
    } Servidor de Web Sockets del Sistema de Control de Asistencia SIASIS - I.E. 20935 Asunción 8 | ${new Date().getFullYear()}`,
    environment: config.envName,
    port: config.port,
    timestamp: new Date().toISOString(),
    version: "2025.1.0",
  };

  if (includeBasePath) {
    response.basePath = config.basePath;
  }

  return response;
}

export function setupHealthChecks(app: Express, config: ServerConfig): void {
  // Health check específico para ambiente (solo con basePath)
  if (config.hasBasePath) {
    app.get(`${config.basePath}/health`, (_req, res) => {
      res.json({
        status: "OK",
        environment: config.envName,
        basePath: config.basePath,
        port: config.port,
      });
    });
  }

  // Health check global (funciona en todos los ambientes)
  app.get("/health", (_req, res) => {
    res.json({
      status: "OK",
      environment: config.envName,
      port: config.port,
      basePath: config.basePath || "root",
    });
  });
}
