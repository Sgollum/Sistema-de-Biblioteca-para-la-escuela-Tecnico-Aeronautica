# backend/Biblioteca/urls.py

from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token 

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # 💡 AÑADIR ESTA LÍNEA: Endpoint de LOGIN que devuelve el token
    path('api/login/', obtain_auth_token, name='api_login'), 

    # Rutas de tus microservicios (ya existentes)
    path('api/usuarios/', include('MS_Usuarios.urls')),
    path('api/catalogo/', include('MS_Catalogo.urls')),
    path('api/prestamos/', include('MS_Prestamos.urls')),
    path('api/reportes/', include('MS_Reportes.urls')),
]