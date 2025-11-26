from rest_framework.authentication import TokenAuthentication

# Heredamos de TokenAuthentication pero modificamos la palabra clave (keyword)
# que busca en la cabecera de autorización.
class BearerTokenAuthentication(TokenAuthentication):
    """
    Clase de autenticación personalizada para aceptar el prefijo 'Bearer'
    en lugar del prefijo 'Token' en la cabecera HTTP Authorization.

    Esto es necesario cuando el frontend (como Angular) envía el token en el formato
    estándar Bearer, mientras que Django por defecto espera 'Token'.
    """
    keyword = 'Bearer'