using API.DAPPER;
using Microsoft.AspNetCore.DataProtection;
using System.Security.Cryptography;
using API.LOGICA.NEGOCIO;

var builder = WebApplication.CreateBuilder(args);

// Registro los servicios que usan los controladores.

builder.Services.AddScoped<InicioSesionBLL>();
builder.Services.AddScoped<IniciosSesionDAL>();
builder.Services.AddScoped<UsuariosBLL>();
builder.Services.AddScoped<UsuariosDAL>();

builder.Services.AddControllersWithViews();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();
builder.Services.AddDataProtection().SetApplicationName("API.Alex");


builder.Services.AddCors(options =>
{

    options.AddPolicy("PermitirTodos", policy =>
    {
        policy.AllowAnyOrigin()
               .AllowAnyHeader()
               .AllowAnyMethod();
    });

});

var app = builder.Build();

// Solo activo OpenAPI en desarrollo.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseStaticFiles();

app.UseCors("PermitirTodos");

var sesiones = app.Services.GetRequiredService<IDataProtectionProvider>()
    .CreateProtector("API.Alex.Sesion").ToTimeLimitedDataProtector();

app.Use(async (contexto, siguiente) =>
{
    if (!contexto.Request.Path.StartsWithSegments("/api/Usuarios", StringComparison.OrdinalIgnoreCase))
    {
        await siguiente(contexto);
        return;
    }

    string autorizacion = contexto.Request.Headers.Authorization.ToString();
    bool valida = false;
    if (autorizacion.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
    {
        try
        {
            sesiones.Unprotect(autorizacion[7..]);
            valida = true;
        }
        catch (CryptographicException) { }
    }

    if (valida)
    {
        await siguiente(contexto);
        return;
    }

    contexto.Response.StatusCode = StatusCodes.Status401Unauthorized;
    await contexto.Response.WriteAsJsonAsync(new { ok = false, mensaje = "Inicia sesión para continuar." });
});

app.MapControllers();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Inicio}"

    );

app.Run();
