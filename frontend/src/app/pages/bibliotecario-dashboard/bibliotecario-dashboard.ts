import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrestamosService } from '../../core/services/prestamos.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-bibliotecario-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bibliotecario-dashboard.html',
  styleUrls: ['./bibliotecario-dashboard.css']
})
export class BibliotecarioDashboardComponent implements OnInit {

  private prestamosService = inject(PrestamosService);
  private authService = inject(AuthService);

  solicitudes: any[] = [];
  
  // KPIs
  pendientes = 0;
  aceptadas = 0;
  rechazadas = 0;

  loading = true;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  cargarSolicitudes() {
    this.loading = true;

    this.prestamosService.obtenerSolicitudes().subscribe({
      next: (data) => {
        this.solicitudes = data;

        this.pendientes = data.filter((x: any) => x.estado === "Pendiente").length;
        this.aceptadas = data.filter((x: any) => x.estado === "Listo para Retiro").length;
        this.rechazadas = data.filter((x: any) => x.estado === "Rechazado").length;

        this.loading = false;
      },
      error: () => {
        this.errorMessage = "No se pudieron cargar las solicitudes.";
        this.loading = false;
      }
    });
  }

  aceptarSolicitud(id: number) {
    this.prestamosService.actualizarEstado(id, "Listo para Retiro").subscribe(() => {
      this.cargarSolicitudes();
    });
  }

  rechazarSolicitud(id: number) {
    this.prestamosService.actualizarEstado(id, "Rechazado").subscribe(() => {
      this.cargarSolicitudes();
    });
  }
}
