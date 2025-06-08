import { RolesSistema } from "../interfaces/shared/RolesSistema";

export const SalasPorRol: Record<
  | RolesSistema.Auxiliar
  | RolesSistema.Directivo
  | RolesSistema.ProfesorPrimaria,
  string
> = {
  [RolesSistema.Directivo]: "Sala_Directivos",
  [RolesSistema.ProfesorPrimaria]: "Sala_Profesores_Primaria",
  [RolesSistema.Auxiliar]: "Sala_Auxiliares",
};
