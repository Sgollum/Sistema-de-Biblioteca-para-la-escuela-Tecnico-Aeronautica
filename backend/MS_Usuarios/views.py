# backend/MS_Usuarios/views.py

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Usuario
from .serializers import UsuarioSerializer, UsuarioCreateUpdateSerializer # <-- Importar ambos

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all().order_by('username')
    permission_classes = [IsAuthenticated]

    # Sobrescribir get_serializer_class para usar el serializador de creación/actualización 
    # en las operaciones que lo requieren, y el serializador normal para las otras.
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return UsuarioCreateUpdateSerializer
        return UsuarioSerializer
