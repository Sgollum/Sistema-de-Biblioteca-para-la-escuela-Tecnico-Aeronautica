import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; 

import { AuthService } from '../../core/services/auth.service';
import { LoginCredentials } from '../../core/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink], 
  template: `
    <!-- Fondo con imagen + overlay + blur -->
    <div class="login-background"></div>

    <div class="flex items-center justify-center min-h-screen p-4">
      <div class="w-full max-w-md bg-white/90 backdrop-blur-md rounded-xl shadow-2xl p-8">
        <h2 class="text-3xl font-extrabold text-center text-indigo-700 mb-6">
          Iniciar Sesión
        </h2>
        
        <form (ngSubmit)="onSubmit(loginForm.valid)" #loginForm="ngForm" class="space-y-6">
          
          @if (errorMessage) {
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              {{ errorMessage }}
            </div>
          }

          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">
              Nombre de Usuario
            </label>
            <input
              type="text"
              id="username"
              name="username"
              [(ngModel)]="credentials.username"
              required
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              placeholder="Ej: pablo.lopez"
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
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              placeholder="Ingresa tu contraseña"
            />
          </div>

          <button
            type="submit"
            [disabled]="!loginForm.valid"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition duration-300"
          >
            Iniciar Sesión
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            ¿No tienes una cuenta?
            <a [routerLink]="['/register']" class="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Fondo con imagen + overlay + blur */
    .login-background {
      position: fixed;
      inset: 0;
      width: 100%;
      height: 100%;
      background:
        linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)),
        url('https://wallpapers.com/images/hd/library-background-bdpbrit7uip76ztq.jpg');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      filter: blur(3px);
      z-index: -1;
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  credentials: LoginCredentials = {
    username: '', 
    password: '',
  };
  errorMessage: string | null = null;

  onSubmit(isValid: boolean | null) { 
    this.errorMessage = null;

    if (isValid) {
      this.authService.login(this.credentials).subscribe({
        next: () => {
          const role = this.authService.getCurrentUserRole();
          
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
        error: (error) => {
          console.error('Login failed:', error);
          this.errorMessage = 'Credenciales inválidas. Verifica tu usuario y contraseña.';
        }
      });
    }
  }
}
