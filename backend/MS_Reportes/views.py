from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from datetime import date
from django.db.models import F

# Importaciones correctas
from MS_Catalogo.models import Libro
from MS_Catalogo.serializers import LibroSerializer

# --- IMPORTACIÓN 100% CORRECTA ---
from MS_Prestamos.models import Prestamo
from MS_Prestamos.serializers import PrestamoSerializer
# ---------------------------------

# ====================================================================
#   1) REPORTE: LIBROS CON BAJO STOCK
# ====================================================================
@api_view(['GET'])
@permission_classes([IsAdminUser])
def report_bajo_stock(request):
    """
    Devuelve libros con stock crítico (<= 10% del total).
    """
    libros_bajo_stock = Libro.objects.annotate(
        diez_veces_disponible=F('copias_disponibles') * 10
    ).filter(
        diez_veces_disponible__lte=F('copias_totales')
    ).order_by('copias_disponibles')

    serializer = LibroSerializer(libros_bajo_stock, many=True)

    if not libros_bajo_stock.exists():
        return Response(
            {"message": "No hay libros con bajo stock.", "data": []},
            status=status.HTTP_200_OK
        )

    return Response(serializer.data, status=status.HTTP_200_OK)


# ====================================================================
#   2) REPORTE: PRÉSTAMOS VENCIDOS
# ====================================================================
@api_view(['GET'])
@permission_classes([IsAdminUser])
def report_prestamos_vencidos(request):
    """
    Devuelve los préstamos activos cuya fecha límite ya pasó.
    """
    hoy = date.today()

    prestamos_vencidos = Prestamo.objects.select_related('libro').filter(
        esta_activo=True,
        fecha_devolucion_esperada__lte=hoy
    ).order_by('fecha_devolucion_esperada')

    serializer = PrestamoSerializer(prestamos_vencidos, many=True)

    if not prestamos_vencidos.exists():
        return Response(
            {"message": "No hay préstamos vencidos.", "data": []},
            status=status.HTTP_200_OK
        )

    return Response(serializer.data, status=status.HTTP_200_OK)


# ====================================================================
#   3) REPORTE: PRÉSTAMOS ACTIVOS
# ====================================================================
@api_view(['GET'])
@permission_classes([IsAdminUser])
def report_prestamos_activos(request):
    """
    Devuelve los préstamos vigentes.
    """
    prestamos_activos = Prestamo.objects.select_related('libro').filter(
        esta_activo=True
    ).order_by('fecha_devolucion_esperada')

    serializer = PrestamoSerializer(prestamos_activos, many=True)

    if not prestamos_activos.exists():
        return Response(
            {"message": "No hay préstamos activos.", "data": []},
            status=status.HTTP_200_OK
        )

    return Response(serializer.data, status=status.HTTP_200_OK)
