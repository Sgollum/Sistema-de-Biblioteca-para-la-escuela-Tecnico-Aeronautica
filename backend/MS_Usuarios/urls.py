# RUTA: backend/MS_Usuarios/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    RegisterUserView,
    UserProfileView,
    UsuarioViewSet,
    LoginView
)

router = DefaultRouter()
# La ruta base para el CRUD de usuarios es /api/usuarios/
router.register(r'', UsuarioViewSet, basename='usuario')

urlpatterns = [
    # 🚨 NUEVO ENDPOINT DE LOGIN: /api/usuarios/login/
    path('login/', LoginView.as_view(), name='login'), 
    
    path('register/', RegisterUserView.as_view(), name='user_register'),
    path('me/', UserProfileView.as_view(), name='user_profile'),
]

urlpatterns += router.urls