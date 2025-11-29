from django.urls import path
from . import views

# Las URLs de este microservicio serán prefijadas por 'api/prestamos/' 
# cuando se incluyan en el archivo urls.py principal del proyecto.

urlpatterns = [
    # GET: Lista todos los préstamos (activos o inactivos, según el parámetro 'estado')
    path('listar/', views.listar_prestamos, name='prestamos-listar'),

    # POST: Registra un nuevo préstamo
    # Ejemplo de uso (enviando JSON): 
    # { "libro": 1, "lector_id": 5, "dias_prestamo": 14 }
    path('registrar/', views.registrar_prestamo, name='prestamo-registrar'),
    
    # POST: Marca un préstamo como devuelto (usa el ID del Préstamo)
    # Ejemplo de uso: /api/prestamos/devolver/4/ 
    path('devolver/<int:prestamo_id>/', views.registrar_devolucion, name='prestamo-devolver'),
]