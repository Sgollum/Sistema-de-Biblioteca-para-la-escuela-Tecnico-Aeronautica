from django.db import models
from rest_framework import serializers
from datetime import date, timedelta

# Importamos el modelo Libro desde el Catalogo. 
# NOTA: En la arquitectura de microservicios, esta importación directa 
# rompe el aislamiento. Lo hacemos solo por la necesidad de tiempo y simplicidad.
from MS_Catalogo.models import Libro 

# ----------------------------------------------------------------------
# 1. MODELO DE PRÉSTAMO
# ----------------------------------------------------------------------

class Prestamo(models.Model):
    # Relación con el Libro. Al prestar, reduce copias_disponibles.
    libro = models.ForeignKey(Libro, on_delete=models.PROTECT, verbose_name="Libro Prestado")
    
    # Usuario (Lector): Usamos IntegerField para almacenar solo el ID del Lector/Usuario.
    lector_id = models.IntegerField(verbose_name="ID del Lector") 
    
    fecha_prestamo = models.DateField(auto_now_add=True, verbose_name="Fecha de Préstamo")
    fecha_devolucion_esperada = models.DateField(verbose_name="Devolución Esperada")
    
    # Estado: True = Prestado (Activo), False = Devuelto (Inactivo)
    esta_activo = models.BooleanField(default=True, verbose_name="Préstamo Activo") 

    class Meta:
        verbose_name = "Préstamo"
        verbose_name_plural = "Préstamos"
        ordering = ['-fecha_prestamo']

    def __str__(self):
        return f"Préstamo: {self.libro.titulo} (Lector ID: {self.lector_id})"

# ----------------------------------------------------------------------
# 2. SERIALIZERS
# ----------------------------------------------------------------------

# Serializer para datos de SALIDA (GET)
class PrestamoSerializer(serializers.ModelSerializer):
    # Campo de solo lectura para mostrar el título en la respuesta de la API.
    titulo_libro = serializers.CharField(source='libro.titulo', read_only=True)
    
    class Meta:
        model = Prestamo
        fields = ['id', 'libro', 'titulo_libro', 'lector_id', 'fecha_prestamo', 
                  'fecha_devolucion_esperada', 'esta_activo']

# Serializer para datos de ENTRADA (POST para registrar un nuevo préstamo)
class RegistroPrestamoSerializer(serializers.Serializer):
    # Usa PrimaryKeyRelatedField para que Django valide que el Libro existe.
    libro = serializers.PrimaryKeyRelatedField(
        queryset=Libro.objects.all(), 
        help_text="ID del libro a prestar."
    )
    lector_id = serializers.IntegerField(
        help_text="ID del usuario (lector) que realiza el préstamo."
    )
    dias_prestamo = serializers.IntegerField(
        min_value=1, 
        max_value=30, 
        help_text="Número de días del préstamo (ej: 7, 14, 30)."
    )