from django.db import models
from django.contrib.auth.models import AbstractUser

# Definir las opciones de rol
ROLE_CHOICES = (
    ('admin', 'Administrador'),
    ('bibliotecario', 'Bibliotecario'),
    ('lector', 'Lector'),
)

class Usuario(AbstractUser):
    # Hereda username, email, password, etc., de AbstractUser

    # ✅ CORRECCIÓN CRÍTICA: Aumentar max_length a 50 para que quepan todos los roles
    # y los roles futuros, eliminando el DataError 1406.
    rol = models.CharField(
        max_length=50, 
        choices=ROLE_CHOICES, 
        default='lector'
    )
    
    # Asegúrate de agregar los campos de AbstractUser que quieras mantener
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='usuario_set',
        blank=True,
        help_text=('The groups this user belongs to. A user will get all permissions '
                   'granted to each of their groups.'),
        verbose_name=('groups'),
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='usuario_set',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name=('user permissions'),
    )

    class Meta:
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"

    # Puedes necesitar redefinir la representación de string si es un campo custom
    def __str__(self):
        return self.username