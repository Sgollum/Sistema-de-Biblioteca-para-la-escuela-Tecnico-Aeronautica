# backend/MS_Usuarios/urls.py

from django.urls import path, include 
from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet

# 1. Configurar el Router
router = DefaultRouter()
# Registra el ViewSet. 'usuarios' aquí sería el prefijo si no usáramos la ruta raíz.
# Usamos r'' (raíz) para que las rutas sean directamente /api/usuarios/
router.register(r'', UsuarioViewSet, basename='usuarios') 

# 2. Definir la lista de patrones de URL (¡CRUCIAL!)
urlpatterns = [
    # Incluir todas las rutas generadas por el router (GET, POST, etc. para /api/usuarios/)
    path('', include(router.urls)),
]