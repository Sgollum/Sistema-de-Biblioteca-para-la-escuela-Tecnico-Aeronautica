# RUTA COMENTADA: backend/MS_Usuarios/urls.py
from django.urls import path
from rest_framework.authtoken import views
# Asegúrate de importar AMBAS vistas ahora
from .views import RegisterUserView, UserProfileView 

urlpatterns = [

path('login/', views.obtain_auth_token, name='api_token_auth'), 

 # URL para el registro de nuevos usuarios
path('register/', RegisterUserView.as_view(), name='user_register'),

path('me/', UserProfileView.as_view(), name='user_profile'), 
]