from rest_framework import serializers
from .models import Prestamo

class PrestamoSerializer(serializers.ModelSerializer):
    lector_nombre = serializers.CharField(source="lector.username", read_only=True)
    libro_titulo = serializers.CharField(source="libro.titulo", read_only=True)

    class Meta:
        model = Prestamo
        fields = '__all__'
