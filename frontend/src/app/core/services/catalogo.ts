// frontend/src/app/core/services/catalogo.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; 

const API_BASE_URL = 'http://127.0.0.1:8000/api/catalogo'; 

// 💡 CORRECCIÓN: Se añade el campo 'imagen_url' al modelo Libro
export interface Libro {
  id: number;
  titulo: string;
  autor_nombre: string;
  categoria_nombre: string;
  isbn: string;
  copias_disponibles: number;
  imagen_url: string; // 💡 ¡CRUCIAL! Este campo es necesario para el frontend
}

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  constructor(private http: HttpClient) { }

  getLibros(): Observable<Libro[]> {
    // 💡 Método para obtener todos los libros
    return this.http.get<Libro[]>(`${API_BASE_URL}/libros/`);
  }
  
  // 💡 Implementación de Búsqueda (Futuro)
  buscarLibros(query: string): Observable<Libro[]> {
    // Django REST Framework usa query params para la búsqueda.
    // Asumiendo que has configurado `search_fields` en tu ViewSet.
    return this.http.get<Libro[]>(`${API_BASE_URL}/libros/?search=${query}`);
  }
}