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
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Método para obtener todos los libros desde la API con token
  cargarTodosLosLibros(): Observable<Libro[]> {
    const headers = this.getAuthHeaders();
    // La ruta ahora es: API_URL + '/libros/' 
    // Que resulta en: 'http://localhost:8000/api/catalogo/libros/'
    return this.http.get<Libro[]>(`${API_URL}/libros/`, { headers });
  }

  // Método para buscar libros con token (mismo ajuste)
  buscarLibros(query: string): Observable<Libro[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Libro[]>(`${API_URL}/libros/?search=${query}`, { headers });
  }
  
  // Agrega más métodos aquí (crearLibro, actualizarLibro, eliminarLibro)
}