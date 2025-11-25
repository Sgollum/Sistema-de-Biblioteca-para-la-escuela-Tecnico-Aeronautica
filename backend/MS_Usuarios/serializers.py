from rest_framework import serializers
from django.contrib.auth.models import Group
from django.db import IntegrityError
from .models import Usuario


# ======================================================
#   SERIALIZER GENERAL: PERFIL Y CRUD
# ======================================================
class UserSerializer(serializers.ModelSerializer):
    rol = serializers.SerializerMethodField()

    class Meta:
        model = Usuario
        fields = (
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'rol',
            'password',
            'is_active',
            'last_login',
            'date_joined'
        )
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
            'is_active': {'required': False},
        }

    def get_rol(self, obj):
        if obj.is_superuser:
            return "admin"

        role_map = {
            'ADMIN': "admin",
            'BIBLIOTECARIO': "bibliotecario",
            'LECTOR': "lector",
        }
        return role_map.get(obj.rol, "lector")

    def update(self, instance, validated_data):
        # Si viene nueva password → hashear
        if 'password' in validated_data:
            instance.set_password(validated_data['password'])
            validated_data.pop('password')

        return super().update(instance, validated_data)



# ======================================================
#   SERIALIZER DE REGISTRO (USUARIO NORMAL)
#   /api/usuarios/register/
# ======================================================
class RegisterSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = Usuario
        fields = (
            'username',
            'email',
            'first_name',
            'last_name',
            'password1',
            'password2'
        )

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError(
                {"password": "Las contraseñas no coinciden."}
            )
        return data

    def create(self, validated_data):
        password = validated_data.pop('password1')
        validated_data.pop('password2')

        try:
            # Crear usuario lector
            user = Usuario.objects.create_user(
                password=password,
                rol='LECTOR',
                **validated_data
            )

            # Asignar grupo lector si existe
            try:
                lector_group = Group.objects.get(name="lector")
                user.groups.add(lector_group)
            except Group.DoesNotExist:
                pass

            return user

        except IntegrityError:
            raise serializers.ValidationError(
                {"detail": "El nombre de usuario o correo ya están en uso."}
            )
