# MS_Usuarios/views.py (Código de Simulación o Mockup)

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json # Necesario para leer datos POST/PUT/DELETE

@csrf_exempt # Necesario para APIs que reciben POST sin token CSRF
def mock_login(request):
    """Simula una respuesta exitosa de Login."""
    if request.method == 'POST':
        # El frontend esperará un token y datos del usuario
        response_data = {
            "status": "success",
            "message": "Autenticación exitosa (MOCK API)",
            "token": "simulated_jwt_token_12345",
            "user": {
                "id": 1,
                "username": "pablohdiez",
                "rol": "ADMIN", # Rol validado en Sprint 1
                "email": "test@biblioteca.com"
            }
        }
        return JsonResponse(response_data, status=200)
    return JsonResponse({"error": "Método no permitido"}, status=405)

@csrf_exempt
def mock_register(request):
    """Simula una respuesta exitosa de Registro."""
    if request.method == 'POST':
        # En una app real, aquí se procesan los datos del request.
        response_data = {
            "status": "success",
            "message": "Registro exitoso (MOCK API)",
            "user_id": 99
        }
        return JsonResponse(response_data, status=201)
    return JsonResponse({"error": "Método no permitido"}, status=405)

def mock_user_detail(request, pk):
    """Simula los detalles de un usuario."""
    # Simula la respuesta GET para ver el perfil (ej. /api/usuarios/user/1/)
    response_data = {
        "id": pk,
        "username": f"Usuario_ID_{pk}",
        "rol": "LECTOR",
        "email": f"usuario{pk}@mock.com",
        "library_data_ok": True
    }
    return JsonResponse(response_data, status=200)
