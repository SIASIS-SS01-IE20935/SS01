// import express from 'express';
// import http from 'http';
// import cors from 'cors';
import dotenv from "dotenv";
import SocketServer from "./server/SocketServer";

// import configureSocket from './config/socket';

// Configurar variables de entorno
dotenv.config();

const socketServer = new SocketServer();

socketServer.execute();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Rutas
// app.use('/api', authRoutes);

// // Ruta de prueba
// app.get('/', (_req, res) => {
//   res.send('API del Sistema de Control de Asistencia - I.E. 20935 Asunción 8');
// });

// // Crear servidor HTTP
// const server = http.createServer(app);

// // Configurar Socket.io
// configureSocket(server);

// // Iniciar servidor
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
