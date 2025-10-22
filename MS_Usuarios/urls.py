# MS_Usuarios/urls.py

from django.urls import path
from . import views # <-- ¡Asegúrate de que esta línea esté descomentada ahora!

urlpatterns = [
    # Rutas que el Frontend usará para Autenticación
    path('login/', views.mock_login, name='api_login'),
    path('register/', views.mock_register, name='api_register'),
    
    # Rutas para el CRUD de Usuarios (ej. Ver Perfil)
    path('user/<int:pk>/', views.mock_user_detail, name='api_user_detail'),
]