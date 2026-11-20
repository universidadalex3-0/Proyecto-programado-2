import { useEffect, useState, type FormEvent } from "react";
import { mensajeError } from "../../../Shared/http";
import { FormularioUsuario } from "../Components/FormularioUsuario";
import { usuariosAPI, type DatosUsuario, type Usuario } from "../services/UsuariosAPI";

type Aviso = { tipo: "success" | "danger"; mensaje: string };

export function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [consulta, setConsulta] = useState<Usuario | null>(null);
  const [formulario, setFormulario] = useState<Usuario | "nuevo" | null>(null);
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const [ocupado, setOcupado] = useState(true);
  const [listado, setListado] = useState(false);

  useEffect(() => {
    let activo = true;
    usuariosAPI.listar().then((datos) => {
      if (!activo) return;
      setUsuarios(datos);
      setListado(true);
    }).catch((error: unknown) => {
      if (activo) setAviso({ tipo: "danger", mensaje: mensajeError(error) });
    }).finally(() => {
      if (activo) setOcupado(false);
    });
    return () => { activo = false; };
  }, []);

  async function ejecutar(operacion: () => Promise<void>) {
    setOcupado(true);
    setAviso(null);
    try {
      await operacion();
    } catch (error) {
      setAviso({ tipo: "danger", mensaje: mensajeError(error) });
    } finally {
      setOcupado(false);
    }
  }

  async function listar() {
    const datos = await usuariosAPI.listar();
    setUsuarios(datos);
    setListado(true);
    return datos;
  }

  function buscar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const id = Number(new FormData(evento.currentTarget).get("id"));
    setConsulta(null);
    void ejecutar(async () => {
      setConsulta(await usuariosAPI.consultar(id));
      setAviso({ tipo: "success", mensaje: "Usuario encontrado." });
    });
  }

  async function confirmarCambio(mensaje: string, id?: number) {
    if (id !== undefined && consulta?.idUsuario === id) setConsulta(null);
    try {
      const datos = await listar();
      if (id !== undefined && consulta?.idUsuario === id) {
        setConsulta(datos.find((usuario) => usuario.idUsuario === id) ?? null);
      }
      setAviso({ tipo: "success", mensaje });
    } catch (error) {
      setListado(false);
      setAviso({ tipo: "danger", mensaje: `${mensaje} No se pudo recargar el listado. ${mensajeError(error)}` });
    }
  }

  async function guardar(datos: DatosUsuario, id?: number) {
    await ejecutar(async () => {
      const respuesta = await usuariosAPI.guardar(datos, id);
      setFormulario(null);
      await confirmarCambio(respuesta.mensaje || "Usuario guardado.", id);
    });
  }

  function eliminar(usuario: Usuario) {
    if (!window.confirm(`¿Eliminar al usuario ${usuario.nombre} ${usuario.apellido1} (#${usuario.idUsuario})?`)) return;
    void ejecutar(async () => {
      const respuesta = await usuariosAPI.eliminar(usuario.idUsuario);
      if (typeof formulario === "object" && formulario?.idUsuario === usuario.idUsuario) setFormulario(null);
      await confirmarCambio(respuesta.mensaje || "Usuario eliminado.", usuario.idUsuario);
    });
  }

  return (
    <>
      <h1>Usuarios</h1>
      <div className="d-flex flex-wrap gap-2 my-3">
        <button type="button" className="btn btn-success" disabled={ocupado}
          onClick={() => { setAviso(null); setFormulario("nuevo"); }}>Nuevo usuario</button>
        <button type="button" className="btn btn-outline-secondary" disabled={ocupado}
          onClick={() => void ejecutar(async () => {
            await listar();
            setAviso({ tipo: "success", mensaje: "Listado actualizado." });
          })}>Recargar listado</button>
      </div>
      <form className="row gx-2 gy-2 align-items-end mb-3" onSubmit={buscar}>
        <div className="col-auto">
          <label htmlFor="buscar-id" className="form-label">Consultar por ID</label>
          <input className="form-control" id="buscar-id" name="id" type="number" min="1" max="2147483647" required />
        </div>
        <div className="col-auto"><button className="btn btn-outline-success" disabled={ocupado}>Buscar</button></div>
      </form>

      {ocupado && <p role="status">Consultando la API…</p>}
      {aviso && <p className={`alert alert-${aviso.tipo}`} role={aviso.tipo === "danger" ? "alert" : "status"}>{aviso.mensaje}</p>}
      {consulta && (
        <section className="card mb-3">
          <div className="card-body">
            <h2 className="h5">Usuario #{consulta.idUsuario}</h2>
            <dl className="row mb-0">
              <dt className="col-sm-4">Nombre</dt><dd className="col-sm-8">{consulta.nombre} {consulta.apellido1} {consulta.apellido2}</dd>
              <dt className="col-sm-4">Correo</dt><dd className="col-sm-8">{consulta.correo}</dd>
              <dt className="col-sm-4">Rol</dt><dd className="col-sm-8">{consulta.nombreRol}</dd>
              <dt className="col-sm-4">Fecha de nacimiento</dt><dd className="col-sm-8">{consulta.fechaNac?.slice(0, 10)}</dd>
              <dt className="col-sm-4">Género</dt><dd className="col-sm-8">{consulta.genero}</dd>
              <dt className="col-sm-4">Teléfono</dt><dd className="col-sm-8">{consulta.telefono}</dd>
              <dt className="col-sm-4">Dirección</dt><dd className="col-sm-8">{consulta.direccion}</dd>
            </dl>
          </div>
        </section>
      )}
      {formulario && <FormularioUsuario
        key={formulario === "nuevo" ? "nuevo" : formulario.idUsuario}
        usuario={formulario === "nuevo" ? undefined : formulario}
        ocupado={ocupado} cancelar={() => setFormulario(null)} guardar={guardar} />}
      <h2 className="h5 mt-4">Listado de usuarios</h2>
      {listado && (usuarios.length ? (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead><tr>{["ID", "Nombre", "Correo", "Rol", "Acciones"].map((columna) => <th scope="col" key={columna}>{columna}</th>)}</tr></thead>
            <tbody>{usuarios.map((usuario) => (
              <tr key={usuario.idUsuario}>
                <td>{usuario.idUsuario}</td>
                <td>{usuario.nombre} {usuario.apellido1} {usuario.apellido2}</td>
                <td>{usuario.correo}</td>
                <td>{usuario.nombreRol}</td>
                <td className="text-nowrap">
                  <button type="button" className="btn btn-sm btn-outline-primary me-2" disabled={ocupado}
                    onClick={() => void ejecutar(async () => setFormulario(await usuariosAPI.consultar(usuario.idUsuario)))}>Editar</button>
                  <button type="button" className="btn btn-sm btn-outline-danger" disabled={ocupado}
                    onClick={() => eliminar(usuario)}>Eliminar</button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : <p>No hay usuarios registrados.</p>)}
    </>
  );
}
