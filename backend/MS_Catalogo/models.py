# backend/MS_Catalogo/models.py
from django.db import models

# Modelo 1: Autor (Necesario para organizar y buscar)
class Autor(models.Model):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    # Se añade una fecha de nacimiento como dato de referencia
    fecha_nacimiento = models.DateField(null=True, blank=True)
    
    def __str__(self):
        return f'{self.nombre} {self.apellido}'

# Modelo 2: Categoría/Género (Ficción, Ciencia, Historia, etc.)
class Categoria(models.Model):
    nombre = models.CharField(max_length=50, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.nombre

# Modelo 3: Libro (El elemento principal del catálogo)
class Libro(models.Model):
    titulo = models.CharField(max_length=200)
    # Llaves foráneas a los modelos creados arriba
    autor = models.ForeignKey(Autor, on_delete=models.CASCADE, related_name='libros')
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True, related_name='libros')
    
    # Datos de inventario
    isbn = models.CharField(max_length=13, unique=True)
    fecha_publicacion = models.DateField()
    
    # Estado del libro para el préstamo
    ESTADO_CHOICES = [
        ('DISPONIBLE', 'Disponible para Préstamo'),
        ('PRESTADO', 'Actualmente Prestado'),
        ('REPARACION', 'En Reparación/Mantenimiento'),
    ]
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='DISPONIBLE')
    
    # Conteo de copias
    copias_totales = models.IntegerField(default=1)
    copias_disponibles = models.IntegerField(default=1)

    def save(self, *args, **kwargs):
        # Asegura que las copias disponibles no excedan el total al guardar
        if self.copias_disponibles > self.copias_totales:
            self.copias_disponibles = self.copias_totales
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.titulo