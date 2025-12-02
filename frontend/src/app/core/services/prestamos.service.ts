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

  // 📌 ENVIAR SOLICITUD DE PRÉSTAMO
  solicitarPrestamo(usuarioId: number, libroId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}solicitar/`, {
      lector_id: usuarioId,
      libro_id: libroId
    });
  }

  // 📌 OBTENER TODAS LAS SOLICITUDES (NO SOLO PENDIENTES)
  obtenerSolicitudes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}pendientes/`);
  }

  // 📌 ACEPTAR PRÉSTAMO
  aceptarPrestamo(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}aceptar/${id}/`, {});
  }

  // 📌 RECHAZAR PRÉSTAMO
  rechazarPrestamo(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}rechazar/${id}/`, {});
  }
}


