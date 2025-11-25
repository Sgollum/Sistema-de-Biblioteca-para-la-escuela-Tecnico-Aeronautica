# backend/Biblioteca/urls.py

from django.contrib import admin
from django.urls import path, include
from django.conf import settings 
from django.conf.urls.static import static

# No necesitamos importar obtain_auth_token si usamos nuestra vista personalizada.

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # 🚨 CRÍTICO: Eliminamos la ruta de login estándar de DRF.
    #path('api/login/', obtain_auth_token, name='api_login'), 
    
    # Esta es ahora la única ruta de autenticación.
    # La vista MS_Usuarios.urls ya incluye 'login/' y 'register/'.
    path('api/usuarios/', include('MS_Usuarios.urls')),
    
    path('api/catalogo/', include('MS_Catalogo.urls')),
    path('api/prestamos/', include('MS_Prestamos.urls')),
    path('api/reportes/', include('MS_Reportes.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)