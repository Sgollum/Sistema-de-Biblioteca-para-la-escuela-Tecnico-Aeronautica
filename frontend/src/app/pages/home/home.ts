import { Component, OnInit, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http'; // Importamos para manejo de errores

import { Libro } from '../../core/models/libro.model';
import { CatalogoService } from '../../core/services/catalogo';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './home.html',
    styleUrls: ['./home.css'],
    encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

    libros: Libro[] = [];
    searchQuery: string = '';
    totalLibros: number = 0;
    currentRole: string | null = null;
    
    // ⭐ Variables de estado añadidas
    isLoading: boolean = false;
    errorMessage: string | null = null;
    
    private catalogoService = inject(CatalogoService);
    private authService = inject(AuthService);

    ngOnInit(): void {
        this.currentRole = this.authService.getCurrentUserRole();
        this.cargarLibros();
    }

    /**
     * Carga todos los libros o, si hay un query, realiza una búsqueda.
     */
    cargarLibros(): void {
        this.isLoading = true;
        this.errorMessage = null;

        this.catalogoService.cargarTodosLosLibros().subscribe({
            next: (data) => {
                this.libros = data;
                this.totalLibros = data.length;
                this.isLoading = false;
            },
            error: (err: HttpErrorResponse) => {
                this.isLoading = false;
                this.errorMessage = `Error ${err.status}: No se pudo cargar el catálogo. Mostrando datos de prueba.`;
                console.error('Error al cargar libros:', err);
                // Usar datos de prueba en caso de fallo de API
                this.libros = this.getMockLibros();
                this.totalLibros = this.libros.length;
            }
        });
    }

    /**
     * Maneja la acción de búsqueda.
     */
    buscarLibros(): void {
        const query = this.searchQuery.trim().toLowerCase();
        
        if (!query) {
            this.cargarLibros();
            return;
        }
        
        this.isLoading = true;
        this.errorMessage = null;

        this.catalogoService.buscarLibros(query).subscribe({
            next: (data) => {
                this.libros = data;
                this.totalLibros = data.length;
                this.isLoading = false;
            },
            error: (err: HttpErrorResponse) => {
                this.isLoading = false;
                this.libros = []; // Limpiar lista al haber error de búsqueda
                this.totalLibros = 0;
                this.errorMessage = `Error ${err.status}: Fallo al ejecutar la búsqueda.`;
                console.error('Error al buscar libros:', err);
            }
        });
    }

    onSearchChange(): void {
      if (!this.searchQuery) {
        this.cargarLibros();
      }
    }
    
    eliminarLibro(libroId: number): void {
        // Usar un modal o un mensaje de confirmación en lugar de alert/confirm si fuera un entorno de producción
        if (!confirm('¿Está seguro de eliminar este libro del catálogo?')) {
            return;
        }

        this.catalogoService.eliminarLibro(libroId).subscribe({
            next: () => {
                alert('Libro eliminado exitosamente.'); // Se mantiene 'alert' por convención de entorno
                this.cargarLibros(); 
            },
            error: (err: HttpErrorResponse) => {
                console.error('Error al eliminar libro:', err);
                this.errorMessage = `Error al eliminar: ${err.statusText}`;
            }
        });
    }

    // ⭐⭐⭐ FALLBACK PARA IMÁGENES
    onImageError(event: any): void {
        event.target.src = 'https://placehold.co/400x600/CCCCCC/333333?text=No+Cover';
    }
    
    /**
     * Datos de prueba para simular fallos de API.
     */
    private getMockLibros(): Libro[] {
        return [
            {
                id: 1,
                titulo: 'Cien Años de Soledad',
                autor_nombre: 'García Márquez',
                categoria_nombre: 'Ficción',
                isbn: '978-0307474771',
                copias_disponibles: 5,
                
                
                imagen_url: 'https://images.placeholders.dev/cdn-cgi/image/width=150,height=250/placeholder.jpg'
            },
            {
                id: 2,
                titulo: 'El Quijote',
                autor_nombre: 'Cervantes',
                categoria_nombre: 'Clásico',
                isbn: '978-8424117865',
                copias_disponibles: 0,
                
                
                imagen_url: 'URL_INCORRECTA_QUE_FALLARA_PARA_PROBAR_EL_ERROR' // Fallback se activará aquí
            },
            {
                id: 3,
                titulo: 'Fundación',
                autor_nombre: 'Isaac Asimov',
                categoria_nombre: 'Ciencia Ficción',
                isbn: '978-8445075191',
                copias_disponibles: 12,
                
                
                imagen_url: 'https://placehold.co/400x600/000000/FFFFFF?text=FOUNDATION'
            }
        ];
    }
}


