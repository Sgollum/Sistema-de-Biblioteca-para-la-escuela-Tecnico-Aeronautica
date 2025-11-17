from rest_framework import serializers
from django.contrib.auth.models import Group 
from .models import Usuario, RolUsuario 
from django.db import IntegrityError 

# 🌟 SERIALIZER PARA DEVOLVER LA INFORMACIÓN DEL USUARIO LOGUEADO (/api/usuarios/me/)
class UserSerializer(serializers.ModelSerializer):
    # Campo calculado para devolver el rol en el formato que Angular espera (minúsculas)
    rol = serializers.SerializerMethodField()

    class Meta:
        model = Usuario
        # Incluimos 'nombre' y los campos de identificación
        fields = ('id', 'email', 'nombre', 'rol') 
        read_only_fields = ('id', 'email', 'nombre', 'rol')

    def get_rol(self, obj):
        # *** LÓGICA DE DETERMINACIÓN DE ROL ***
        
        # 1. Chequeo de Administrador (Máxima prioridad)
        if obj.is_superuser:
            return 'admin' 
        
        # 2. Chequeo de Grupo Específico (Bibliotecario)
        # Si pertenece al grupo 'bibliotecario', devolvemos 'biblio' para Angular.
        if obj.groups.filter(name='bibliotecario').exists():
            return 'biblio' 
        
        # 3. Chequeo de Grupo Específico (Lector)
        if obj.groups.filter(name='lector').exists():
            return 'lector'
        
        # 4. Fallback: Si no tiene un grupo, usamos el valor del campo 'rol' (BIBLIO/LECTOR) del modelo en minúsculas.
        return obj.rol.lower() 

# 🌟 SERIALIZER PARA EL REGISTRO (SIN CAMBIOS RESPECTO AL ANTERIOR)
class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = Usuario
        fields = ('email', 'nombre', 'username', 'password', 'password2') 
        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'required': True, 'allow_blank': False} 
        }

    def validate(self, data):
        password = data.get('password')
        password2 = data.pop('password2') 
        
        if password != password2:
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden."})
            
        return data

    def create(self, validated_data):
        try:
            password = validated_data.pop('password')
            username = validated_data.pop('username')
            email = validated_data.pop('email')
            nombre = validated_data.pop('nombre')

            user = Usuario.objects.create_user(
                username=username,
                email=email,
                password=password,
                nombre=nombre,
                rol=RolUsuario.LECTOR # Asignamos LECTOR por defecto
            )
            
            lector_group = Group.objects.get(name='lector')
            user.groups.add(lector_group)

            user.save()
            return user
        
        except IntegrityError:
            raise serializers.ValidationError({
                "detail": "El nombre de usuario o correo ya están en uso."
            })
        except Group.DoesNotExist:
            raise serializers.ValidationError({
                "detail": "Advertencia interna: El grupo 'lector' no existe en Django. Por favor, créelo."
            })
        except Exception as e:
             raise serializers.ValidationError({"detail": f"Error desconocido en la creación de usuario: {e}"})