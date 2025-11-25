// RUTA DEL ARCHIVO: frontend/src/app/app.config.ts

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';

// 💡 RUTA CORRECTA: Importando el interceptor desde la subcarpeta core/interceptors
import { AuthInterceptor } from './core/interceptors/auth-token-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // 💡 REGISTRAR HTTP CLIENTE Y EL INTERCEPTOR
    provideHttpClient(
      withInterceptors([
        AuthInterceptor // Registrar el interceptor aquí
      ])
    )
  ]
};
