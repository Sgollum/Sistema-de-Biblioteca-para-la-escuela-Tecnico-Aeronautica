from django.urls import path
from .views import (
    CrearPrestamoView,
    ListaPendientesView,
    AceptarPrestamoView,
    RechazarPrestamoView,
    MisPrestamosActivosView,
    HistorialPrestamosView,
)

urlpatterns = [
    path("solicitar/", CrearPrestamoView.as_view()),
    path("pendientes/", ListaPendientesView.as_view()),
    path("aceptar/<int:pk>/", AceptarPrestamoView.as_view()),
    path("rechazar/<int:pk>/", RechazarPrestamoView.as_view()),

    # 🔹 Endpoints para el Lector Dashboard
    path("mis-prestamos/", MisPrestamosActivosView.as_view()),
    path("mis-prestamos/historial/", HistorialPrestamosView.as_view()),
]
