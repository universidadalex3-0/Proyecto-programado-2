-- Ejecutar en la consola T-SQL de GestionSolicitudesAlex.
SET XACT_ABORT ON;
BEGIN TRY
    BEGIN TRANSACTION;
-- En Somee, selecciona la base GestionSolicitudesAlex antes de ejecutar.
IF SCHEMA_ID(N'EstudiantesAlex') IS NULL
    EXEC(N'CREATE SCHEMA EstudiantesAlex AUTHORIZATION dbo;');

SET XACT_ABORT ON;
IF OBJECT_ID(N'EstudiantesAlex.Roles', N'U') IS NULL
BEGIN
    CREATE TABLE EstudiantesAlex.Roles (
        IdRol int NOT NULL PRIMARY KEY,
        NombreRol nvarchar(50) NOT NULL UNIQUE
    );
END;
IF NOT EXISTS (SELECT 1 FROM EstudiantesAlex.Roles WHERE IdRol = 1)
    INSERT EstudiantesAlex.Roles VALUES (1, N'Administrador');
IF NOT EXISTS (SELECT 1 FROM EstudiantesAlex.Roles WHERE IdRol = 2)
    INSERT EstudiantesAlex.Roles VALUES (2, N'Técnico');

IF OBJECT_ID(N'EstudiantesAlex.Usuarios', N'U') IS NULL
BEGIN
    CREATE TABLE EstudiantesAlex.Usuarios (
        IdUsuario int IDENTITY(1,1) NOT NULL PRIMARY KEY,
        Correo nvarchar(100) NOT NULL UNIQUE,
        ContrasenaHash nvarchar(150) NOT NULL,
        IdRol int NOT NULL REFERENCES EstudiantesAlex.Roles(IdRol),
        Nombre nvarchar(50) NOT NULL,
        Apellido1 nvarchar(50) NOT NULL,
        Apellido2 nvarchar(50) NOT NULL,
        FechaNac datetime NOT NULL,
        Genero nvarchar(30) NOT NULL,
        Telefono nvarchar(20) NOT NULL,
        Direccion nvarchar(500) NOT NULL,
        FechaCreacion datetime NOT NULL DEFAULT GETUTCDATE()
    );
END;

EXEC(N'CREATE OR ALTER VIEW EstudiantesAlex.DatosUsuarios AS
SELECT u.IdUsuario, u.Correo, u.IdRol, u.Nombre, u.Apellido1, u.Apellido2,
       u.FechaNac, u.Genero, u.Telefono, u.Direccion, u.FechaCreacion, r.NombreRol
FROM EstudiantesAlex.Usuarios AS u
JOIN EstudiantesAlex.Roles AS r ON r.IdRol = u.IdRol;');

EXEC(N'CREATE OR ALTER PROCEDURE EstudiantesAlex.ObtenerInformacionUsuarios AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM EstudiantesAlex.DatosUsuarios ORDER BY IdUsuario;
END;');

EXEC(N'CREATE OR ALTER PROCEDURE EstudiantesAlex.ObtenerInformacionUsuariosPorId @pIdUsuario int AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM EstudiantesAlex.DatosUsuarios WHERE IdUsuario = @pIdUsuario;
END;');

EXEC(N'CREATE OR ALTER PROCEDURE EstudiantesAlex.InsertarUsuarios
    @pCorreo nvarchar(100), @pContrasena nvarchar(150), @pIdRol int,
    @pNombre nvarchar(50), @pApellido1 nvarchar(50), @pApellido2 nvarchar(50),
    @pFechaNac datetime, @pGenero nvarchar(30), @pTelefono nvarchar(20),
    @pDireccion nvarchar(500)
AS
BEGIN
    SET NOCOUNT OFF;
    INSERT EstudiantesAlex.Usuarios (Correo, ContrasenaHash, IdRol, Nombre, Apellido1, Apellido2,
                         FechaNac, Genero, Telefono, Direccion)
    VALUES (@pCorreo, @pContrasena, @pIdRol, @pNombre, @pApellido1, @pApellido2,
            @pFechaNac, @pGenero, @pTelefono, @pDireccion);
END;');

EXEC(N'CREATE OR ALTER PROCEDURE EstudiantesAlex.ActualizarUsuarioPorId
    @pIdUsuario int,
    @pCorreo nvarchar(100), @pContrasena nvarchar(150), @pIdRol int,
    @pNombre nvarchar(50), @pApellido1 nvarchar(50), @pApellido2 nvarchar(50),
    @pFechaNac datetime, @pGenero nvarchar(30), @pTelefono nvarchar(20),
    @pDireccion nvarchar(500)
AS
BEGIN
    SET NOCOUNT OFF;
    UPDATE EstudiantesAlex.Usuarios
    SET Correo = @pCorreo, ContrasenaHash = @pContrasena, IdRol = @pIdRol,
        Nombre = @pNombre, Apellido1 = @pApellido1, Apellido2 = @pApellido2,
        FechaNac = @pFechaNac, Genero = @pGenero, Telefono = @pTelefono, Direccion = @pDireccion
    WHERE IdUsuario = @pIdUsuario;
END;');

EXEC(N'CREATE OR ALTER PROCEDURE EstudiantesAlex.EliminarUsuarioPorId @pIdUsuario int AS
BEGIN
    SET NOCOUNT OFF;
    DELETE FROM EstudiantesAlex.Usuarios WHERE IdUsuario = @pIdUsuario;
END;');

EXEC(N'CREATE OR ALTER PROCEDURE EstudiantesAlex.spIniciarSesion @pCorreo nvarchar(100) AS
BEGIN
    SET NOCOUNT ON;
    SELECT IdUsuario, Correo, ContrasenaHash,
           CONCAT(Nombre, N'' '', Apellido1, N'' '', Apellido2) AS NombreCompleto
    FROM EstudiantesAlex.Usuarios WHERE Correo = @pCorreo;
END;');
    COMMIT TRANSACTION;

    SELECT
        COUNT(CASE WHEN type = 'U' THEN 1 END) AS Tablas,
        COUNT(CASE WHEN type = 'P' THEN 1 END) AS Procedimientos,
        COUNT(CASE WHEN type = 'V' THEN 1 END) AS Vistas
    FROM sys.objects
    WHERE schema_id = SCHEMA_ID(N'EstudiantesAlex');
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
    THROW;
END CATCH;