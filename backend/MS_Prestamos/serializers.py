# MS_Prestamos/serializers.py
from rest_framework import serializers
from .models import Prestamo
from MS_Usuarios.models import Usuario
from MS_Catalogo.models import Libro


class PrestamoSerializer(serializers.ModelSerializer):
    lector_nombre = serializers.SerializerMethodField()
    libro_titulo = serializers.SerializerMethodField()

    class Meta:
        model = Prestamo
        fields = [
            "id",
            "lector_id",
            "libro_id",
            "fecha_prestamo",
            "fecha_devolucion_esperada",
            "estado",
            "esta_activo",
            "lector_nombre",
            "libro_titulo",
        ]

    def get_lector_nombre(self, obj):
        try:
            usuario = Usuario.objects.get(id=obj.lector_id)
            # Ajusta estos campos a los de tu modelo Usuario
            return f"{usuario.first_name} {usuario.last_name}".strip() or usuario.username
        except Usuario.DoesNotExist:
            return f"Lector {obj.lector_id}"

    def get_libro_titulo(self, obj):
        try:
            libro = Libro.objects.get(id=obj.libro_id)
            return libro.titulo
        except Libro.DoesNotExist:
            return f"Libro {obj.libro_id}"
