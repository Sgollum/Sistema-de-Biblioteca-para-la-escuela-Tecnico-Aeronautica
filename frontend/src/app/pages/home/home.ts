import { Component, OnInit, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { Libro } from '../../core/models/libro.model';
import { CatalogoService } from '../../core/services/catalogo';
import { AuthService } from '../../core/services/auth.service';
import { PrestamosService } from '../../core/services/prestamos.service';

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

    // Estado UI
    isLoading: boolean = false;
    errorMessage: string | null = null;

    // Datos del usuario autenticado
    userId: number | null = null;

    // Services
    private catalogoService = inject(CatalogoService);
    private authService = inject(AuthService);
    private prestamosService = inject(PrestamosService);

    ngOnInit(): void {
        this.currentRole = this.authService.getCurrentUserRole();
        this.obtenerUsuarioActual();
        this.cargarLibros();
    }

    /**
     * Obtiene el ID real del usuario desde /api/usuarios/me/
     */
    obtenerUsuarioActual(): void {
        this.authService.fetchUserInfo().subscribe({
            next: (data: any) => {
                // Debe contener { id, username, rol }
                this.userId = data.id;
            },
            error: () => {
                console.warn("No se pudo obtener el usuario actual");
                this.userId = null;
            }
        });
    }

    /**
     * Carga todos los libros.
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
                this.errorMessage = `Error ${err.status}: No se pudo cargar el catálogo.`;
                console.error('Error al cargar libros:', err);

                this.libros = this.getMockLibros();
                this.totalLibros = this.libros.length;
            }
        });
    }

    /**
     * Búsqueda de libros
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
                this.libros = [];
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

    /**
     * ⭐⭐⭐ Solicitar préstamo
     */
    solicitarPrestamo(libro: Libro): void {
        if (!this.userId) {
            alert("Debes iniciar sesión para solicitar un préstamo.");
            return;
        }

        this.prestamosService.solicitarPrestamo(this.userId, libro.id).subscribe({
            next: () => {
                alert(`Solicitud enviada para el libro: ${libro.titulo}`);
            },
            error: (err) => {
                console.error("Error al solicitar préstamo:", err);

                if (err.error?.error === "No hay stock") {
                    alert("No hay copias disponibles.");
                } else {
                    alert("Error al enviar la solicitud.");
                }
            }
        });
    }

    eliminarLibro(libroId: number): void {
        if (!confirm('¿Está seguro de eliminar este libro del catálogo?')) {
            return;
        }

        this.catalogoService.eliminarLibro(libroId).subscribe({
            next: () => {
                alert('Libro eliminado exitosamente.');
                this.cargarLibros();
            },
            error: (err: HttpErrorResponse) => {
                console.error('Error al eliminar libro:', err);
                this.errorMessage = `Error al eliminar: ${err.statusText}`;
            }
        });
    }

    // Fallback de imagen
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
                imagen_url: 'https://images.placeholders.dev/cdn-cgi/image/width=150,height=250/placeholder.jpg'
            },
            {
                id: 2,
                titulo: 'El Quijote',
                autor_nombre: 'Cervantes',
                categoria_nombre: 'Clásico',
                isbn: '978-8424117865',
                copias_disponibles: 0,
                imagen_url: 'URL_INCORRECTA_QUE_FALLARA_PARA_PROBAR_EL_ERROR'
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
