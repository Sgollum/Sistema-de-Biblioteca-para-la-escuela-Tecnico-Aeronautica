// frontend/src/app/core/interceptors/auth-token.interceptor.ts

import { HttpInterceptorFn } from '@angular/common/http';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Obtener el token del localStorage
  const authToken = localStorage.getItem('auth_token');
  
  // 2. Si hay un token, clonar la solicitud y añadir el encabezado
  if (authToken) {
    // 💡 IMPORTANTE: El formato debe ser 'Token ' seguido del valor
    const authHeader = `Token ${authToken}`;
    
    // Clonar la solicitud para añadir el nuevo encabezado
    const authReq = req.clone({
      headers: req.headers.set('Authorization', authHeader)
    });

    // 3. Pasar la solicitud clonada al siguiente manejador
    return next(authReq);
  }

  // 4. Si no hay token, pasar la solicitud original (para rutas públicas, ej. Login)
  return next(req);
};
