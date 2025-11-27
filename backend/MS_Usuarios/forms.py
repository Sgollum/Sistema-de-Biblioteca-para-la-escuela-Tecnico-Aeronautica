from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import Usuario

# Formulario de CREACIÓN
class UsuarioCreationForm(UserCreationForm):
    # La corrección clave es heredar de UserCreationForm.Meta y 
    # concatenar los campos, asegurando que 'rol' se procese correctamente.
    class Meta(UserCreationForm.Meta):
        model = Usuario
        
        # Combinamos los campos base de autenticación con nuestros campos custom.
        # Esto incluye los campos 'password', 'password2' de forma implícita.
        fields = UserCreationForm.Meta.fields + ('rol', 'first_name', 'last_name', 'email')

        labels = {
            'username': 'Nombre de usuario',
            'first_name': 'Nombre',
            'last_name': 'Apellido',
            'email': 'Correo electrónico',
            'rol': 'Rol del usuario',
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Campos obligatorios (se mantienen bien)
        self.fields['first_name'].required = True
        self.fields['last_name'].required = True
        self.fields['email'].required = True
        self.fields['rol'].required = True


# Formulario de EDICIÓN
class UsuarioChangeForm(UserChangeForm):
    class Meta:
        model = Usuario
        # Estos campos estaban correctos ya que UserChangeForm es más flexible.
        fields = (
            'username',
            'first_name',
            'last_name',
            'email',
            'rol',
            'is_active',
            'is_staff',
            'is_superuser',
            'groups',
            'user_permissions',
        )

        labels = {
            'username': 'Nombre de usuario',
            'first_name': 'Nombre',
            'last_name': 'Apellido',
            'email': 'Correo electrónico',
            'rol': 'Rol del usuario',
        }