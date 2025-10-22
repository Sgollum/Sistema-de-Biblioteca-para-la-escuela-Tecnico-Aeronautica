# Biblioteca/urls.py

from django.contrib import admin
from django.urls import path, include 
# Asegúrate de que los import 'path' e 'include' estén presentes

urlpatterns = [
    # Ruta del Panel de Administración (ya validada)
    path('admin/', admin.site.urls), 

    # 1. Microservicio de Usuarios (Autenticación, Roles, CRUD de Usuarios)
    path('api/usuarios/', include('MS_Usuarios.urls')),

    # 2. Microservicio de Catálogo (Gestión de Libros)
    path('api/catalogo/', include('MS_Catalogo.urls')),

    # 3. Microservicio de Préstamos
    path('api/prestamos/', include('MS_Prestamos.urls')),

    # 4. Microservicio de Reportes
    path('api/reportes/', include('MS_Reportes.urls')),
]