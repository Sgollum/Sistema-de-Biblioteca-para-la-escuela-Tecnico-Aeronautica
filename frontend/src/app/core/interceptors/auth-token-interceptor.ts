// RUTA DEL ARCHIVO: frontend/src/app/core/interceptors/auth-token-interceptor.ts

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service'; 

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  // Inyectamos el servicio de autenticación
  const authService = inject(AuthService);
  
  // 1. Obtener el token del servicio (que a su vez lo obtiene del localStorage)
  const authToken = authService.getToken(); 

  // 2. Si hay un token, clonar la solicitud y añadir el encabezado
  if (authToken) {
    // La clave es que el formato sea 'Token ' + el valor, que es lo que hiciste.
    const authHeader = `Token ${authToken}`;
    
    // Clonar la solicitud para añadir el nuevo encabezado
    const authReq = req.clone({
      headers: req.headers.set('Authorization', authHeader)
    });

    // 3. Pasar la solicitud clonada al siguiente manejador
    return next(authReq);
  }

  // 4. Si no hay token, pasar la solicitud original (para rutas públicas, ej. Login/Register)
  return next(req);
};
