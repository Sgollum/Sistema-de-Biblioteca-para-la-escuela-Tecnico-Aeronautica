import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // Necesario para la redirección

@Component({
  selector: 'app-login', 
  standalone: true, 
  // Aseguramos que FormsModule, HttpClientModule y CommonModule estén importados
  imports: [CommonModule, FormsModule, HttpClientModule], 
  // 💡 NOMBRES DE ARCHIVO CORREGIDOS (según tu estructura actual)
  templateUrl: './login.component.html', // Asumiendo que has corregido el nombre a .component.html
  styleUrl: './login.css' // Asumiendo que el CSS se llama 'login.css'
})
export class LoginComponent { 
  
  // Inyectamos HttpClient para hacer peticiones y Router para la navegación
  constructor(private http: HttpClient, private router: Router) {}

  username = '';
  password = '';
  loginError = '';
  
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
          
          // 💡 1. GUARDAR el token en el almacenamiento local
          localStorage.setItem('auth_token', token);
          
          // 💡 2. REDIRIGIR al usuario a la ruta principal de la aplicación
          this.router.navigate(['/']); 
        },
        error: (error) => {
          // El error 400 (Bad Request) o el 500 (Server Error)
          this.loginError = '❌ Error de credenciales o de servidor. Verifique la consola de Django.';
          console.error('Error de login:', error);
        }
      });
  }
}