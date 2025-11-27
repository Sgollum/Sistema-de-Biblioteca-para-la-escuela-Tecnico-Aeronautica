import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// Importamos HttpHeaders para enviar el token
import { HttpClient, HttpClientModule, HttpErrorResponse, HttpHeaders } from '@angular/common/http'; 
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// Interfaces para los datos que manejaremos
interface LibroData {
  titulo: string;
  isbn: string;
  fecha_publicacion: string; // 'YYYY-MM-DD'
  autor: number;             // ID del Autor
  categoria: number;         // ID de la Categoría
  copias_totales: number;
  imagen_url: string;
}

interface SelectItem {
  id: number;
  nombre: string;
  apellido?: string; 
}


@Component({
  selector: 'app-libro-form',
  // Si usas standalone, debes añadir el flag y las importaciones
  standalone: true, 
  imports: [
    CommonModule,         // Para *ngIf, *ngFor, etc.
    ReactiveFormsModule,  // Habilita [formGroup], formControlName, [ngValue]
    HttpClientModule      // Habilita HttpClient
  ], 
  templateUrl: './libro-form.html',
  styleUrls: ['./libro-form.css'],
})
export class LibroFormComponent implements OnInit {
  libroForm: FormGroup;
  
  // URL BASE VERIFICADA CON TUS RUTAS
  private apiBaseUrl = 'http://localhost:8000/api/catalogo/'; 
  
  autores: SelectItem[] = [];
  categorias: SelectItem[] = [];

  isLoading: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  
  constructor(
    private fb: FormBuilder, 
    private http: HttpClient, 
    private router: Router
  ) {
    this.libroForm = this.fb.group({
      titulo: ['', Validators.required],
      isbn: ['', [Validators.required, Validators.maxLength(13)]],
      fecha_publicacion: ['', Validators.required],
      autor: [null, Validators.required],
      categoria: [null, Validators.required],
      copias_totales: [1, [Validators.required, Validators.min(1)]],
      imagen_url: [''],
    });
  }

  ngOnInit(): void {
    this.loadSelectData();
  }
  
  /**
   * Carga los datos de Autores y Categorías (públicos).
   */
  private loadSelectData(): void {
      
      // 1. Cargar Autores
      const autoresUrl = `${this.apiBaseUrl}autores/`;
      this.http.get<any[]>(autoresUrl).subscribe({
          next: (data) => {
              if (Array.isArray(data)) {
                  this.autores = data.map(a => ({
                      id: a.id,
                      nombre: a.nombre,
                      apellido: a.apellido 
                  }));
                  console.log('Autores cargados:', this.autores.length);
              } else {
                  console.error('El endpoint de autores no devolvió una lista, sino:', data);
              }
          },
          error: (err: HttpErrorResponse) => {
              console.error(`ERROR: Fallo al cargar autores desde: ${autoresUrl}`, err);
              this.errorMessage = `Error al cargar autores. Código: ${err.status}`;
          }
      });
      
      // 2. Cargar Categorías
      const categoriasUrl = `${this.apiBaseUrl}categorias/`;
      this.http.get<SelectItem[]>(categoriasUrl).subscribe({
          next: (data) => {
            if (Array.isArray(data)) {
                this.categorias = data;
                console.log('Categorías cargadas:', this.categorias.length);
            } else {
                console.error('El endpoint de categorías no devolvió una lista, sino:', data);
            }
          },
          error: (err: HttpErrorResponse) => {
            console.error(`ERROR: Fallo al cargar categorías desde: ${categoriasUrl}`, err);
            if (!this.errorMessage) {
                 this.errorMessage = `Error al cargar categorías. Código: ${err.status}`;
            }
          }
      });
  }


  /**
   * Maneja el envío del formulario para crear un nuevo libro.
   */
  onSubmit(): void {
    this.successMessage = null;
    this.errorMessage = null;

    if (this.libroForm.invalid) {
      this.errorMessage = 'Por favor, completa todos los campos obligatorios y verifica las validaciones.';
      this.libroForm.markAllAsTouched();
      return;
    }
    
    // --- LÓGICA DE AUTENTICACIÓN ---
    const authToken = localStorage.getItem('authToken'); // Obtener el token guardado
    
    if (!authToken) {
        this.errorMessage = 'ERROR: No se encontró el token de autenticación. Por favor, inicia sesión de nuevo.';
        this.isLoading = false;
        return;
    }
    
    // 💡 Crear los headers incluyendo el token en formato Bearer
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}` // CRÍTICO: Envío del token
    });
    // --- FIN LÓGICA DE AUTENTICACIÓN ---
    
    this.isLoading = true;

    const formData: LibroData = this.libroForm.value;
    const librosUrl = `${this.apiBaseUrl}libros/`;

    // Pasamos el objeto de configuración que contiene los headers
    this.http.post<LibroData>(librosUrl, formData, { headers: headers }).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = `Libro "${response.titulo}" agregado exitosamente.`;
        this.libroForm.reset({ copias_totales: 1, autor: null, categoria: null }); // Limpia y restablece el contador y selects
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        console.error('Error al registrar el libro:', error);
        
        if (error.status === 401 || error.status === 403) {
            this.errorMessage = 'Permiso Denegado: Asegúrate de haber iniciado sesión como Bibliotecario o Administrador.';
        } else if (error.status === 400 && error.error) {
           let errorDetail = 'Error de validación del servidor: ';
           // Itera sobre los campos con error (ej: ISBN duplicado)
           for (const key in error.error) {
               // Muestra el mensaje de error de Django.
               const messages = Array.isArray(error.error[key]) ? error.error[key].join(' ') : error.error[key];
               errorDetail += `${key.toUpperCase()}: ${messages}. `;
           }
           this.errorMessage = errorDetail;
        } else {
           this.errorMessage = `Ocurrió un error inesperado al conectar con el servidor. Código: ${error.status}`;
        }
      }
    });
  }
  
  /**
   * Ayuda visual para la plantilla HTML para mostrar errores.
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.libroForm.get(fieldName);
    // Válido si el campo existe, es inválido y ha sido tocado o modificado
    return !!field && field.invalid && (field.dirty || field.touched);
  }
  
  goBack(): void {
    // Redirigir a la ruta que muestre el dashboard del bibliotecario
    this.router.navigate(['/bibliotecario-dashboard']);
  }
}