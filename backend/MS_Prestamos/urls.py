from django.urls import path
from .views import (
    CrearPrestamoView,
    ListaPendientesView,
    AceptarPrestamoView,
    RechazarPrestamoView,
)

urlpatterns = [
    path("solicitar/", CrearPrestamoView.as_view()),
    path("pendientes/", ListaPendientesView.as_view()),
    path("aceptar/<int:pk>/", AceptarPrestamoView.as_view()),
    path("rechazar/<int:pk>/", RechazarPrestamoView.as_view())
]
