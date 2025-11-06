// frontend/src/app/pages/home/home.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterLink } from '@angular/router'; 
import { FormsModule } from '@angular/forms'; // NECESARIO para [(ngModel)]

// 💡 Importamos la interfaz Libro y el CatalogoService del archivo de servicio
import { CatalogoService, Libro } from '../../core/services/catalogo'; 

@Component({
  selector: 'app-home',
  standalone: true,
  // 💡 AÑADIR FormsModule para el input de búsqueda
  imports: [CommonModule, RouterLink, FormsModule], 
  templateUrl: './home.html', 
  styleUrls: ['./home.css'] 
})
export class HomeComponent implements OnInit { 
  
  libros: Libro[] = []; 
  isLoading = true;
  error: string | null = null;
  
  // 💡 Variable que enlaza el input de búsqueda
  searchTerm: string = ''; 

  constructor(private catalogoService: CatalogoService) {} 
  
  ngOnInit(): void {
    // 💡 Al iniciar, cargamos la lista completa
    this.cargarLibros();
  }
  
  cargarLibros(query: string = ''): void {
    this.isLoading = true;
    this.error = null;
    
    // Si hay un término de búsqueda, usamos el método 'buscarLibros'; si no, 'getLibros'.
    const observable = query 
      ? this.catalogoService.buscarLibros(query) 
      : this.catalogoService.getLibros();
      
    observable.subscribe({
      next: (data) => {
          this.libros = data;
          this.isLoading = false;
      },
      error: (err) => {
          console.error('Error al cargar/buscar libros:', err);
          this.error = 'No se pudieron cargar los datos del catálogo.';
          this.isLoading = false;
      }
    });
  }

  // 💡 NUEVA FUNCIÓN: Se ejecuta al presionar 'Enter' o al cambiar el input
  onSearch(): void {
    // 💡 Llama a cargarLibros con el término actual. 
    // Si searchTerm es vacío, cargará la lista completa.
    this.cargarLibros(this.searchTerm);
  }
}