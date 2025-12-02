import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PrestamosService } from '../../core/services/prestamos.service';

// Debe coincidir con lo que devuelve el serializer
export interface Prestamo {
  id: number;
  lector_id: number;
  libro_id: number;
  fecha_prestamo: string;
  fecha_devolucion_esperada: string | null;
  estado: 'pendiente' | 'listo' | 'rechazado' | 'prestado' | 'devuelto';
  esta_activo: boolean;
  lector_nombre?: string;
  libro_titulo?: string;
}

@Component({
  selector: 'app-lector-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './lector-dashboard.html',
  styleUrls: ['./lector-dashboard.css']
})
export class LectorDashboardComponent implements OnInit {

  private prestamosService = inject(PrestamosService);

  // pestaña activa
  tabActivo: 'prestamos' | 'historial' = 'prestamos';

  // fecha actual en formato YYYY-MM-DD para comparación simple
  fechaHoy: string = '';

  // datos
  prestamos: Prestamo[] = [];
  historial: Prestamo[] = [];

  loading: boolean = false;
  errorMessage: string | null = null;

  constructor() {
    this.fechaHoy = this.formatDate(new Date());
  }

  ngOnInit(): void {
    this.cargarPrestamosActivos();
    this.cargarHistorial();
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  // 📌 Cargar préstamos activos del backend
  cargarPrestamosActivos(): void {
    this.loading = true;
    this.errorMessage = null;

    this.prestamosService.obtenerPrestamosDelLector().subscribe({
      next: (data: Prestamo[]) => {
        this.prestamos = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar préstamos activos', err);
        this.errorMessage = 'No se pudieron cargar tus préstamos activos.';
        this.loading = false;
      }
    });
  }

  // 📌 Cargar historial del backend
  cargarHistorial(): void {
    this.prestamosService.obtenerHistorialDelLector().subscribe({
      next: (data: Prestamo[]) => {
        this.historial = data;
      },
      error: (err) => {
        console.error('Error al cargar historial', err);
      }
    });
  }

  // 🔹 Helpers de estado

  esVencido(p: Prestamo): boolean {
    if (!p.fecha_devolucion_esperada) return false;
    return (
      p.fecha_devolucion_esperada < this.fechaHoy &&
      (p.estado === 'pendiente' || p.estado === 'listo' || p.estado === 'prestado')
    );
  }

  puedeRenovar(p: Prestamo): boolean {
    if (this.esVencido(p)) return false;
    return p.estado === 'prestado' || p.estado === 'listo' || p.estado === 'pendiente';
  }

  // 🔹 Acciones (por ahora solo simuladas)
  renovarPrestamo(p: Prestamo): void {
    if (!this.puedeRenovar(p)) return;
    console.log(`Renovar préstamo ${p.id}`);
    alert('Función de renovación aún no implementada en backend.');
  }

  devolverLibro(p: Prestamo): void {
    console.log(`Devolver libro del préstamo ${p.id}`);
    alert('Función de devolución aún no implementada en backend.');
  }

  cambiarTab(tab: 'prestamos' | 'historial'): void {
    this.tabActivo = tab;
  }
}
