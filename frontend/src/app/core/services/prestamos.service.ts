import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class PrestamosService {

  private apiUrl = `${environment.apiUrl}/api/prestamos/`;

  constructor(private http: HttpClient) {}

  // 📌 Solicitar préstamo desde el catálogo
  solicitarPrestamo(lectorId: number, libroId: number): Observable<any> {
    const payload = {
      lector_id: lectorId,
      libro_id: libroId
    };

    return this.http.post(this.apiUrl, payload);
  }

  // 📌 Obtener todas las solicitudes (panel bibliotecario)
  obtenerSolicitudes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // 📌 Actualizar estado (Aceptar, Rechazar, Listo para Retiro)
  actualizarEstado(id: number, nuevoEstado: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}${id}/`, { estado: nuevoEstado });
  }
}
