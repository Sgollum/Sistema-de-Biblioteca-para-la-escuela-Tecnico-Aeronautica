import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; // <-- IMPORTADO RouterLink

import { AuthService } from '../../core/services/auth.service';
import { RegisterCredentials } from '../../core/models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink], // <-- AÑADIDO RouterLink aquí
  template: `
    <div class="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div class="w-full max-w-lg bg-white rounded-xl shadow-2xl p-8">
        <h2 class="text-3xl font-extrabold text-center text-indigo-700 mb-6">
          Registro de Usuario
        </h2>
        
        <form (ngSubmit)="onSubmit(registerForm.valid)" #registerForm="ngForm" class="space-y-4">
          
          <!-- Mensaje de Error (si existe) -->
          @if (errorMessage) {
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              {{ errorMessage }}
            </div>
          }
          
          <!-- Nombre (Campo CORREGIDO) -->
          <div>
            <label for="nombre" class="block text-sm font-medium text-gray-700">
              Nombre Completo
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              [(ngModel)]="credentials.nombre"
              required
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              placeholder="Ej: Pablo López"
            />
          </div>

          <!-- Nombre de Usuario -->
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

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="credentials.email"
              required
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              placeholder="Ej: pablo@ejemplo.com"
            />
          </div>

          <!-- Contraseña -->
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
              placeholder="Crea una contraseña segura"
            />
          </div>

          <!-- Confirmar Contraseña -->
          <div>
            <label for="password2" class="block text-sm font-medium text-gray-700">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="password2"
              name="password2"
              [(ngModel)]="credentials.password2"
              required
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              placeholder="Repite la contraseña"
            />
          </div>

          <button
            type="submit"
            [disabled]="!registerForm.valid"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition duration-300"
          >
            Registrar Cuenta
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            ¿Ya tienes una cuenta?
            <a [routerLink]="['/login']" class="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
              Inicia sesión aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  credentials: RegisterCredentials = {
    nombre: '', 
    username: '',
    email: '',
    password: '',
    password2: '',
  };
  errorMessage: string | null = null;

  onSubmit(isValid: boolean | null) { // <-- CORREGIDO: Acepta boolean | null
    this.errorMessage = null;

    if (isValid) {
      if (this.credentials.password !== this.credentials.password2) {
        this.errorMessage = 'Las contraseñas no coinciden.';
        return;
      }
      
      this.authService.registerUser(this.credentials).subscribe({
        next: (response) => {
          alert('Registro exitoso. Ahora puedes iniciar sesión.');
          this.router.navigate(['/login']); 
        },
        error: (error) => {
          console.error('Registration failed:', error);
          this.errorMessage = 'El registro falló. El nombre de usuario o correo ya pueden estar en uso.';
        }
      });
    }
  }
}