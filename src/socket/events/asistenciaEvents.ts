// src/socket/events/asistenciaEvents.ts
import { Server, Socket } from 'socket.io';

/**
 * Registra los eventos relacionados con la asistencia
 * @param io Servidor de Socket.IO
 * @param socket Socket del cliente
 */
const registerAsistenciaEvents = (io: Server, socket: Socket) => {
  // Obtener información del usuario
  const { username, role } = socket.data.user;

  // Evento para registrar asistencia
  socket.on('REGISTRAR-ASISTENCIA', (data) => {
    // Validar permisos según rol
    const permisosValidos = ['directivo', 'auxiliar', 'profesor-primaria'];
    
    if (!permisosValidos.includes(role)) {
      return socket.emit('ERROR', { message: 'No tienes permisos para registrar asistencia' });
    }
    
    // Aquí iría la lógica para guardar en base de datos
    console.log(`Asistencia registrada por ${username}:`, data);
    
    // Notificar a todos los directivos
    io.to('directivo').emit('ASISTENCIA-ACTUALIZADA', {
      ...data,
      registradoPor: username
    });
    
    // Confirmar registro
    socket.emit('ASISTENCIA-REGISTRADA', { success: true });
  });

  // Solicitar asistencias de un aula
  socket.on('SOLICITAR-ASISTENCIAS-AULA', (data) => {
    const { aula, fecha } = data;
    
    // Aquí iría la lógica para obtener datos de la base de datos
    console.log(`Consultando asistencias del aula ${aula} para la fecha ${fecha}`);
    
    // Simular respuesta
    socket.emit('ASISTENCIAS-AULA', {
      aula,
      fecha,
      asistencias: [
        // Aquí irían los datos reales
        { estudianteId: 'e001', estado: 'A' },
        { estudianteId: 'e002', estado: 'T' }
      ]
    });
  });
};

export default registerAsistenciaEvents;