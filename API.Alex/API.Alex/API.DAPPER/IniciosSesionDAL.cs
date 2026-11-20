using System.Data;
using API.ENTIDADES;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace API.DAPPER;

public class IniciosSesionDAL(IConfiguration configuracion)
{
    public Respuesta<InicioSesionDto> IniciarSesion(InicioSesionDto usuario)
    {
        try
        {
            using var conexion = new SqlConnection(configuracion.GetConnectionString("Conexion"));
            conexion.Open();
            using var comando = new SqlCommand("EstudiantesAlex.spIniciarSesion", conexion);
            comando.CommandType = CommandType.StoredProcedure;
            comando.Parameters.Add("@pCorreo", SqlDbType.NVarChar, 100).Value = usuario.Correo;
            using var lector = comando.ExecuteReader();

            if (!lector.Read() || !Claves.Verificar(usuario.Contrasena!, lector.GetString(2)))
                return new() { Mensaje = "El correo o la contraseña no son correctos." };

            return new()
            {
                Ok = true,
                Mensaje = "Inicio de sesión exitoso.",
                ValorRetorno = new()
                {
                    IdUsuario = lector.GetInt32(0),
                    Correo = lector.GetString(1),
                    NombreCompleto = lector.GetString(3)
                }
            };
        }
        catch (Exception)
        {
            return new() { Mensaje = "No se pudo validar la cuenta en la base de datos." };
        }
    }
}

