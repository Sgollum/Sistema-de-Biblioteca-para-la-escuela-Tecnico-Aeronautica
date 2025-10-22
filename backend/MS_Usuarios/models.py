# Crud/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

# Definimos las opciones de roles como una tupla para Django
class RolUsuario(models.TextChoices):
    ADMINISTRADOR = 'ADMIN', 'Administrador'
    BIBLIOTECARIO = 'BIBLIO', 'Bibliotecario'
    LECTOR = 'LECTOR', 'Lector'

# Heredamos de AbstractUser para obtener toda la funcionalidad de Django (seguridad, contraseña, etc.)
class Usuario(AbstractUser):
    # Añadimos el campo de rol. Usamos CharField con choices para garantizar que solo se usen roles válidos.
    rol = models.CharField(
        max_length=10,
        choices=RolUsuario.choices,
        default=RolUsuario.LECTOR,
        verbose_name='Rol del Usuario'
    )
    # Aquí podrías añadir campos específicos para Lector/Bibliotecario si son necesarios.
    # Por ejemplo: telefono = models.CharField(max_length=15, blank=True, null=True)

    # El campo 'email' por defecto en AbstractUser es opcional.
    # Si quieres que el email sea requerido, puedes configurarlo aquí.

    class Meta:
        verbose_name = 'Usuario del Sistema'
        verbose_name_plural = 'Usuarios del Sistema'

    def __str__(self):
        return f"{self.username} ({self.get_rol_display()})"