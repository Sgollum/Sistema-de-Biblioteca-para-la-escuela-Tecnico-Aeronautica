# backend/Biblioteca/urls.py

from django.contrib import admin
from django.urls import path, include
from django.conf import settings 
from django.conf.urls.static import static

# 💡 CORRECCIÓN CRÍTICA: Importar la función obtain_auth_token
from rest_framework.authtoken.views import obtain_auth_token 

urlpatterns = [
    path('admin/', admin.site.urls),
    # Esta línea ahora funcionará:
    path('api/login/', obtain_auth_token, name='api_login'), 
    path('api/usuarios/', include('MS_Usuarios.urls')),
    path('api/catalogo/', include('MS_Catalogo.urls')),
    path('api/prestamos/', include('MS_Prestamos.urls')),
    path('api/reportes/', include('MS_Reportes.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)