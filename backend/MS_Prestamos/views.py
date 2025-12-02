from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Prestamo
from .serializers import PrestamoSerializer
from MS_Catalogo.models import Libro


class CrearPrestamoView(generics.CreateAPIView):
    serializer_class = PrestamoSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        lector_id = request.data.get("lector_id")
        libro_id = request.data.get("libro_id")

        if not lector_id or not libro_id:
            return Response({"error": "Datos incompletos"}, status=400)

        try:
            libro = Libro.objects.get(id=libro_id)
        except Libro.DoesNotExist:
            return Response({"error": "Libro no encontrado"}, status=404)

        if libro.copias_disponibles <= 0:
            return Response({"error": "Sin stock"}, status=400)

        prestamo = Prestamo.objects.create(
            lector_id=lector_id,
            libro_id=libro_id,
            estado="pendiente"
        )

        return Response(PrestamoSerializer(prestamo).data, status=201)


class ListaPendientesView(generics.ListAPIView):
    """
    Usada por el panel del bibliotecario.
    Devuelve TODOS los préstamos (no solo pendientes), para poder sacar métricas.
    """
    serializer_class = PrestamoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Prestamo.objects.all().order_by('-fecha_prestamo')


class AceptarPrestamoView(generics.UpdateAPIView):
    queryset = Prestamo.objects.all()
    serializer_class = PrestamoSerializer
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            prestamo = Prestamo.objects.get(id=pk)
        except Prestamo.DoesNotExist:
            return Response({"error": "Préstamo no encontrado"}, status=404)

        try:
            libro = Libro.objects.get(id=prestamo.libro_id)
        except Libro.DoesNotExist:
            return Response({"error": "Libro no encontrado"}, status=404)

        if libro.copias_disponibles <= 0:
            return Response({"error": "Sin stock"}, status=400)

        libro.copias_disponibles -= 1
        libro.save()

        prestamo.estado = "listo"
        prestamo.save()

        return Response(PrestamoSerializer(prestamo).data)


class RechazarPrestamoView(generics.UpdateAPIView):
    queryset = Prestamo.objects.all()
    serializer_class = PrestamoSerializer
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            prestamo = Prestamo.objects.get(id=pk)
        except Prestamo.DoesNotExist:
            return Response({"error": "Préstamo no encontrado"}, status=404)

        prestamo.estado = "rechazado"
        prestamo.save()
        return Response(PrestamoSerializer(prestamo).data)


# 🔹 NUEVO: Préstamos activos del lector autenticado
class MisPrestamosActivosView(generics.ListAPIView):
    """
    Devuelve los préstamos activos del usuario logueado:
    - pendiente
    - listo
    - prestado
    (esta_activo=True)
    """
    serializer_class = PrestamoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Prestamo.objects.filter(
            lector_id=user.id,
            estado__in=["pendiente", "listo", "prestado"],
            esta_activo=True
        ).order_by('-fecha_prestamo')


# 🔹 NUEVO: Historial del lector autenticado
class HistorialPrestamosView(generics.ListAPIView):
    """
    Devuelve el historial del usuario logueado:
    - devuelto
    - rechazado
    o registros marcados como inactivos.
    """
    serializer_class = PrestamoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Prestamo.objects.filter(
            lector_id=user.id,
            estado__in=["devuelto", "rechazado"]
        ).order_by('-fecha_prestamo')
