from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Prestamo
from .serializers import PrestamoSerializer

from MS_Catalogo.models import Libro

class CrearPrestamoView(generics.CreateAPIView):
    queryset = Prestamo.objects.all()
    serializer_class = PrestamoSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        lector_id = request.data.get("lector_id")
        libro_id = request.data.get("libro_id")

        if not lector_id or not libro_id:
            return Response({"error": "Datos incompletos"}, status=400)

        libro = Libro.objects.get(id=libro_id)

        if libro.copias_disponibles <= 0:
            return Response({"error": "No hay stock"}, status=400)

        prestamo = Prestamo.objects.create(
            lector_id=lector_id,
            libro_id=libro_id,
            estado="pendiente"
        )

        return Response(PrestamoSerializer(prestamo).data, status=201)


class ListaPendientesView(generics.ListAPIView):
    queryset = Prestamo.objects.filter(estado="pendiente")
    serializer_class = PrestamoSerializer
    permission_classes = [IsAuthenticated]


class AceptarPrestamoView(generics.UpdateAPIView):
    queryset = Prestamo.objects.all()
    serializer_class = PrestamoSerializer
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        prestamo = Prestamo.objects.get(id=pk)
        libro = prestamo.libro

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
        prestamo = Prestamo.objects.get(id=pk)
        prestamo.estado = "rechazado"
        prestamo.save()
        return Response(PrestamoSerializer(prestamo).data)
