# Crud/apps.py

from django.apps import AppConfig

class CrudConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'MS_Usuarios'
    
    # NUEVA LÍNEA: Indica explícitamente a Django que use esta aplicación 
    # para la autenticación si fuera necesario.
    verbose_name = 'Gestión de Usuarios (Microservicio)'