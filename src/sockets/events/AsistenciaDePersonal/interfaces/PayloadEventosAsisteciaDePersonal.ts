import { RegistroEntradaSalida } from "../../../../interfaces/shared/AsistenciaRequests";
import { Genero } from "../../../../interfaces/shared/Genero";
import { ModoRegistro } from "../../../../interfaces/shared/ModoRegistroPersonal";
import { RolesSistema } from "../../../../interfaces/shared/RolesSistema";
import { SALAS_TOMA_ASISTENCIA_PERSONAL_IE20935 } from "./SalasTomaAsistenciaDePersonal";

export interface SALUDAME_PAYLOAD {
  saludo: string;
}

export interface UNIRME_A_SALA_DE_TOMA_DE_ASISTENCIA_DE_PERSONAL_PAYLOAD {
  Sala_Toma_Asistencia_de_Personal: SALAS_TOMA_ASISTENCIA_PERSONAL_IE20935;
}

export interface MessagePayload {
  message: string;
}

export interface MARQUE_LA_ASISTENCIA_DE_ESTE_PERSONAL_PAYLOAD
  extends SE_ACABA_DE_MARCAR_LA_ASISTENCIA_DE_ESTE_PERSONAL_PAYLOAD {
  Sala_Toma_Asistencia_de_Personal: SALAS_TOMA_ASISTENCIA_PERSONAL_IE20935;
}

export interface ELIMINE_LA_ASISTENCIA_DE_ESTE_PERSONAL_PAYLOAD
  extends SE_ACABA_DE_ELIMINAR_LA_ASISTENCIA_DE_ESTE_PERSONAL_PAYLOAD {
  Sala_Toma_Asistencia_de_Personal: SALAS_TOMA_ASISTENCIA_PERSONAL_IE20935;
}

//interface para evitar rebote contra si mismo
export interface EmisorBroadcastDeSala {
  Mi_Socket_Id: string;
}

export interface SE_ACABA_DE_ELIMINAR_LA_ASISTENCIA_DE_ESTE_PERSONAL_PAYLOAD
  extends EmisorBroadcastDeSala {
  id_o_dni: string | number;
  nombres: string;
  apellidos: string;
  rol: RolesSistema;
  modoRegistro: ModoRegistro;
  genero: Genero;
}

export interface SE_ACABA_DE_MARCAR_LA_ASISTENCIA_DE_ESTE_PERSONAL_PAYLOAD
  extends EmisorBroadcastDeSala {
  id_o_dni: string | number;
  nombres: string;
  apellidos: string;
  rol: RolesSistema;
  modoRegistro: ModoRegistro;
  genero: Genero;
  RegistroEntradaSalida: RegistroEntradaSalida;
}
