# backend/MS_Catalogo/views.py

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Autor, Categoria, Libro
from .serializers import AutorSerializer, CategoriaSerializer, LibroSerializer
from django.db.models import Q # Necesario para la búsqueda avanzada de libros

# ViewSet para Autor (Rutas: /api/catalogo/autores/)
class AutorViewSet(viewsets.ModelViewSet):
    # 💡 ATRIBUTOS MÍNIMOS REQUERIDOS
    queryset = Autor.objects.all()
    serializer_class = AutorSerializer
    permission_classes = [IsAuthenticated] 

# ViewSet para Categoría (Rutas: /api/catalogo/categorias/)
class CategoriaViewSet(viewsets.ModelViewSet):
    # 💡 ATRIBUTOS MÍNIMOS REQUERIDOS
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [IsAuthenticated] 

# ViewSet para Libro (Rutas: /api/catalogo/libros/)
class LibroViewSet(viewsets.ModelViewSet):
    # 💡 ATRIBUTOS MÍNIMOS REQUERIDOS
    queryset = Libro.objects.all()
    serializer_class = LibroSerializer
    permission_classes = [IsAuthenticated] 

    # Opcional: Permite la búsqueda por título, autor o ISBN
    def get_queryset(self):
        queryset = super().get_queryset()
        search_query = self.request.query_params.get('search', None)
        
        if search_query is not None:
            # Filtra por título, nombre de autor, apellido de autor o ISBN
            queryset = queryset.filter(
                Q(titulo__icontains=search_query) |
                Q(autor__nombre__icontains=search_query) |
                Q(autor__apellido__icontains=search_query) |
                Q(isbn__exact=search_query)
            )
        return queryset