# backend/MS_Usuarios/backends.py
from django.contrib.auth.backends import ModelBackend
from django.db.models import Q
from django.contrib.auth import get_user_model

Usuario = get_user_model()

class UsernameOrEmailBackend(ModelBackend):
    """
    Permite la autenticación con nombre de usuario O con dirección de correo electrónico.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        
        try:
            # Búsqueda por username O email (sin distinción de mayúsculas/minúsculas)
            user = Usuario.objects.get(
                Q(username__iexact=username) | Q(email__iexact=username)
            )
        except Usuario.DoesNotExist:
            return None

        # Verificamos la contraseña
        if user.check_password(password) and self.user_can_authenticate(user):
            return user
        
        return None

    def get_user(self, user_id):
        try:
            return Usuario.objects.get(pk=user_id)
        except Usuario.DoesNotExist:
            return None