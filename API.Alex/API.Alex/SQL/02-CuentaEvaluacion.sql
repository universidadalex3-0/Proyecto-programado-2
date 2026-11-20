-- Ejecutar después de 01-Base.sql en la misma base.
IF NOT EXISTS (SELECT 1 FROM EstudiantesAlex.Usuarios WHERE Correo = N'alexrivera87340629@gmail.com')
BEGIN
    EXEC EstudiantesAlex.InsertarUsuarios
        @pCorreo = N'alexrivera87340629@gmail.com',
        @pContrasena = N'203FA06F7F910E4EB84C6F9F89542259:4CBC9A8DCFD1B2B91A6CBF871B009D52CDBD9211446F28D737AC78421AE63B80',
        @pIdRol = 2,
        @pNombre = N'Alex',
        @pApellido1 = N'Rivera',
        @pApellido2 = N'Mora',
        @pFechaNac = '20000101',
        @pGenero = N'No especificado',
        @pTelefono = N'00000000',
        @pDireccion = N'San José';
END;

