# backend/MS_Usuarios/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

# Definimos las opciones de roles
class RolUsuario(models.TextChoices):
    ADMINISTRADOR = 'ADMIN', 'Administrador'
    BIBLIOTECARIO = 'BIBLIO', 'Bibliotecario'
    LECTOR = 'LECTOR', 'Lector'

# Modelo Usuario que hereda de AbstractUser
class Usuario(AbstractUser):
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