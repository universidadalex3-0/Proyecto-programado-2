import { Navigate, Route, Routes } from "react-router";
import type { Usuariosesion } from "../../Auth/services/AuthAPI";
import { UsuariosPage } from "../../Usuarios/Pages/Usuarios";
import { MenuLateral } from "../Components/MenuLateral";
import "./Dashboard.css";

interface DashboardProps {
  usuario: Usuariosesion;
  cerrarSesion: () => void;
}

export function DashboardPage({ usuario, cerrarSesion }: DashboardProps) {
  const nombre = usuario.nombreCompleto || usuario.correo || "Usuario";

  return (
    <div className="dashboard-layout">
      <MenuLateral nombre={nombre} cerrarSesion={cerrarSesion} />
      <div className="dashboard-cuerpo">
        <header className="dashboard-cabecera">
          <span>Panel de administración</span>
          <span role="status">Sesión iniciada</span>
        </header>
        <main className="dashboard-contenido">
          <Routes>
            <Route index element={<UsuariosPage />} />
            <Route path="perfil" element={
              <section className="dashboard-perfil">
                <h1 className="h4 mb-3">Mi perfil</h1>
                <dl className="mb-0">
                  <dt>Nombre completo</dt><dd>{nombre}</dd>
                  <dt>Correo electrónico</dt><dd>{usuario.correo || "No disponible"}</dd>
                  <dt>Identificador</dt><dd>{usuario.idUsuario}</dd>
                </dl>
              </section>
            } />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
