import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

// Usamos rutas relativas
import { Libro } from '../../core/models/libro.model'; 
import { CatalogoService } from '../../core/services/catalogo';
import { AuthService } from '../../core/services/auth.service'; 

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './home.html', 
    styleUrls: ['./home.css'],
})
export class HomeComponent implements OnInit {
    libros: Libro[] = [];
    searchQuery: string = '';
    totalLibros: number = 0;
    
    currentRole: string | null = null;
    
    // Inyección de servicios
    private catalogoService = inject(CatalogoService);
    private authService = inject(AuthService);

    ngOnInit(): void {
        this.currentRole = this.authService.getCurrentUserRole();
        this.cargarLibros();
    }

    cargarLibros(): void {
        this.catalogoService.cargarTodosLosLibros().subscribe({
            next: (data) => {
                // ASUMO que la API devuelve un array de objetos Libro
                this.libros = data; 
                this.totalLibros = data.length;
            },
            error: (err) => {
                console.error('Error al cargar los libros desde la API (revisar la ruta y el token):', err);
                this.libros = this.getMockLibros(); 
                this.totalLibros = this.libros.length;
            }
        });
    }

    buscarLibros(): void {
        if (this.searchQuery.trim()) {
            this.catalogoService.buscarLibros(this.searchQuery).subscribe({
                next: (data) => {
                    this.libros = data;
                    this.totalLibros = data.length;
                },
                error: (err) => {
                    console.error('Error al buscar libros:', err);
                }
            });
        } else {
            this.cargarLibros(); 
        }
    }
    
    eliminarLibro(libroId: number): void {
        console.log('Intento de eliminar libro con ID:', libroId);
        // TODO: Aquí llamarías a catalogoService.eliminarLibro(libroId) y luego recargarías la lista
        // this.catalogoService.eliminarLibro(libroId).subscribe(() => this.cargarLibros());
    }

    // Función de FALLBACK: Usa el URL de placehold.co con el tamaño ajustado
    onImageError(event: any): void {
        event.target.src = 'https://placehold.co/400x600/CCCCCC/333333?text=No+Cover'; 
    }


    private getMockLibros(): Libro[] {
        return [
            {
                id: 1,
                titulo: 'Cien Años de Soledad',
                autor_nombre: 'García Márquez',
                categoria_nombre: 'Ficción',
                isbn: '978-0307474771',
                copias_disponibles: 5,
                // Usamos 'imagen_url' como la API debería devolver.
                imagen_url: 'https://images.placeholders.dev/cdn-cgi/image/width=150,height=250/placeholder.jpg' // Ejemplo de URL real
            },
            {
                id: 2,
                titulo: 'El Quijote',
                autor_nombre: 'Cervantes',
                categoria_nombre: 'Clásico',
                isbn: '978-8424117865',
                copias_disponibles: 0,
                // Usamos 'imagen_url' como la API debería devolver.
                imagen_url: 'URL_INCORRECTA_QUE_FALLARA_PARA_PROBAR_EL_ERROR'
            }
        ];
    }
}