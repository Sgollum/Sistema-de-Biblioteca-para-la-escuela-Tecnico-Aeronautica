from django.contrib.auth.models import AbstractUser
from django.db import models

# Definimos las opciones de roles
class RolUsuario(models.TextChoices):
    ADMINISTRADOR = 'ADMIN', 'Administrador'
    BIBLIOTECARIO = 'BIBLIO', 'Bibliotecario'
    LECTOR = 'LECTOR', 'Lector'

# Modelo Usuario que hereda de AbstractUser
class Usuario(AbstractUser):
    # CRÍTICO: Añadimos el campo 'nombre' que el Serializer espera.
    nombre = models.CharField(max_length=150, verbose_name='Nombre completo', blank=False, null=False) 
    
    # Hacemos los campos heredados opcionales para evitar problemas en el Admin
    first_name = models.CharField(max_length=150, blank=True, null=True, verbose_name=('first name'))
    last_name = models.CharField(max_length=150, blank=True, null=True, verbose_name=('last name'))
    
    # Email requerido y único
    email = models.EmailField(unique=True, null=False, blank=False) 
    
    rol = models.CharField(
        max_length=10,
        choices=RolUsuario.choices,
        default=RolUsuario.LECTOR,
        verbose_name='Rol del Usuario'
    )
    
    class Meta:
        verbose_name = 'Usuario del Sistema'
        verbose_name_plural = 'Usuarios del Sistema'

    def __str__(self):
        return f"{self.username} ({self.get_rol_display()})"