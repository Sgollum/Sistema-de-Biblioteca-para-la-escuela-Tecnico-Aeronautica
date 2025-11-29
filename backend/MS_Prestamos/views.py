from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from datetime import date, timedelta

# Importamos los modelos y serializers que acabamos de definir en models.py
from .models import Prestamo, PrestamoSerializer, RegistroPrestamoSerializer

# Importamos el modelo Libro desde el Catalogo para actualizar el stock.
# ¡Recuerda, esta importación directa debe ser correcta!
from MS_Catalogo.models import Libro 

# --- Funciones Utilitarias ---

def _actualizar_stock_libro(libro_id, cambio):
    """
    Función helper: Actualiza copias_disponibles en el modelo Libro.
    'cambio' puede ser -1 (prestar) o +1 (devolver).
    """
    try:
        libro = Libro.objects.get(pk=libro_id)
        
        # Validación: No permitir stock negativo
        if libro.copias_disponibles + cambio < 0:
            return False, "No hay suficientes copias disponibles para prestar."
        
        # Si es una devolución, no aumentamos el stock si ya está al máximo (opcional)
        if cambio > 0 and libro.copias_disponibles >= libro.copias_totales:
            return False, "Error: El número de copias disponibles ya es igual al total."
        
        libro.copias_disponibles += cambio
        libro.save()
        return True, None
    except Libro.DoesNotExist:
        return False, "Libro no encontrado en el catálogo."


# --- Endpoints de la API ---

# [1] REGISTRAR NUEVO PRÉSTAMO (POST /api/prestamos/registrar/)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def registrar_prestamo(request):
    """
    Registra un nuevo préstamo, reduce el stock y establece la fecha de devolución.
    Solo usuarios autenticados pueden usar este endpoint.
    """
    # Usamos el serializer de entrada para validar los datos
    serializer = RegistroPrestamoSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    data = serializer.validated_data
    libro_obj = data['libro']
    lector_id = data['lector_id']
    dias_prestamo = data['dias_prestamo']
    
    # 1. Verificar disponibilidad y actualizar stock (cambio = -1)
    exito, mensaje = _actualizar_stock_libro(libro_obj.pk, -1)
    if not exito:
        return Response({"error": mensaje}, status=status.HTTP_400_BAD_REQUEST)

    # 2. Calcular fecha de devolución
    fecha_devolucion = date.today() + timedelta(days=dias_prestamo)

    # 3. Crear el objeto Prestamo
    prestamo = Prestamo.objects.create(
        libro=libro_obj,
        lector_id=lector_id,
        fecha_devolucion_esperada=fecha_devolucion,
        esta_activo=True
    )
    
    return Response(PrestamoSerializer(prestamo).data, status=status.HTTP_201_CREATED)


# [2] REGISTRAR DEVOLUCIÓN (POST /api/prestamos/devolver/<int:prestamo_id>/)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def registrar_devolucion(request, prestamo_id):
    """
    Marca un préstamo específico como inactivo (devuelto) y aumenta el stock del libro.
    """
    try:
        # Solo buscamos préstamos que estén activos
        prestamo = Prestamo.objects.get(pk=prestamo_id, esta_activo=True)
    except Prestamo.DoesNotExist:
        return Response({"error": "Préstamo activo no encontrado."}, status=status.HTTP_404_NOT_FOUND)

    # 1. Marcar préstamo como devuelto
    prestamo.esta_activo = False
    prestamo.save()

    # 2. Aumentar stock del libro (cambio = +1)
    exito, mensaje = _actualizar_stock_libro(prestamo.libro.pk, 1)
    
    if not exito:
        # Si el stock no se pudo aumentar (ej. libro borrado), se devuelve una advertencia, 
        # pero el préstamo ya fue marcado como devuelto.
        return Response({"message": "Devolución registrada con éxito, pero hubo un error al actualizar el stock del libro.", "warning": mensaje}, 
                        status=status.HTTP_200_OK)

    return Response({"message": "Devolución registrada con éxito."}, status=status.HTTP_200_OK)


# [3] LISTAR PRÉSTAMOS (GET /api/prestamos/listar/?estado=activo)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listar_prestamos(request):
    """
    Lista todos los préstamos. Se puede filtrar por 'estado' ('activo' o 'inactivo').
    """
    estado = request.query_params.get('estado', 'activo') # Por defecto, lista activos
    
    if estado == 'activo':
        # Préstamos activos ordenados por la fecha de vencimiento más cercana
        prestamos = Prestamo.objects.filter(esta_activo=True).order_by('fecha_devolucion_esperada')
    elif estado == 'inactivo':
        # Préstamos inactivos (historial) ordenados por la fecha de devolución
        prestamos = Prestamo.objects.filter(esta_activo=False).order_by('-fecha_prestamo')
    else:
        return Response({"error": "Parámetro 'estado' no válido. Use 'activo' o 'inactivo'."}, 
                        status=status.HTTP_400_BAD_REQUEST)
        
    serializer = PrestamoSerializer(prestamos, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)