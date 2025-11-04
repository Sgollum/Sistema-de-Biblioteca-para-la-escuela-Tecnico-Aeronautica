# backend/MS_Catalogo/urls.py

from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import AutorViewSet, CategoriaViewSet, LibroViewSet

router = DefaultRouter()
# El router solo necesita el nombre del recurso ('libros', 'autores'), 
# NO el prefijo completo 'api/catalogo/'
router.register(r'autores', AutorViewSet) 
router.register(r'categorias', CategoriaViewSet)
router.register(r'libros', LibroViewSet) 

urlpatterns = [
    # Incluimos el router sin prefijo aquí para que se combine con la ruta principal.
    path('', include(router.urls)), 
]