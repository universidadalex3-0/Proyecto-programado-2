import { useState, type FormEvent } from "react";
import type { DatosUsuario, Usuario } from "../services/UsuariosAPI";

const campos = [
  { clave: "nombre", etiqueta: "Nombre", max: 50 },
  { clave: "apellido1", etiqueta: "Primer apellido", max: 50 },
  { clave: "apellido2", etiqueta: "Segundo apellido", max: 50 },
  { clave: "correo", etiqueta: "Correo electrónico", tipo: "email", max: 100 },
  { clave: "contrasena", etiqueta: "Contraseña", tipo: "password", max: 50 },
  { clave: "idRol", etiqueta: "ID del rol" },
  { clave: "fechaNac", etiqueta: "Fecha de nacimiento", tipo: "date" },
  { clave: "genero", etiqueta: "Género", max: 30 },
  { clave: "telefono", etiqueta: "Teléfono", tipo: "tel", max: 20 },
  { clave: "direccion", etiqueta: "Dirección", max: 500 },
] as const;

interface Props {
  usuario?: Usuario;
  ocupado: boolean;
  cancelar: () => void;
  guardar: (datos: DatosUsuario, id?: number) => Promise<void>;
}

export function FormularioUsuario({ usuario, ocupado, cancelar, guardar }: Props) {
  const [error, setError] = useState("");

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError("");
    const formulario = new FormData(evento.currentTarget);
    const valores = Object.fromEntries(campos.map(({ clave }) => {
      const valor = String(formulario.get(clave) ?? "");
      return [clave, clave === "contrasena" ? valor : valor.trim()];
    })) as Record<(typeof campos)[number]["clave"], string>;

    if (Object.values(valores).some((valor) => !valor.trim())) {
      setError("Completa todos los campos obligatorios.");
      return;
    }

    const idRol = Number(valores.idRol);
    if (idRol !== 1 && idRol !== 2) {
      setError("Selecciona el rol 1 o 2.");
      return;
    }

    await guardar({ ...valores, idRol }, usuario?.idUsuario);
  }

  return (
    <section className="card my-3" aria-labelledby="titulo-formulario">
      <div className="card-body">
        <h2 className="h5" id="titulo-formulario">{usuario ? `Editar usuario #${usuario.idUsuario}` : "Nuevo usuario"}</h2>
        {usuario && <p className="text-secondary">Ingresa la contraseña que quedará guardada e indica el ID del rol. Rol actual: {usuario.nombreRol || "sin información"}.</p>}
        <form onSubmit={enviar}>
          <fieldset disabled={ocupado}>
            <div className="row g-3">
              {campos.map(({ clave, etiqueta, ...config }) => {
                const tipo = "tipo" in config ? config.tipo : "text";
                let inicial = clave === "contrasena" ? "" : String(usuario?.[clave] ?? "");
                if (clave === "fechaNac") inicial = inicial.slice(0, 10);
                if (clave === "idRol") {
                  const rol = inicial === "1" || inicial === "2" ? inicial : usuario?.nombreRol === "Técnico" ? "2" : "";
                  return (
                    <div className="col-12 col-md-6" key={clave}>
                      <label htmlFor={clave} className="form-label">{etiqueta}</label>
                      <select id={clave} name={clave} className="form-select" required defaultValue={rol}>
                        <option value="" disabled>Selecciona un rol</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                      </select>
                    </div>
                  );
                }
                return (
                  <div className={clave === "direccion" ? "col-12" : "col-12 col-md-6"} key={clave}>
                    <label htmlFor={clave} className="form-label">{etiqueta}</label>
                    <input id={clave} name={clave} type={tipo} className="form-control" required
                      defaultValue={inicial} maxLength={"max" in config ? config.max : undefined}
                      min={tipo === "date" ? "1753-01-01" : undefined}

                      autoComplete={tipo === "password" ? "new-password" : undefined} />
                  </div>
                );
              })}
            </div>
            <div className="d-flex gap-2 mt-3">
              <button className="btn btn-success" type="submit">Guardar</button>
              <button className="btn btn-outline-secondary" type="button" onClick={cancelar}>Cancelar</button>
            </div>
          </fieldset>
        </form>
        {error && <p className="alert alert-danger mt-3 mb-0" role="alert">{error}</p>}
      </div>
    </section>
  );
}
