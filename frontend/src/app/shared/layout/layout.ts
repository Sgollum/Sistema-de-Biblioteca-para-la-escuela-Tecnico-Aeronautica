// RUTA DEL ARCHIVO: frontend/src/app/shared/layout/layout.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // Importamos RouterModule para routerLink
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule], // Importamos CommonModule y RouterModule
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class Layout {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Propiedad para obtener el rol actual fácilmente en el HTML
  get role(): string {
    return this.authService.getCurrentUserRole();
  }

  // Métodos auxiliares para verificar permisos en el HTML
  get isAdmin(): boolean {
    return this.role === 'admin';
  }

  get isBibliotecario(): boolean {
    // Aceptamos 'bibliotecario' (estándar) o 'biblio' (por si acaso quedó antiguo en la DB)
    return this.role === 'bibliotecario' || this.role === 'biblio';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}