from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario
from .forms import UsuarioCreationForm, UsuarioChangeForm


class UsuarioAdmin(UserAdmin):
    # Formularios personalizados
    add_form = UsuarioCreationForm
    form = UsuarioChangeForm
    model = Usuario

    # Columnas que aparecen en el listado
    list_display = ('username', 'first_name', 'last_name', 'email', 'rol', 'is_staff')

    # Campos visibles al EDITAR un usuario
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Información Personal', {
            'fields': ('first_name', 'last_name', 'email', 'rol')
        }),
        ('Permisos', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
        ('Fechas importantes', {
            'fields': ('last_login', 'date_joined')
        }),
    )

    # Campos visibles al CREAR un usuario (Add User)
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'username',
                'first_name',
                'last_name',
                'email',
                'rol',
                'password1',
                'password2'
            )
        }),
    )

    search_fields = ('username', 'first_name', 'last_name', 'email')
    ordering = ('username',)
    filter_horizontal = ('groups', 'user_permissions',)


admin.site.register(Usuario, UsuarioAdmin)
