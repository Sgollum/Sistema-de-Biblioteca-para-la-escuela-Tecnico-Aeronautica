import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { RegisterCredentials } from '../../core/models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div class="w-full max-w-lg bg-white rounded-xl shadow-2xl p-8">
        <h2 class="text-3xl font-extrabold text-center text-indigo-700 mb-6">
          Registro de Usuario
        </h2>

        <form (ngSubmit)="onSubmit(registerForm.valid)" #registerForm="ngForm" class="space-y-4">

          @if (errorMessage) {
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {{ errorMessage }}
            </div>
          }

          <!-- Nombre -->
          <div>
            <label for="first_name">Nombre</label>
            <input type="text" id="first_name" name="first_name"
              [(ngModel)]="credentials.first_name" required />
          </div>

          <!-- Apellido -->
          <div>
            <label for="last_name">Apellido</label>
            <input type="text" id="last_name" name="last_name"
              [(ngModel)]="credentials.last_name" required />
          </div>

          <!-- Username -->
          <div>
            <label for="username">Nombre de Usuario</label>
            <input type="text" id="username" name="username"
              [(ngModel)]="credentials.username" required />
          </div>

          <!-- Email -->
          <div>
            <label for="email">Correo Electrónico</label>
            <input type="email" id="email" name="email"
              [(ngModel)]="credentials.email" required />
          </div>

          <!-- Password -->
          <div>
            <label for="password1">Contraseña</label>
            <input type="password" id="password1" name="password1"
              [(ngModel)]="credentials.password1" required />
          </div>

          <!-- Confirmación -->
          <div>
            <label for="password2">Confirmar Contraseña</label>
            <input type="password" id="password2" name="password2"
              [(ngModel)]="credentials.password2" required />
          </div>

          <button type="submit" [disabled]="!registerForm.valid">
            Registrar Cuenta
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            ¿Ya tienes una cuenta?
            <a [routerLink]="['/login']"
               class="font-medium text-indigo-600 hover:text-indigo-500">
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
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password1: '',
    password2: '',
  };

  errorMessage: string | null = null;

  onSubmit(isValid: boolean | null) {
    this.errorMessage = null;

    if (isValid) {
      if (this.credentials.password1 !== this.credentials.password2) {
        this.errorMessage = 'Las contraseñas no coinciden.';
        return;
      }

      this.authService.registerUser(this.credentials).subscribe({
        next: () => {
          alert('Registro exitoso. Ahora puedes iniciar sesión.');
          this.router.navigate(['/login']);
        },
        error: () => {
          this.errorMessage = 'El registro falló.';
        }
      });
    }
  }
}
