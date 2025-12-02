// src/app/pages/bibliotecario-dashboard/bibliotecario-dashboard.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrestamosService } from '../../core/services/prestamos.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface Prestamo {
  id: number;
  lector_id: number;
  libro_id: number;
  fecha_prestamo: string;
  fecha_devolucion_esperada: string | null;
  estado: 'pendiente' | 'listo' | 'rechazado' | 'prestado' | 'devuelto';
  esta_activo: boolean;

  // vienen del backend por el serializer
  lector_nombre: string;
  libro_titulo: string;
}

interface LibroRanking {
  libro_id: number;
  titulo: string;
  cantidad: number;
}

@Component({
  selector: 'app-bibliotecario-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bibliotecario-dashboard.html',
  styleUrls: ['./bibliotecario-dashboard.css'],
})
export class BibliotecarioDashboardComponent implements OnInit {
  private prestamosService = inject(PrestamosService);

  solicitudes: Prestamo[] = [];
  rankingLibros: LibroRanking[] = [];

  // Métricas
  pendientes = 0;
  listosRetiro = 0;
  rechazados = 0;
  prestados = 0;
  devueltos = 0;
  totalSolicitudes = 0;
  tasaAprobacion = 0;
  tasaRechazo = 0;

  loading = true;
  errorMessage: string | null = null;

  private chartEstados?: Chart;

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  cargarSolicitudes(): void {
    this.loading = true;

    this.prestamosService.obtenerSolicitudes().subscribe({
      next: (data: any[]) => {
        this.solicitudes = data as Prestamo[];

        this.calcularMetricas();
        this.calcularRankingLibros();
        this.dibujarGraficoEstados();

        this.loading = false;
        this.errorMessage = null;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No se pudieron cargar las solicitudes.';
      },
    });
  }

  // ----- MÉTRICAS -----
  private calcularMetricas(): void {
    const data = this.solicitudes;

    this.pendientes = data.filter((s) => s.estado === 'pendiente').length;
    this.listosRetiro = data.filter((s) => s.estado === 'listo').length;
    this.rechazados = data.filter((s) => s.estado === 'rechazado').length;
    this.prestados = data.filter((s) => s.estado === 'prestado').length;
    this.devueltos = data.filter((s) => s.estado === 'devuelto').length;

    this.totalSolicitudes = data.length;

    this.tasaAprobacion =
      this.totalSolicitudes > 0
        ? Math.round((this.listosRetiro / this.totalSolicitudes) * 100)
        : 0;

    this.tasaRechazo =
      this.totalSolicitudes > 0
        ? Math.round((this.rechazados / this.totalSolicitudes) * 100)
        : 0;
  }

  // ----- RANKING LIBROS -----
  private calcularRankingLibros(): void {
    const mapa = new Map<number, LibroRanking>();

    for (const s of this.solicitudes) {
      const existente = mapa.get(s.libro_id);
      if (existente) {
        existente.cantidad += 1;
      } else {
        mapa.set(s.libro_id, {
          libro_id: s.libro_id,
          titulo: s.libro_titulo,
          cantidad: 1,
        });
      }
    }

    this.rankingLibros = Array.from(mapa.values())
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5);
  }

  // ----- GRÁFICO -----
  private dibujarGraficoEstados(): void {
    const ctx = document.getElementById(
      'chartEstados'
    ) as HTMLCanvasElement | null;

    if (!ctx) return;

    if (this.chartEstados) {
      this.chartEstados.destroy();
    }

    this.chartEstados = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Pendientes', 'Listos', 'Rechazados'],
        datasets: [
          {
            data: [this.pendientes, this.listosRetiro, this.rechazados],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      },
    });
  }

  // ----- ACCIONES -----
  aceptarSolicitud(id: number): void {
    this.prestamosService.aceptarPrestamo(id).subscribe({
      next: () => this.cargarSolicitudes(),
    });
  }

  rechazarSolicitud(id: number): void {
    this.prestamosService.rechazarPrestamo(id).subscribe({
      next: () => this.cargarSolicitudes(),
    });
  }
}
