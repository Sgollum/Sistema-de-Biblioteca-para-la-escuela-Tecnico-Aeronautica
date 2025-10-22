# MS_Usuarios/admin.py (VERSIÓN FINAL Y COMPLETA)

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin 
from .models import Usuario
# Debes tener un archivo forms.py con estos dos formularios:
from .forms import UsuarioCreationForm, UsuarioChangeForm 

@admin.register(Usuario)
class UsuarioAdmin(BaseUserAdmin): 
    
    form = UsuarioChangeForm
    add_form = UsuarioCreationForm
    
    # ACTIVAMOS EL list_display (Ahora debe funcionar con las columnas)
    list_display = ('username', 'email', 'first_name', 'last_name', 'rol', 'is_staff') 
    
    # RECONSTRUCCIÓN MANUAL DE FIELDSETS (Para editar un usuario existente)
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Información Personal', {'fields': ('first_name', 'last_name', 'email', 'rol')}),
        ('Permisos', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Fechas Importantes', {'fields': ('last_login', 'date_joined')}),
    )
    
    # RECONSTRUCCIÓN MANUAL DE ADD_FIELDSETS (Para crear un nuevo usuario)
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'rol', 'password', 'password2'),
        }),
    )
    
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups', 'rol')
    search_fields = ('username', 'first_name', 'last_name', 'email')
    ordering = ('username',)