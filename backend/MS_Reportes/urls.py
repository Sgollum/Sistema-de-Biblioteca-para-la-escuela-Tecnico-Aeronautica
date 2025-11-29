from django.urls import path
from . import views

# Las URLs de este microservicio serán prefijadas por 'api/reportes/' 
# cuando se incluyan en el archivo urls.py principal del proyecto.

urlpatterns = [
    # GET: Reporte de Libros con stock bajo (Solo Admin)
    path('bajo-stock/', views.report_bajo_stock, name='reporte-bajo-stock'),

    # GET: Reporte de Préstamos Vencidos (Solo Admin)
    path('vencidos/', views.report_prestamos_vencidos, name='reporte-vencidos'),
    
    # GET: Reporte de Préstamos Actualmente Activos (Solo Admin)
    path('activos/', views.report_prestamos_activos, name='reporte-activos'),
]