// RUTA DEL ARCHIVO: frontend/src/app/pages/bibliotecario-dashboard/bibliotecario-dashboard.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// Interface para los datos de resumen (MOCK por ahora)
interface ResumenBiblioteca {
  prestamosActivos: number;
  librosVencidos: number;
  totalLibros: number;
}

@Component({
  selector: 'app-bibliotecario-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './bibliotecario-dashboard.html',
  styleUrls: ['./bibliotecario-dashboard.css']
})
export class BibliotecarioDashboardComponent implements OnInit {

  resumen: ResumenBiblioteca = {
    prestamosActivos: 0,
    librosVencidos: 0,
    totalLibros: 0
  };

  constructor() { }

  ngOnInit(): void {
    this.cargarResumen();
  }

  cargarResumen(): void {
    // AQUÍ IRÍA LA LLAMADA AL SERVICIO REAL (MS_Prestamos)
    // Por ahora usamos datos simulados para maquetar la vista
    this.resumen = {
      prestamosActivos: 34,
      librosVencidos: 12,
      totalLibros: 450 // Este dato podría venir de MS_Catalogo
    };
  }

  registrarPrestamo(): void {
    // Lógica para abrir modal o navegar a formulario de préstamo
    alert('Navegando a formulario de préstamo...');
  }

  registrarDevolucion(): void {
    // Lógica para devolución
    alert('Navegando a formulario de devolución...');
  }
}
