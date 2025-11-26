import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Interceptor para inyectar el token de autenticación.
 */
export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.getToken();

    if (token) {
        // Excluir la ruta de login y register para NO adjuntar el token en el POST.
        const isAuthRoute = req.url.includes('/usuarios/login/') || req.url.includes('/usuarios/register/');

        if (isAuthRoute && req.method === 'POST') {
            // No adjuntamos el token en las peticiones de Login/Register
            return next(req);
        }

        // 🚨 CORRECCIÓN CRÍTICA: Cambiamos el prefijo de 'Token' a 'Bearer'
        // para que coincida con la configuración de Django (BearerTokenAuthentication).
        const authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}` 
            }
        });

        return next(authReq);
    }

    return next(req);
};
