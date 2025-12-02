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

  // 📌 ENVIAR SOLICITUD DE PRÉSTAMO (Catálogo)
  solicitarPrestamo(usuarioId: number, libroId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}solicitar/`, {
      lector_id: usuarioId,
      libro_id: libroId
    });
  }

  // 📌 OBTENER TODAS LAS SOLICITUDES (Panel Bibliotecario)
  obtenerSolicitudes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}pendientes/`);
  }

  // 📌 ACEPTAR PRÉSTAMO (Panel Bibliotecario)
  aceptarPrestamo(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}aceptar/${id}/`, {});
  }

  // 📌 RECHAZAR PRÉSTAMO (Panel Bibliotecario)
  rechazarPrestamo(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}rechazar/${id}/`, {});
  }

  // 🔹 NUEVO: PRÉSTAMOS ACTIVOS DEL LECTOR (Lector Dashboard)
  obtenerPrestamosDelLector(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}mis-prestamos/`);
  }

  // 🔹 NUEVO: HISTORIAL DEL LECTOR (Lector Dashboard)
  obtenerHistorialDelLector(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}mis-prestamos/historial/`);
  }
}



