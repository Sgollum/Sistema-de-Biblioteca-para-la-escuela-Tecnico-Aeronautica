import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AuthService } from '../../core/services/auth.service';
import { LoginCredentials } from '../../core/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule, HttpClientModule],
  template: `
    <!-- Fondo con imagen + overlay + blur -->
    <div class="login-background"></div>

    <div class="flex items-center justify-center min-h-screen p-4">
      <div class="w-full max-w-md bg-white/90 backdrop-blur-md rounded-xl shadow-2xl p-8">

        <h2 class="text-3xl font-extrabold text-center text-primary-custom mb-6">
        Iniciar Sesión
        </h2>


        <form (ngSubmit)="onSubmit(loginForm.valid)"
              #loginForm="ngForm"
              class="space-y-6">

          @if (errorMessage) {
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              {{ errorMessage }}
            </div>
          }

          <div>
            <label for="identifier" class="block text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              [(ngModel)]="credentials.identifier"
              required
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm
                     focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              placeholder="Ej: nombre@correo.cl"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="credentials.password"
              required
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm
                     focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              placeholder="Ingresa tu contraseña"
            />
          </div>

          <button
            type="submit"
            [disabled]="!loginForm.valid || isLoading"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md
                  text-base font-medium text-white 
                  bg-[#1F364D] hover:bg-[#172836] 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1F364D]
                  disabled:opacity-50 transition duration-300"
            >

            @if (isLoading) {
              Cargando...
            } @else {
              Iniciar Sesión
            }
          </button>
        </form>

        <!-- SE ELIMINÓ ESTE BLOQUE
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            ¿No tienes una cuenta?
            <a
              [routerLink]="['/register']"
              class="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
            >
              Regístrate aquí
            </a>
          </p>
        </div>
        -->

      </div>
    </div>
  `,
  styles: [
    `
      .text-primary-custom {
  color: #1F364D !important;
}

      .login-background {
        position: fixed;
        inset: 0;
        width: 100%;
        height: 100%;
        background:
          linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)),
          url('https://wallpapers.com/images/hd/library-background-j511zvk12mbkip3l.jpg');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        filter: blur(3px);
        z-index: -1;
      }
    `
  ]
})
export class LoginComponent {

  private authService = inject(AuthService);
  private router = inject(Router);

  credentials: LoginCredentials = {
    identifier: '',
    password: ''
  };

  errorMessage: string | null = null;
  isLoading: boolean = false;

  onSubmit(isValid: boolean | null) {
    this.errorMessage = null;
    if (!isValid) return;

    this.isLoading = true;

    this.authService.login(this.credentials).subscribe({
      next: () => {
        const role = this.authService.getCurrentUserRole();
        this.isLoading = false;

        // Navegación basada en el rol
        switch (role) {
          case this.authService.Roles.ADMIN:
            this.router.navigate(['/admin-dashboard']);
            break;

          case this.authService.Roles.BIBLIOTECARIO:
            this.router.navigate(['/bibliotecario-dashboard']);
            break;

          case this.authService.Roles.LECTOR:
            this.router.navigate(['/lector-dashboard']);
            break;

          default:
            this.router.navigate(['/dashboard']);
            break;
        }
      },

      error: (err) => {
        this.isLoading = false;

        if (err.status === 401) {
          this.errorMessage = 'Credenciales inválidas. Verifica tu usuario/correo y contraseña.';
        } else if (err.status === 400) {
          this.errorMessage = 'Solicitud incorrecta. Asegúrate de rellenar ambos campos.';
        } else {
          this.errorMessage = 'Error de conexión o servidor. Intenta más tarde.';
        }

        console.error('Error de Login:', err);
      }
    });
  }
}

