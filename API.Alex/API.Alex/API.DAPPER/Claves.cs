using System.Security.Cryptography;

namespace API.DAPPER;

internal static class Claves
{
    private const int Iteraciones = 600000;

    internal static string Crear(string clave)
    {
        byte[] sal = RandomNumberGenerator.GetBytes(16);
        return Convert.ToHexString(sal) + ":" + Convert.ToHexString(Derivar(clave, sal));
    }

    internal static bool Verificar(string clave, string guardada)
    {
        var partes = guardada.Split(':');
        if (partes.Length != 2) return false;
        return CryptographicOperations.FixedTimeEquals(
            Derivar(clave, Convert.FromHexString(partes[0])),
            Convert.FromHexString(partes[1]));
    }

    private static byte[] Derivar(string clave, byte[] sal) =>
        Rfc2898DeriveBytes.Pbkdf2(clave, sal, Iteraciones, HashAlgorithmName.SHA256, 32);
}
