// RUTA DEL ARCHIVO: frontend/src/app/pages/admin-dashboard/admin-dashboard.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {

  totalUsuarios: number = 1234; // Mock
  alertasSeguridad: number = 0; // Mock

  constructor() { }

  ngOnInit(): void {
    // Aquí cargarías estadísticas reales desde MS_Usuarios y MS_Reportes
  }

  crearUsuario(): void {
      // Navegación manejada por routerLink en el HTML
  }
}