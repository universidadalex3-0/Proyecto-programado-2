import { useState } from "react";
import { http, mensajeError } from "../../../Shared/http";
import { AuthAPI, type Usuariosesion } from "../services/AuthAPI";

export function useInicioSesion() {
  const [usuario, setUsuario] = useState<Usuariosesion | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  async function Iniciar(correo: string, contrasena: string) {
    setError("");
    setCargando(true);
    try {
      const sesion = await AuthAPI.IniciarSesion(correo, contrasena);
      if (sesion.token) http.defaults.headers.common.Authorization = `Bearer ${sesion.token}`;
      setUsuario(sesion);
    } catch (error) {
      setError(mensajeError(error));
    } finally {
      setCargando(false);
    }
  }

  function CerrarSesion() {
    delete http.defaults.headers.common.Authorization;
    setUsuario(null);
    setError("");
  }

  return { usuario, error, Iniciar, CerrarSesion, cargando };
}
