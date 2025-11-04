// frontend/src/app/pages/login/login.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; // <-- NECESARIO PARA ngModel y ngForm
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-login',
  standalone: true,
  // 💡 INCLUIR MÓDULOS EN LOS IMPORTS (¡CRUCIAL PARA COMPONENTES STANDALONE!)
  imports: [CommonModule, FormsModule], 
  templateUrl: './login.component.html', 
  // 💡 NOTA: Basado en tu estructura, usaremos './login.component.css' para mayor compatibilidad, 
  // pero verifica si tu archivo CSS se llama solo 'login.css'.
  styleUrls: ['./login.css'] 
})
export class LoginComponent {
  
  // Inyectamos HttpClient para hacer peticiones y Router para la navegación
  constructor(private http: HttpClient, private router: Router) {}

  username = '';
  password = '';
  // Usaremos un string para el mensaje de error, necesario para *ngIf
  loginError: string = ''; 
  
  // Método que maneja el envío del formulario
  onLogin() {
    this.loginError = ''; 
    
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
          
          // 2. REDIRIGIR al usuario a la ruta principal de la aplicación
          this.router.navigate(['/']); 
        },
        error: (error) => {
          // El error 400 (Bad Request) es el más común
          this.loginError = '❌ Credenciales inválidas. Intente de nuevo.';
          console.error('Error de login:', error);
        }
      });
  }
}