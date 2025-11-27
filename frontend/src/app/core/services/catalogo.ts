import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Libro } from '../models/libro.model';
import { AuthService } from './auth.service';


const API_URL = 'http://localhost:8000/api/catalogo';


@Injectable({
  providedIn: 'root'
})
export class CatalogoService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  // Función auxiliar para obtener las cabeceras de autorización
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    // Asegurarse de que el token esté presente para operaciones protegidas
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Método para obtener todos los libros desde la API.
   * Endpoint: http://localhost:8000/api/catalogo/libros/
   */
  cargarTodosLosLibros(): Observable<Libro[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Libro[]>(`${API_URL}/libros/`, { headers });
  }

  /**
   * Método para buscar libros con token.
   * Endpoint: http://localhost:8000/api/catalogo/libros/?search={query}
   */
  buscarLibros(query: string): Observable<Libro[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Libro[]>(`${API_URL}/libros/?search=${query}`, { headers });
  }

  /**
   * ⭐ NUEVO MÉTODO ⭐
   * Método para eliminar un libro por su ID. Requiere autorización.
   * Endpoint: DELETE http://localhost:8000/api/catalogo/libros/{libroId}/
   * @param libroId El ID del libro a eliminar.
   */
  eliminarLibro(libroId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    // Se utiliza el endpoint específico del libro: /libros/{id}/
    return this.http.delete<any>(`${API_URL}/libros/${libroId}/`, { headers });
  }
}