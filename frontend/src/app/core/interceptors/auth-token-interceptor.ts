import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**

Interceptor para inyectar el token de autenticación.
*/
export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
const authService = inject(AuthService);
const token = authService.getToken();

if (token) {
// Excluir la ruta de login y register para NO adjuntar el token en el POST.
const isAuthRoute = req.url.includes('/usuarios/login/') || req.url.includes('/usuarios/register/');

if (isAuthRoute && req.method === 'POST') {
  return next(req);
}

// Formato requerido: "Token <key>"
const authReq = req.clone({
  setHeaders: {
    Authorization: `Token ${token}`
  }
});

return next(authReq);


}

return next(req);
};
