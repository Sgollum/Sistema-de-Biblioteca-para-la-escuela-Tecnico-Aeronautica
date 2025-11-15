import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router'; 

// Interface para el modelo de Préstamo
interface Prestamo {
  id: string;
  tituloLibro: string;
  fechaPrestamo: string;
  fechaVencimiento: string; // Formato YYYY-MM-DD
  renovable: boolean;
}

@Component({
  selector: 'app-lector-dashboard',
  standalone: true,
  // CRÍTICO: Asegurar RouterLink en imports
  imports: [CommonModule, RouterLink], 
  templateUrl: './lector-dashboard.html',
  styleUrls: ['./lector-dashboard.css']
})
export class LectorDashboardComponent implements OnInit {

  // Propiedad para almacenar la fecha actual en formato YYYY-MM-DD
  fechaHoy: string = '';
  tabActivo: 'prestamos' | 'historial' = 'prestamos'; // Estado para la navegación de pestañas
  
  prestamos: Prestamo[] = [];
  historial: Prestamo[] = [];

  constructor() {
    this.fechaHoy = this.formatDate(new Date());
  }

  ngOnInit(): void {
    this.loadPrestamos();
  }

  /**
   * Helper para formatear la fecha a YYYY-MM-DD para una comparación de string simple.
   */
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  // Simulación de carga de datos
  loadPrestamos(): void {
    // MOCK: Préstamos activos 
    this.prestamos = [
      { 
        id: 'P001', 
        tituloLibro: 'Principios de Vuelo', 
        fechaPrestamo: '2025-11-01', 
        fechaVencimiento: '2025-11-15', 
        renovable: true 
      },
      { 
        id: 'P002', 
        tituloLibro: 'Navegación Aérea Moderna', 
        fechaPrestamo: '2025-10-20', 
        fechaVencimiento: '2025-11-10', 
        renovable: false 
      },
      { 
        id: 'P003', 
        tituloLibro: 'Regulaciones DGAC 2025', 
        fechaPrestamo: '2025-11-10', 
        fechaVencimiento: '2025-11-24', 
        renovable: true 
      },
    ];

    // MOCK: Historial
    this.historial = [
      { id: 'H001', tituloLibro: 'Historia de la Aviación', fechaPrestamo: '2025-09-01', fechaVencimiento: '2025-09-15', renovable: false },
    ];
  }

  renovarPrestamo(id: string): void {
    console.log(`Solicitud de renovación para el préstamo ${id}.`);
  }

  devolverLibro(id: string): void {
    console.log(`Libro del préstamo ${id} marcado para devolución.`);
  }
}