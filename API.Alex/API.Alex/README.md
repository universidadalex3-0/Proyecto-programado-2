# API.Alex

Hice esta API en ASP.NET Core para que mi aplicación React pueda iniciar sesión y gestionar usuarios. Uso SQL Server para guardar los registros y abro `API.Alex.slnx` en Visual Studio con el SDK de .NET 10.

## Base de datos

En Somee uso `GestionSolicitudesAlex`. Guardé las tablas, la vista y los procedimientos de este proyecto en el esquema `EstudiantesAlex`. Para preparar una base local, ejecuto los siguientes archivos en orden:

1. `SQL/01-Base.sql` crea los objetos y los roles Administrador y Técnico. En la consola web de Somee uso `SQL/01-Base-ConsolaSomee.sql`.
2. `SQL/02-CuentaEvaluacion.sql` agrega la cuenta de acceso. La contraseña queda guardada como hash.

El listado y la búsqueda por ID leen la misma vista. Cuando elimino un usuario, desaparece de ambas consultas.

## Cómo la ejecuto

Desde la carpeta de la solución, configuro la conexión en PowerShell y arranco la API:

```powershell
$env:ConnectionStrings__Conexion = 'Server=SERVIDOR;Database=BASE;Integrated Security=True;Encrypt=True;TrustServerCertificate=True'
dotnet run --project .\API.Alex\API.Alex.csproj --no-launch-profile --urls http://localhost:5080
```

Para ejecutar React contra esa instancia, configuro `VITE_API_URL=http://localhost:5080/api/` en `.env.local`.

## Publicación

Publiqué esta API en https://solicitudes-alex.somee.com/estudiantes/ como aplicación IIS. Configuro la conexión con `ConnectionStrings__Conexion` en el alojamiento. React envía el token que recibe al iniciar sesión para poder consultar y modificar usuarios.
