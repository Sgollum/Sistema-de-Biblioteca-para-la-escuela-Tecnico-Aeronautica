# backend/MS_Catalogo/models.py
from django.db import models

# Modelo 1: Autor (Necesario para organizar y buscar)
class Autor(models.Model):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    
    class Meta:
        # 💡 Ajuste: Usar db_table explícitamente (ayuda en sistemas con múltiples BBDD)
        db_table = 'ms_catalogo_autor'
        
    def __str__(self):
        return f'{self.nombre} {self.apellido}'

# Modelo 2: Categoría/Género (Ficción, Ciencia, Historia, etc.)
class Categoria(models.Model):
    nombre = models.CharField(max_length=50, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    
    class Meta:
        # 💡 Ajuste: Usar db_table explícitamente
        db_table = 'ms_catalogo_categoria'

    def __str__(self):
        return self.nombre

# Modelo 3: Libro (El elemento principal del catálogo)
class Libro(models.Model):
    titulo = models.CharField(max_length=200)
    autor = models.ForeignKey(Autor, on_delete=models.CASCADE, related_name='libros')
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True, related_name='libros')
    
    # URL de la Imagen (CORRECTO: blank=True y null=True para la BBDD)
    imagen_url = models.CharField(
        max_length=500, 
        blank=True, 
        null=True, 
        # 💡 Ajuste: Cambiar el default a '/' si se sirve desde static/media, aunque 'assets/...' funciona en Angular.
        default='default_book.png'
    )
    
    isbn = models.CharField(max_length=13, unique=True)
    fecha_publicacion = models.DateField()
    
    ESTADO_CHOICES = [
        ('DISPONIBLE', 'Disponible para Préstamo'),
        ('PRESTADO', 'Actualmente Prestado'),
        ('REPARACION', 'En Reparación/Mantenimiento'),
    ]
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='DISPONIBLE')
    
    copias_totales = models.IntegerField(default=1)
    copias_disponibles = models.IntegerField(default=1)

    class Meta:
        # 💡 Ajuste: Usar db_table explícitamente. Este es el nombre que Django intenta usar en el error.
        db_table = 'ms_catalogo_libro'

    def save(self, *args, **kwargs):
        # Lógica de Validación (Correcta)
        if self.copias_disponibles > self.copias_totales:
            self.copias_disponibles = self.copias_totales
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.titulo