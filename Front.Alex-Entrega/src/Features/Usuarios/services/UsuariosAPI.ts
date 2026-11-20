import { http } from "../../../Shared/http";

export interface Usuario {
  idUsuario: number;
  idRol: number;
  nombreRol?: string;
  correo: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
  fechaNac: string;
  genero: string;
  telefono: string;
  direccion: string;
}

export type DatosUsuario = Omit<Usuario, "idUsuario" | "nombreRol"> & {
  contrasena: string;
};

interface Respuesta<T> {
  ok: boolean;
  mensaje: string | null;
  valorRetorno: T | null;
}

async function solicitar<T>(method: string, url: string, data?: object) {
  const { data: respuesta } = await http.request<Respuesta<T>>({ method, url, data });
  if (typeof respuesta?.ok !== "boolean") {
    throw new Error("La API devolvió una respuesta inesperada.");
  }
  if (!respuesta.ok) {
    throw new Error(respuesta.mensaje || "La API rechazó la operación.");
  }
  return respuesta;
}

export const usuariosAPI = {
  async listar() {
    const { valorRetorno } = await solicitar<Usuario[]>("GET", "Usuarios");
    if (!Array.isArray(valorRetorno)) throw new Error("La API no devolvió el listado.");
    return valorRetorno;
  },
  async consultar(idUsuario: number) {
    const { valorRetorno } = await solicitar<Usuario>("POST", "Usuarios/ObtenerUsuarioPorId", { idUsuario });
    if (valorRetorno?.idUsuario !== idUsuario) throw new Error("La API no devolvió el usuario solicitado.");
    return valorRetorno;
  },
  guardar(datos: DatosUsuario, idUsuario?: number) {
    return solicitar(idUsuario === undefined ? "POST" : "PUT", "Usuarios", { ...datos, idUsuario });
  },
  eliminar(idUsuario: number) {
    return solicitar("DELETE", "Usuarios", { idUsuario });
  },
};
