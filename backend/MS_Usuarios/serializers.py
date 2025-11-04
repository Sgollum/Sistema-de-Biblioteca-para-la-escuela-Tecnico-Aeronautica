# backend/MS_Usuarios/serializers.py

from rest_framework import serializers
from .models import Usuario

# Serializador para el modelo Usuario
class UsuarioSerializer(serializers.ModelSerializer):
    # Campos adicionales solo de lectura (opcional, pero útil)
    rol_display = serializers.CharField(source='get_rol_display', read_only=True)

    class Meta:
        model = Usuario
        # Incluye todos los campos excepto la contraseña para lectura
        fields = (
            'id', 'username', 'first_name', 'last_name', 'email', 
            'is_active', 'rol', 'rol_display', 'is_staff', 'is_superuser'
        )
        read_only_fields = ('is_active', 'is_staff', 'is_superuser', 'rol_display')

# Serializador para la creación/actualización que permite manejar la contraseña
class UsuarioCreateUpdateSerializer(UsuarioSerializer):
    # Hacemos que la contraseña sea campo de escritura
    password = serializers.CharField(write_only=True, required=False)

    class Meta(UsuarioSerializer.Meta):
        # Aseguramos que 'password' esté incluido en los campos
        fields = UsuarioSerializer.Meta.fields + ('password',)

    def create(self, validated_data):
        # Lógica para crear el usuario con la contraseña hasheada
        password = validated_data.pop('password', None)
        user = Usuario.objects.create(**validated_data)
        if password is not None:
            user.set_password(password)
            user.save()
        return user

    def update(self, instance, validated_data):
        # Lógica para actualizar el usuario y manejar la contraseña si se proporciona
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)
        if password is not None:
            user.set_password(password)
            user.save()
        return user