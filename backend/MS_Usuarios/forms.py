from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import Usuario

class UsuarioCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        # Asegúrate de incluir el campo 'rol' aquí para que aparezca al crear
        model = Usuario
        fields = ('username', 'email', 'rol') # Campos al crear

class UsuarioChangeForm(UserChangeForm):
    class Meta:
        # Asegúrate de incluir el campo 'rol' aquí para que aparezca al editar
        model = Usuario
        fields = ('username', 'email', 'first_name', 'last_name', 'rol') # Campos al editar