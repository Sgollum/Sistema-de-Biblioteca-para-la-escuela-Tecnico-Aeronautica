from rest_framework import viewsets, permissions, filters
from .models import Autor, Categoria, Libro
from .serializers import AutorSerializer, CategoriaSerializer, LibroSerializer
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly

# 1. AUTOR
class AutorViewSet(viewsets.ModelViewSet):
    queryset = Autor.objects.all().order_by('apellido', 'nombre')
    serializer_class = AutorSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

# 2. CATEGORÍA
class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all().order_by('nombre')
    serializer_class = CategoriaSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

# 3. LIBRO
class LibroViewSet(viewsets.ModelViewSet):
    queryset = Libro.objects.all().order_by('titulo')
    serializer_class = LibroSerializer
    permission_classes = [IsAuthenticated]

    # 🔥 Agregado para activar el buscador:
    filter_backends = [filters.SearchFilter]
    search_fields = [
        'titulo',
        'isbn',
        'autor__nombre',
        'autor__apellido',
        'categoria__nombre',
    ]
