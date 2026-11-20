# Alex Estudiantes

Hice esta aplicación en React para gestionar usuarios. Inicio sesión desde la página y, en el panel, puedo ver el listado, buscar por ID, agregar, editar y eliminar registros. Antes de eliminar, el sistema me pide confirmación.

## Enlaces

- Página: https://alex-estudiantes.vercel.app/
- API: https://solicitudes-alex.somee.com/estudiantes/
- URL base que usa React: https://solicitudes-alex.somee.com/estudiantes/api/

## Cómo la ejecuto en mi equipo

1. Extraigo el ZIP y abro en VS Code la carpeta que contiene `package.json` y `package-lock.json`. Uso Node.js 24.
2. Desde esa carpeta, ejecuto estos comandos en PowerShell:

   ```powershell
   npm.cmd ci
   npm.cmd run dev
   ```

3. Abro la dirección que aparece junto a `Local:`, normalmente http://localhost:5173.

El frontend ya usa la API de Somee. Si necesito cambiar la dirección, copio `.env.example` como `.env.local`, actualizo `VITE_API_URL` y reinicio Vite.

## Cómo funciona

Uso React y Bootstrap para la interfaz. La API recibe las solicitudes, consulta SQL Server y me devuelve el resultado. En el formulario reviso los campos obligatorios. Si falla una solicitud, muestro el mensaje de la API o un aviso de conexión. Para editar, escribo la contraseña que quedará asignada al usuario y reviso el rol.

Publiqué el frontend en Vercel y la API en Somee. Entrego los datos de acceso junto al enlace de la aplicación.
