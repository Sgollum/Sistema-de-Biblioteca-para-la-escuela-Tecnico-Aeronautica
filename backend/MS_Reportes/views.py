from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from datetime import date
from django.db.models import F # Para operaciones de base de datos

# Importaciones de los microservicios vecinos

# CORRECCIÓN DE IMPORACIÓN: Se separan el Modelo (models) y el Serializer (serializers)
# ------------------------------------------------------------------------------------
from MS_Catalogo.models import Libro
from MS_Catalogo.serializers import LibroSerializer 
# ------------------------------------------------------------------------------------

# Asumiendo que Prestamo y PrestamoSerializer están en sus respectivos archivos dentro de MS_Prestamos
from MS_Prestamos.models import Prestamo 
from MS_Prestamos.models import Prestamo, PrestamoSerializer


# --- Endpoints de Reportes ---

# [1] REPORTE DE LIBROS CON BAJO STOCK (GET /api/reportes/bajo-stock/)
@api_view(['GET'])
@permission_classes([IsAdminUser]) # Solo usuarios administradores pueden ver este reporte
def report_bajo_stock(request):
    """
    Lista todos los libros cuya cantidad de copias disponibles es menor o igual 
    al 10% del total de copias.
    """
    
    # Filtramos los libros donde (copias_disponibles * 10) <= copias_totales
    # Esto es equivalente a: copias_disponibles <= copias_totales / 10
    
    libros_bajo_stock = Libro.objects.annotate(
        # Añadimos un campo temporal que calcula 10 veces el stock disponible
        diez_veces_disponible=F('copias_disponibles') * 10
    ).filter(
        # Comparamos ese campo con el total (F() permite comparar campos)
        diez_veces_disponible__lte=F('copias_totales')
    ).order_by('-copias_disponibles', 'titulo') # Ordenamos por el stock más bajo
    
    # Usamos el serializer de Libro para formatear la salida
    serializer = LibroSerializer(libros_bajo_stock, many=True)
    
    if not libros_bajo_stock.exists():
        return Response({"message": "Todos los libros tienen un stock adecuado (más del 10% disponible).", "data": []}, 
                         status=status.HTTP_200_OK)
                        
    return Response(serializer.data, status=status.HTTP_200_OK)


# [2] REPORTE DE PRÉSTAMOS VENCIDOS (GET /api/reportes/vencidos/)
@api_view(['GET'])
@permission_classes([IsAdminUser]) # Solo administradores
def report_prestamos_vencidos(request):
    """
    Lista todos los préstamos que están activos pero cuya fecha de devolución esperada 
    es anterior o igual a la fecha actual.
    """
    
    # 1. Filtramos: Activos (esta_activo=True)
    # 2. Filtramos: Vencidos (fecha_devolucion_esperada <= hoy)
    hoy = date.today()
    
    prestamos_vencidos = Prestamo.objects.select_related('libro').filter(
        esta_activo=True,
        fecha_devolucion_esperada__lte=hoy
    ).order_by('fecha_devolucion_esperada') # Ordenamos por el vencimiento más antiguo

    # Usamos el serializer de Prestamo para formatear la salida
    serializer = PrestamoSerializer(prestamos_vencidos, many=True)
    
    if not prestamos_vencidos.exists():
        return Response({"message": "¡No hay préstamos vencidos! La gestión es excelente.", "data": []}, 
                         status=status.HTTP_200_OK)
                        
    return Response(serializer.data, status=status.HTTP_200_OK)


# [3] REPORTE DE PRÉSTAMOS ACTIVOS (GET /api/reportes/activos/)
@api_view(['GET'])
@permission_classes([IsAdminUser]) # Solo administradores
def report_prestamos_activos(request):
    """
    Lista todos los préstamos que están actualmente activos (no devueltos).
    """
    
    # Filtramos: Activos (esta_activo=True)
    prestamos_activos = Prestamo.objects.select_related('libro').filter(
        esta_activo=True
    ).order_by('fecha_devolucion_esperada') # Ordenados por fecha de vencimiento más próxima

    # Usamos el serializer de Prestamo para formatear la salida
    serializer = PrestamoSerializer(prestamos_activos, many=True)
    
    if not prestamos_activos.exists():
        return Response({"message": "Actualmente no hay libros prestados.", "data": []}, 
                         status=status.HTTP_200_OK)
                        
    return Response(serializer.data, status=status.HTTP_200_OK)