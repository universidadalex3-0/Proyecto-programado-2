import axios from "axios";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://solicitudes-alex.somee.com/estudiantes/api/",
  timeout: 15000,
  headers: { Accept: "application/json" },
});

export function mensajeError(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : "Ocurrió un error inesperado.";
  }
  if (!error.response) {
    return error.code === "ECONNABORTED"
      ? "La API tardó demasiado en responder."
      : "No se pudo conectar con la API.";
  }

  const { status, data } = error.response;
  const mensaje = data?.mensaje || data?.detail || data?.title;
  return typeof mensaje === "string"
    ? mensaje
    : status === 401
      ? "El correo o la contraseña no son correctos."
      : `La API respondió con un error (HTTP ${status}).`;
}
