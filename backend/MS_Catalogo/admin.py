# backend/MS_Catalogo/admin.py
from django.contrib import admin
from .models import Autor, Categoria, Libro

# 1. Clase de Administración para Libro
@admin.register(Libro)
class LibroAdmin(admin.ModelAdmin):
    # Campos que se muestran en la lista de Libros (vista de tabla)
    list_display = (
        'titulo', 
        'autor', 
        'categoria', 
        'isbn', 
        'copias_disponibles', 
        'estado'
        # IMPORTANTE: NO LISTAMOS 'imagen_url' aquí para evitar problemas en la tabla de resumen.
    )
    
    # Campos que se pueden filtrar
    list_filter = ('categoria', 'autor', 'estado')
    
    # Campos que se pueden buscar
    search_fields = ('titulo', 'isbn', 'autor__nombre', 'autor__apellido')
    
    # Orden de los campos en el formulario de edición
    fields = (
        'titulo', 
        ('autor', 'categoria'), 
        'imagen_url', # Aquí debe ir el nuevo campo de imagen
        'isbn', 
        'fecha_publicacion', 
        'estado', 
        ('copias_totales', 'copias_disponibles')
    )

# 2. Clase de Administración para Autor
@admin.register(Autor)
class AutorAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'apellido', 'fecha_nacimiento')
    search_fields = ('nombre', 'apellido')

# 3. Clase de Administración para Categoria
@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nombre',)
    search_fields = ('nombre',)

# Eliminamos los registros simples anteriores, ya que usamos @admin.register