

import dotenv from "dotenv";
import SocketServer from "./server/SocketServer";

// Configurar variables de entorno
dotenv.config();

const socketServer = new SocketServer();

socketServer.execute();

