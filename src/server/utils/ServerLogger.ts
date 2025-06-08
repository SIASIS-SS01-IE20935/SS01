import { ServerConfig } from "../config/ServerConfig";

export class ServerLogger {
  constructor(private config: ServerConfig) {}

  logServerCreated(): void {
    console.log(`🌐 Servidor HTTP configurado (${this.config.envName})`);
  }

  logSSLConfigured(): void {
    console.log("🔍 Intentando cargar certificados SSL...");
    console.log(`📄 Key: ${this.config.sslKeyPath}`);
    console.log(`📄 Cert: ${this.config.sslCertPath}`);
    console.log("🔒 Servidor HTTPS configurado correctamente (PRODUCCIÓN)");
  }

  logSSLFallback(): void {
    console.log("🔄 Fallback a HTTP...");
  }

  logHTTPConfigured(): void {
    console.log(`🌐 Servidor HTTP configurado (${this.config.envName})`);
  }

  logServerStarted(): void {
    const protocol = this.config.useHttps ? "https" : "http";
    const urls = this.config.urls;

    console.log(
      `${this.config.envEmoji} Server ${this.config.envName} corriendo en ${urls.internal}`
    );

    this.logAccessUrls();
    this.logConfiguration();
    this.logEnvironmentSpecific();
  }

  private logAccessUrls(): void {
    const urls = this.config.urls;

    switch (this.config.entorno) {
      case "P":
        console.log(`🌐 Accesible desde: ${urls.external}`);
        break;

      case "L":
        console.log(`🏠 Accesible desde: ${urls.external}`);
        console.log(`🔗 También desde: http://127.0.0.1:${this.config.port}`);
        break;

      default:
        console.log(`🌐 Accesible desde: ${urls.external}`);
        break;
    }
  }

  private logConfiguration(): void {
    console.log(`📊 Configuración:`);
    console.log(
      `   - Ambiente: ${this.config.envName} (${this.config.entorno})`
    );
    console.log(`   - Puerto: ${this.config.port}`);
    console.log(`   - HTTPS: ${this.config.useHttps}`);
    console.log(`   - Base Path: ${this.config.basePath || "ninguno (root)"}`);
    console.log(
      `   - Certificados: ${
        this.config.useHttps ? "Cargados" : "No requeridos"
      }`
    );
    console.log(`   - WebSocket Path: ${this.config.socketPath}`);
  }

  private logEnvironmentSpecific(): void {
    if (this.config.isLocal) {
      console.log(`🏠 Modo LOCAL habilitado - Sin SSL, sin dominios externos`);
    }
  }

  logError(message: string, error?: any): void {
    console.error(`❌ ${message}`, error || "");
  }

  logInfo(message: string): void {
    console.log(`ℹ️ ${message}`);
  }

  logWarning(message: string): void {
    console.warn(`⚠️ ${message}`);
  }
}
