import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Importar Router

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  
  constructor(private router: Router) {}
  
  logout() {
    // 1. Eliminar el token de localStorage
    localStorage.removeItem('auth_token');
    
    // 2. Redirigir al usuario a la página de Login
    this.router.navigate(['/login']);
  }
}
