import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
   
  constructor(private http: HttpClient, private router: Router) {}

  username = '';
  password = '';
  loginError: string = ''; 
   
  onLogin() {
    this.loginError = ''; 

    const loginData = {
      username: this.username,
      password: this.password
    };

     // Petición POST al endpoint de Django
    this.http.post('http://127.0.0.1:8000/api/login/', loginData)
      .subscribe({
        next: (response: any) => {
          const token = response.token;
          console.log('✅ LOGIN EXITOSO. TOKEN RECIBIDO Y GUARDADO.', token);
 
          localStorage.setItem('auth_token', token);
 
          this.router.navigate(['/dashboard']); 
        },
        error: (error) => {
          this.loginError = '❌ Credenciales inválidas. Intente de nuevo.';
          console.error('Error de login:', error);
        }
      }); 
  }
}