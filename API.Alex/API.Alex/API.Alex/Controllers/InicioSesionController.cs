using API.ENTIDADES;
using Microsoft.AspNetCore.DataProtection;
using API.LOGICA.NEGOCIO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Alex.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InicioSesionController : ControllerBase
    {


        //Instancias

        private readonly InicioSesionBLL _inicioSesionBLL;
        private readonly ITimeLimitedDataProtector _sesiones;

        public InicioSesionController(InicioSesionBLL inicioSesionBLL, IDataProtectionProvider proteccion)
        {
            _inicioSesionBLL = inicioSesionBLL;
            _sesiones = proteccion.CreateProtector("API.Alex.Sesion").ToTimeLimitedDataProtector();

        }


        [HttpPost]
        public Respuesta<InicioSesionDto> IniciarSesion([FromBody] InicioSesionDto ObjUsuario)
        {

            Respuesta<InicioSesionDto> respuesta = new Respuesta<InicioSesionDto>();

            try
            {

                var reply = _inicioSesionBLL.IniciarSesion(ObjUsuario);

                if (reply != null)
                {

                    respuesta = reply;
                    if (respuesta.Ok && respuesta.ValorRetorno is { } usuario)
                    {
                        usuario.Token = _sesiones.Protect(usuario.IdUsuario.ToString(), TimeSpan.FromHours(4));
                    }

                }

            }
            catch (Exception ex)
            {

                respuesta.Ok = false;
                respuesta.Mensaje = $"Ha ocurrido un error en la capa del controlador InicioSesionController en el método iniciarsesion {ex.Message}";
                respuesta.ValorRetorno = null;
            }

            return respuesta;

        }



    }
}
