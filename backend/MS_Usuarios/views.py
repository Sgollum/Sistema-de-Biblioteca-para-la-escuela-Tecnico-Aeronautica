from rest_framework import generics, permissions, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate 
from django.contrib.auth import get_user_model

from .serializers import RegisterSerializer, UserSerializer

Usuario = get_user_model()


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all().order_by('id')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]
    
    # --- CAMBIO CLAVE PARA OBTENER EL CONTEO DIRECTO ---
    # Al obtener la lista (GET /api/usuarios/), forzamos a que solo se devuelva
    # la lista de objetos, no el objeto paginado con "count".
    # Esto activará la lógica de conteo de tu frontend 'response.length'.
    pagination_class = None # <--- ¡ESTO ES LO QUE NECESITAS AÑADIR/MODIFICAR!
    # --------------------------------------------------

    # Sobreescribimos list para retornar solo la cuenta si se pide explícitamente,
    # pero para simplicidad, solo deshabilitaremos la paginación.
    # def list(self, request, *args, **kwargs):
    #     if 'count' in request.query_params:
    #         return Response({'total': self.get_queryset().count()})
    #     return super().list(request, *args, **kwargs)


class UserProfileView(generics.RetrieveAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class RegisterUserView(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        identifier = request.data.get("identifier")
        password = request.data.get("password")

        if not identifier or not password:
            return Response({"error": "Faltan el identificador o la contraseña."}, status=400)

        # 🚨 CORRECCIÓN CLAVE: Pasamos el 'identifier' como 'username' a authenticate.
        # Esto permite que el backend personalizado lo busque por email o username.
        user = authenticate(request=request, username=identifier, password=password) 

        if user is None:
            # Si falla, devolvemos el 401 Unauthorized
            return Response({"error": "Credenciales inválidas. Verifica tu usuario/correo y contraseña."}, status=401)
        
        if not user.is_active:
            return Response({"error": "Cuenta de usuario inactiva."}, status=401)

        # Obtener o crear el token de autenticación
        token, _ = Token.objects.get_or_create(user=user)

        # Retornamos el token y el rol
        return Response({
            "token": token.key,
            "rol": user.rol 
        }, status=200)