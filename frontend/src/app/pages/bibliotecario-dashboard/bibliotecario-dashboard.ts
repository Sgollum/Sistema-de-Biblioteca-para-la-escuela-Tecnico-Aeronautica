import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// Interfaces de datos (MOCK)
interface PrestamoActivo {
  id: number;
  titulo: string;
  lector: string;
  fechaVencimiento: string;
}

interface Actividad {
  id: number;
  accion: string;
  timestamp: string;
}

@Component({
  selector: 'app-bibliotecario-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './bibliotecario-dashboard.html',
  styleUrls: ['./bibliotecario-dashboard.css']
})
export class BibliotecarioDashboard implements OnInit {

  // Kpis
  prestamosActivosTotal: number = 34; // Desde MS_Prestamos
  librosVencidos: number = 12; // Desde MS_Prestamos

  // Lista de préstamos más críticos (MOCK)
  prestamosActivos: PrestamoActivo[] = [
    { id: 1, titulo: 'Cien Años de Soledad', lector: 'Juan Perez', fechaVencimiento: '2025-11-20' },
    { id: 2, titulo: 'El Quijote', lector: 'Ana Gomez', fechaVencimiento: '2025-11-15' },
  ];

  // Últimas actividades (MOCK)
  ultimasActividades: Actividad[] = [
    { id: 1, accion: 'Registro de nuevo préstamo: Cien Años de Soledad a Juan Perez', timestamp: '2025-11-10 10:30' },
    { id: 2, accion: 'Devolución de libro: El Hobbit por Maria Lopez', timestamp: '2025-11-10 09:45' },
    { id: 3, accion: 'Nuevo usuario registrado: Pedro Alva', timestamp: '2025-11-09 18:00' },
    { id: 4, accion: 'Creación de nuevo libro: Programación en Python', timestamp: '2025-11-09 15:20' },
  ];

  constructor() { }

  ngOnInit(): void {
    // Aquí se llamarían a los servicios para obtener los datos reales
    // de MS_Prestamos y MS_Catalogos (para el inventario)
  }

  // Métodos de acción rápida
  registrarNuevoPrestamo(): void {
    // Redirigir a la vista de registro de préstamo (ej. un formulario)
    alert('Redireccionando a la vista de "Registrar Nuevo Préstamo"...'); 
    // this.router.navigate(['/prestamos/nuevo']);
  }

  registrarDevolucion(): void {
    // Redirigir a la vista de registro de devolución
    alert('Redireccionando a la vista de "Registrar Devolución"...'); 
    // this.router.navigate(['/devoluciones']);
  }
}
