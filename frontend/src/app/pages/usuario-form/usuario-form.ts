import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../app/core/services/auth.service';
// IMPORTANTE: Asegúrate de que esta ruta sea correcta
import { RegisterCredentials } from '../../../app/core/models/auth.model'; 

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario-form.html',
  styleUrls: ['./usuario-form.css'],
})
export class UsuarioForm {
  private authService = inject(AuthService);
  private router = inject(Router);

  // 1. Definición del objeto de credenciales
  credentials: RegisterCredentials = {
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password1: '',
    password2: '',
  };

  message: string | null = null;
  error: string | null = null;
  loading: boolean = false;

  public roles = [
    { value: 'Lector', name: 'Lector' },
    { value: 'Bibliotecario', name: 'Bibliotecario' },
    { value: 'Admin', name: 'Administrador' },
  ];

  /**
   * Intenta registrar al usuario con los datos y el rol seleccionados.
   */
  registerUser() {
    this.loading = true;
    this.message = null;
    this.error = null;

    // 2. Validación de contraseñas (usa password/password2 o password1/password2 según tu modelo)
    if (this.credentials.password1 !== this.credentials.password2) {
      this.error = 'Las contraseñas no coinciden.';
      this.loading = false;
      return;
    }
    
    // 3. Llamada al servicio de registro (Asumimos que el AuthService tiene la función 'register')
    this.authService.registerUser(this.credentials).subscribe({
      next: () => {
        this.message = '¡Usuario registrado con éxito!';
        this.loading = false;
        // Opcional: limpiar formulario o redirigir
        this.resetForm();
      },
      error: (err) => {
        this.error = 'Error al registrar el usuario. Revisa los datos.';
        console.error('Registration Error:', err);
        this.loading = false;
      },
    });
  }
  
  /**
   * Limpia el formulario después de un registro exitoso.
   */
  private resetForm() {
    this.credentials = {
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      password1: '',
      password2: '',
    };
  }
}