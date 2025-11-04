// frontend/src/app/app.config.ts

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';

// 💡 CORRECCIÓN DE LA RUTA: Debe ser desde el directorio actual './core/...'
import { authTokenInterceptor } from './core/interceptors/auth-token-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // 💡 REGISTRAR HTTP CLIENTE Y EL INTERCEPTOR
    provideHttpClient(
      withInterceptors([
        authTokenInterceptor // Registrar el interceptor aquí
      ])
    )
  ]
};
