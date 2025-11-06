// frontend/src/app/pages/login/login.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; // Necesario para ngModel y ngForm
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-login',
  standalone: true,
  // 💡 IMPORTS necesarios para Angular y Formularios
  imports: [CommonModule, FormsModule], 
  templateUrl: './login.component.html', 
  styleUrls: ['./login.css'] 
})
export class LoginComponent {
  
  // Inyectamos HttpClient para peticiones y Router para navegación
  constructor(private http: HttpClient, private router: Router) {}

  username = '';
  password = '';
  loginError: string = ''; // Mensaje para mostrar errores al usuario
  
  // Método que maneja el envío del formulario
  onLogin() {
    this.loginError = ''; // Limpiar errores anteriores
    
    const loginData = {
      username: this.username,
      password: this.password
    };
    
    // Petición POST al endpoint de Django (http://127.0.0.1:8000/api/login/)
    this.http.post('http://127.0.0.1:8000/api/login/', loginData)
      .subscribe({
        next: (response: any) => {
          const token = response.token;
          console.log('✅ LOGIN EXITOSO. TOKEN RECIBIDO Y GUARDADO.', token);
          
          // 1. GUARDAR el token en el almacenamiento local
          localStorage.setItem('auth_token', token);
          
          // 2. REDIRIGIR al usuario al DASHBOARD (¡CORREGIDO!)
          this.router.navigate(['/dashboard']); 
        },
        error: (error) => {
          // Manejo básico de errores, asumiendo 400 es credenciales inválidas
          this.loginError = '❌ Credenciales inválidas. Intente de nuevo.';
          console.error('Error de login:', error);
        }
      });
  }
}