import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
// 💡 NUEVAS IMPORTACIONES: Para formularios y peticiones HTTP
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // Lo añadimos para una futura redirección

@Component({
  selector: 'app-login', 
  standalone: true, 
  // 💡 Añadir FormsModule y HttpClientModule
  imports: [CommonModule, FormsModule, HttpClientModule], 
  templateUrl: './login.component.html',
  styleUrl: './login.css' // O './login.css' si ese es el nombre
})
export class LoginComponent { 
  // 1. Definir variables y servicios inyectados
  constructor(private http: HttpClient, private router: Router) {}

  username = '';
  password = '';
  loginError = '';
  
  // 2. Método de Login
  onLogin() {
    this.loginError = ''; // Limpiar errores anteriores
    
    const loginData = {
      username: this.username,
      password: this.password
    };
    
    // Petición POST al endpoint de Django (PUERTO 8000)
    this.http.post('http://127.0.0.1:8000/api/login/', loginData)
      .subscribe({
        next: (response: any) => {
          // Si es exitoso, Django devuelve un token
          const token = response.token;
          console.log('✅ CONEXIÓN EXITOSA. TOKEN RECIBIDO:', token);
          // Aquí podríamos redirigir, pero por ahora solo registramos
          // this.router.navigate(['/dashboard']); 
        },
        error: (error) => {
          // Si Django devuelve 400 (Bad Request), es un error de credenciales
          this.loginError = '❌ Error de credenciales. Intente de nuevo.';
          console.error('Error de login:', error);
        }
      });
  }
}