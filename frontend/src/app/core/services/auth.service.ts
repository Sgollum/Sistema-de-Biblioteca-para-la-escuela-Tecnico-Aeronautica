import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaz para la respuesta de inicio de sesión (asumiendo que Django/DRF devuelve un token)
interface AuthResponse {
    access: string; // El token de acceso (JWT)
    refresh: string; // El token de refresco (si lo usas)
    user_role: string; // Asumiendo que el backend envía el rol
}

// URL de la API de tu microservicio de usuarios (ajusta si es necesario)
const AUTH_API_URL = 'http://localhost:8000/api/v1/usuarios';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);

    // ************************************************************
    // *** Implementación de Token y Rol (Lo que faltaba) ***
    // ************************************************************

    /**
     * Obtiene el token de acceso JWT del almacenamiento local.
     * @returns El token de acceso o null si no existe.
     */
    getToken(): string | null {
        // Asume que el token se guarda con la clave 'access_token' tras el login
        return localStorage.getItem('access_token');
    }

    /**
     * Extrae el rol del usuario del token JWT (asumiendo que está codificado o guardado por separado).
     * NOTA: La decodificación real del JWT es compleja. Para simplificar, asumiremos
     * que el rol fue guardado directamente o es extraído de un token simple.
     * Si el token es un JWT real, se usaría una librería como 'jwt-decode'.
     *
     * Por ahora, lo recuperamos si fue guardado al iniciar sesión.
     * @returns El rol del usuario ('Lector', 'Bibliotecario', 'Administrador') o null.
     */
    getCurrentUserRole(): string | null {
        // En una app real, el rol se decodificaría del JWT.
        // Aquí, buscaremos el rol guardado en localStorage.
        return localStorage.getItem('user_role');
    }

    // ************************************************************
    // *** Lógica de Inicio de Sesión (Ejemplo) ***
    // ************************************************************
    
    login(username: string, password: string): Observable<AuthResponse> {
        // Endpoint que genera el token (puede ser /api/token/ o /api/login/)
        return this.http.post<AuthResponse>(`${AUTH_API_URL}/token/`, { 
            username, 
            password 
        });
    }

    /**
     * Guarda el token de acceso y el rol del usuario tras un login exitoso.
     */
    saveAuthData(response: AuthResponse): void {
        localStorage.setItem('access_token', response.access);
        // Si el backend no devuelve el 'user_role', necesitarás decodificar el JWT aquí.
        // Asumiendo que sí lo devuelve para la simplicidad.
        // Si el backend no devuelve 'user_role', esta línea debe cambiarse
        // para decodificarlo del token 'response.access'.
        localStorage.setItem('user_role', response.user_role); 
    }

    /**
     * Cierra la sesión y limpia el almacenamiento local.
     */
    logout(): void {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_role');
        // Opcional: navegar a la página de login/home
    }
}