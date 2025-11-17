# RUTA COMENTADA: backend/MS_Usuarios/views.py
from rest_framework import generics, permissions
# Importamos AMBOS serializers
from .serializers import RegisterSerializer, UserSerializer 
from .models import Usuario 

# 🌟 NUEVA CLASE PARA OBTENER EL PERFIL DEL USUARIO LOGUEADO (/api/usuarios/me/)
class UserProfileView(generics.RetrieveAPIView):
    """
    Vista que devuelve la información del usuario actualmente autenticado (incluyendo el rol).
    Requiere autenticación (IsAuthenticated).
    """
    serializer_class = UserSerializer
    # Solo los usuarios autenticados pueden acceder
    permission_classes = (permissions.IsAuthenticated,) 

    # Sobreescribimos el método para devolver el usuario que está haciendo la petición
    def get_object(self):
        # self.request.user contiene el objeto Usuario autenticado por Token
        return self.request.user

# 🌟 CLASE PARA EL REGISTRO (EXISTENTE)
class RegisterUserView(generics.CreateAPIView):
    """
    Vista que maneja la creación de nuevos usuarios.
    """
    queryset = Usuario.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = (permissions.AllowAny,)


