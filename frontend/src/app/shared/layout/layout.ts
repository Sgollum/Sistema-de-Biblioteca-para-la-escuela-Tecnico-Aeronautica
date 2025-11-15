import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// CRÍTICO: Importar RouterOutlet y RouterLink
import { RouterOutlet, RouterLink, Router } from '@angular/router'; 

@Component({
  selector: 'app-layout',
  standalone: true,
  // CRÍTICO: Añadir RouterOutlet y RouterLink
  imports: [CommonModule, RouterOutlet, RouterLink], 
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class Layout implements OnInit {

  constructor(private router: Router) { } // Inyectamos Router

  ngOnInit(): void {
    // Aquí puedes inicializar la navegación, comprobar el estado de la sesión, etc.
  }

  logout(): void {
    // Lógica para cerrar sesión (ej. limpiar token, llamar a AuthService)
    console.log('Cerrando sesión...');
    // Redirigir a la página de inicio o login
    this.router.navigate(['/login']); 
  }
}