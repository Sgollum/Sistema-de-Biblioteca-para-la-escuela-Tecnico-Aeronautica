# Crud/admin.py (Ajuste Final)

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User # <-- Necesitas importar el modelo de usuario base
from .models import Usuario

# 1. DESREGISTRAR: Forzar a Django a olvidar el modelo de usuario genérico
try:
    admin.site.unregister(User)
except admin.sites.NotRegistered:
    pass # Si ya se desregistró, no hacemos nada

# 2. REGISTRAR: Ahora registramos nuestro modelo personalizado
@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    # Ya tenías esto, que añade el campo 'rol' a la lista
    list_display = ('username', 'email', 'first_name', 'last_name', 'rol', 'is_staff') 
    
    # Ya tenías esto, que añade el campo 'rol' al formulario de edición
    fieldsets = UserAdmin.fieldsets + (
        ('Información de Rol', {'fields': ('rol',)}), 
    )