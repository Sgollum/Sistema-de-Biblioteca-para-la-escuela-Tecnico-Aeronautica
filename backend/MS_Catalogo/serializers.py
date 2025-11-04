# backend/MS_Catalogo/serializers.py
from rest_framework import serializers
from .models import Autor, Categoria, Libro

# 1. Serializador para Autor
class AutorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Autor
        fields = '__all__'

# 2. Serializador para Categoría
class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

# 3. Serializador para Libro (con datos anidados de Autor/Categoría)
class LibroSerializer(serializers.ModelSerializer):
    # Campos de solo lectura para mostrar el nombre completo en lugar de solo la ID
    autor_nombre = serializers.SerializerMethodField()
    categoria_nombre = serializers.ReadOnlyField(source='categoria.nombre')

    class Meta:
        model = Libro
        fields = [
            'id', 'titulo', 'autor', 'autor_nombre', 'categoria', 
            'categoria_nombre', 'isbn', 'fecha_publicacion', 
            'estado', 'copias_totales', 'copias_disponibles'
        ]
        
    def get_autor_nombre(self, obj):
        # Combina el nombre y apellido del autor
        return f'{obj.autor.nombre} {obj.autor.apellido}'