import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { HttpClient, HttpClientModule, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs'; // Para usar promesas con HttpClient

// Interfaz Libro (Basada en tu modelo: src/app/core/models/libro.model.ts)
export interface Libro {
    id: number;
    titulo: string;
    autor_nombre: string;
    categoria_nombre: string;
    isbn: string;
    copias_disponibles: number; // Campo clave para prestar
    imagen_url?: string; 
}

// Interfaz para un préstamo activo, tal como lo devuelve la API de MS_Prestamos
interface PrestamoActivo {
  id: number;
  libro: {
    id: number;
    titulo: string;
    autor_nombre: string;
  }; // Datos básicos del libro prestado
  usuario: { id: number, identificador: string, nombre: string }; // Datos básicos del prestatario
  fecha_prestamo: string; // 'YYYY-MM-DD'
  fecha_devolucion_limite: string; // 'YYYY-MM-DD'
  estado: string; // Ej: 'ACTIVO', 'VENCIDO'
}

// Interfaz para la solicitud de un nuevo préstamo a la API
interface PrestamoRequest {
  libro_id: number;
  usuario_identificador: string; // ID o identificador de la persona que pide el libro
  fecha_devolucion_limite: string;
}

@Component({
  selector: 'app-prestamos',
  standalone: true,
  // IMPORTANTE: HttpClientModule debe estar aquí
  imports: [CommonModule, FormsModule, HttpClientModule, DatePipe], 
  templateUrl: './prestamos.html', 
  styleUrls: ['./prestamos.css'], 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrestamosComponent implements OnInit {
  
  // URL BASE (Ajustar según la configuración de tu microservicio de préstamos y catálogo)
  // ASUMO que ambas rutas se resuelven desde la misma base si usas un API Gateway
  private apiBaseUrl = 'http://localhost:8000/api/'; 
  
  // --- ESTADO DE DATOS ---
  public inventoryBooks = signal<Libro[]>([]); // Todos los libros del catálogo
  public activeLoans = signal<PrestamoActivo[]>([]); // Préstamos pendientes de devolución
  public filteredBooks = signal<Libro[]>([]); // Libros filtrados que tienen copias_disponibles > 0

  // --- ESTADO DE UI/FORMULARIO ---
  public isLoading = signal(false);
  public searchQuery: string = '';
  public isLoanModalOpen = signal(false);
  public isReturnModalOpen = signal(false);
  public selectedBook = signal<Libro | null>(null);
  public selectedLoan = signal<PrestamoActivo | null>(null);
  
  // Datos del formulario modal de préstamo
  public loanUserData: { identificador: string, fechaLimite: string } = {
    identificador: '',
    fechaLimite: '',
  };
  public todayDate: string = new Date().toISOString().split('T')[0];

  // --- MENSAJES DE ESTADO ---
  public statusMessage = signal<string | null>(null);
  public statusType = signal<'success' | 'error'>('success');
  
  constructor(private http: HttpClient, private router: Router) {
     // Establecer la fecha límite predeterminada (ej: 7 días)
    const defaultReturnDate = new Date();
    defaultReturnDate.setDate(defaultReturnDate.getDate() + 7); 
    this.loanUserData.fechaLimite = defaultReturnDate.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.loadData();
  }
  
  // --- HELPERS DE AUTENTICACIÓN Y HEADER ---

  private getAuthHeaders(): HttpHeaders | null {
    // ASUMIMOS que el token se guarda en localStorage tras el login (e.g., JWT)
    const authToken = localStorage.getItem('authToken'); 
    if (!authToken) {
        // En un entorno real, redirigir al login es esencial
        this.showStatus('ERROR: Token de autenticación no encontrado. Inicie sesión.', 'error');
        return null;
    }
    return new HttpHeaders({
        'Content-Type': 'application/json',
        // Usar 'Bearer' si tu backend Django está configurado para tokens JWT
        'Authorization': `Bearer ${authToken}` 
    });
  }

  showStatus(message: string, type: 'success' | 'error'): void {
    this.statusMessage.set(message);
    this.statusType.set(type);
    setTimeout(() => this.statusMessage.set(null), 5000);
  }

  // --- CARGA DE DATOS ---

  loadData(): void {
    this.isLoading.set(true);
    const headers = this.getAuthHeaders();
    if (!headers) {
      this.isLoading.set(false);
      return;
    }

    // 1. Cargar Inventario (Catálogo completo, incluyendo el campo copias_disponibles)
    // ASUMO: Ruta del Catálogo (MS_Catalogos)
    this.http.get<Libro[]>(`${this.apiBaseUrl}catalogo/libros/`, { headers }).subscribe({
      next: (data) => {
        // No necesitamos calcular la disponibilidad, ya viene en el campo 'copias_disponibles'
        this.inventoryBooks.set(data);
        this.filterBooks(); // Aplicar filtro inicial (mostrar disponibles)
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar inventario:', err);
        this.showStatus(`Error Catálogo: ${err.statusText}`, 'error');
      }
    });

    // 2. Cargar Préstamos Activos
    // ASUMO: Ruta del Microservicio de Préstamos (MS_Prestamos)
    this.http.get<PrestamoActivo[]>(`${this.apiBaseUrl}prestamos/activos/`, { headers }).subscribe({
      next: (data) => {
        // Ordenar por fecha de devolución límite (para ver los vencidos primero)
        data.sort((a, b) => new Date(a.fecha_devolucion_limite).getTime() - new Date(b.fecha_devolucion_limite).getTime());
        this.activeLoans.set(data);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar préstamos activos:', err);
        this.showStatus(`Error Préstamos: ${err.statusText}`, 'error');
        this.isLoading.set(false);
      }
    });
  }

  // --- LÓGICA DE BÚSQUEDA Y UI ---

  filterBooks(): void {
    const query = this.searchQuery.toLowerCase().trim();
    const allBooks = this.inventoryBooks();
    
    if (!query) {
      // Por defecto, mostrar solo los disponibles
      this.filteredBooks.set(allBooks.filter(b => b.copias_disponibles > 0));
      return;
    }
    
    const filtered = allBooks.filter(libro => 
      (libro.copias_disponibles > 0) && ( // Solo filtramos libros disponibles
        (libro.titulo && libro.titulo.toLowerCase().includes(query)) ||
        (libro.autor_nombre && libro.autor_nombre.toLowerCase().includes(query)) ||
        (libro.isbn && libro.isbn.includes(query))
      )
    );
    this.filteredBooks.set(filtered);
  }

  openLoanModal(libro: Libro): void {
    if (libro.copias_disponibles <= 0) {
      this.showStatus('No hay copias disponibles para prestar.', 'error');
      return;
    }
    this.selectedBook.set(libro);
    this.loanUserData.identificador = '';
    this.isLoanModalOpen.set(true);
  }

  closeLoanModal(): void {
    this.isLoanModalOpen.set(false);
    this.selectedBook.set(null);
  }
  
  openReturnModal(loan: PrestamoActivo): void {
    this.selectedLoan.set(loan);
    this.isReturnModalOpen.set(true);
  }
  
  closeReturnModal(): void {
    this.isReturnModalOpen.set(false);
    this.selectedLoan.set(null);
  }


  // --- LÓGICA DE OPERACIONES (PRESTAMO Y DEVOLUCION) ---

  async registerLoan(): Promise<void> {
    const book = this.selectedBook();
    if (!book || !this.loanUserData.identificador || !this.loanUserData.fechaLimite) {
      this.showStatus('Faltan datos para registrar el préstamo.', 'error');
      return;
    }
    
    if (book.copias_disponibles <= 0) {
      this.showStatus('Error: El libro no tiene copias disponibles al momento de registrar.', 'error');
      return;
    }
    
    this.isLoading.set(true);
    this.closeLoanModal(); 
    const headers = this.getAuthHeaders();
    if (!headers) {
      this.isLoading.set(false);
      return;
    }

    try {
      const loanRequest: PrestamoRequest = {
        libro_id: book.id,
        usuario_identificador: this.loanUserData.identificador,
        fecha_devolucion_limite: this.loanUserData.fechaLimite,
      };
      
      // ASUMO: Ruta para crear préstamos (MS_Prestamos)
      const loanUrl = `${this.apiBaseUrl}prestamos/crear/`;
      
      // Usamos lastValueFrom para manejar el async/await
      await lastValueFrom(this.http.post(loanUrl, loanRequest, { headers })); 

      this.showStatus(`Préstamo de "${book.titulo}" registrado exitosamente.`, 'success');
      this.loadData(); // Recargar datos para actualizar la UI
    } catch (error) {
      console.error('Error registrando préstamo:', error);
      const httpError = error as HttpErrorResponse;
      // Mostrar un mensaje de error detallado si es posible
      const errorDetail = httpError.error?.detail || httpError.error?.message || httpError.statusText;
      this.showStatus(`Error al registrar préstamo: ${errorDetail}`, 'error');
    } finally {
      this.isLoading.set(false);
    }
  }

  async processReturn(): Promise<void> {
    const loan = this.selectedLoan();
    if (!loan) {
        this.showStatus('Error: No se seleccionó ningún préstamo para devolver.', 'error');
        return;
    }
    
    this.isLoading.set(true);
    this.closeReturnModal();
    const headers = this.getAuthHeaders();
    if (!headers) {
      this.isLoading.set(false);
      return;
    }

    try {
      // ASUMO: Ruta para marcar el préstamo como devuelto (MS_Prestamos)
      const returnUrl = `${this.apiBaseUrl}prestamos/${loan.id}/devolver/`; 
      
      // La mayoría de las APIs REST usan POST o PUT para acciones, o DELETE para eliminar el registro
      // Usaremos POST para la acción 'devolver'
      await lastValueFrom(this.http.post(returnUrl, {}, { headers }));

      this.showStatus(`Devolución de "${loan.libro.titulo}" registrada con éxito.`, 'success');
      this.loadData(); // Recargar datos para actualizar la UI
    } catch (error) {
      console.error('Error registrando devolución:', error);
      const httpError = error as HttpErrorResponse;
      const errorDetail = httpError.error?.detail || httpError.error?.message || httpError.statusText;
      this.showStatus(`Error al registrar devolución: ${errorDetail}`, 'error');
    } finally {
      this.isLoading.set(false);
    }
  }
  
  /**
   * Verifica si la fecha límite ha pasado.
   */
  isOverdue(dateString: string): boolean {
    const limitDate = new Date(dateString);
    limitDate.setHours(23, 59, 59, 999); // Incluir todo el día límite
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Comparar solo la fecha, no la hora actual
    // Vencido si la fecha límite es estrictamente anterior a hoy
    return limitDate.getTime() < today.getTime(); 
  }
  
  goBack(): void {
    // ASUMO que esta es la ruta para volver al panel del bibliotecario
    this.router.navigate(['/bibliotecario-dashboard']);
  }
}