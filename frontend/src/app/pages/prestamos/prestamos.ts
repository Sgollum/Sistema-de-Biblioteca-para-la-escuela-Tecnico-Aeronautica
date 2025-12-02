import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Definición de Tipos
interface Libro {
  id: number;
  titulo: string;
  autor_nombre: string;
  isbn: string;
  copias_disponibles: number;
}

interface PrestamoActivo {
  id: number;
  libro: Libro;
  usuario_identificador: string;
  fecha_prestamo: string;
  fecha_devolucion_limite: string;
  usuario: {
    id: number;
    identificador: string;
    nombre: string;
  };
}

@Component({
  selector: 'app-prestamos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prestamos.html',
  styleUrl: './prestamos.css',
})
export class PrestamosComponent implements OnInit {
  // Configuración
  private API_URL = 'http://localhost:8000/api/';
  private router = inject(Router);
  private http = inject(HttpClient);
  private authToken = '';
  
  // -- Señales de Estado y Datos --
  inventory = signal<Libro[]>([]);
  activeLoans = signal<PrestamoActivo[]>([]);
  searchQuery = signal('');
  isLoading = signal(true);
  
  // Modal de Préstamo
  showLoanModal = signal(false);
  selectedBook = signal<Libro | null>(null);
  loanDetails = signal({
    usuario_identificador: '',
    fecha_devolucion_limite: this.getTwoWeeksFromNow(),
  });
  
  // Modal de Devolución
  showReturnModal = signal(false);
  selectedLoan = signal<PrestamoActivo | null>(null);
  
  // Notificaciones
  successMessage = signal('');
  errorMessage = signal('');
  
  // -- Lógica Computada (Corrección para el template) --

  /** Libros filtrados por el query de búsqueda */
  filteredBooks = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.inventory().filter((book) => {
      // Solo mostrar libros con copias disponibles
      if (book.copias_disponibles <= 0) {
        return false;
      }
      return (
        book.titulo.toLowerCase().includes(query) ||
        book.autor_nombre.toLowerCase().includes(query) ||
        book.isbn.includes(query)
      );
    });
  });

  /** Indica si hay al menos un préstamo vencido */
  isAnyLoanOverdue = computed(() => {
    return this.activeLoans().some(loan => this.isOverdue(loan.fecha_devolucion_limite));
  });

  // -- Métodos de Inicialización --

  ngOnInit(): void {
    // 1. Obtener Token
    this.authToken = localStorage.getItem('authToken') || '';
    if (!this.authToken) {
      this.showError('No se encontró el token de autenticación. Por favor, inicie sesión.');
    }
    // 2. Cargar Datos
    this.loadData();
  }

  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.authToken}`,
    });
  }

  loadData(): void {
    this.isLoading.set(true);
    // 1. Cargar Inventario
    this.http
      .get<Libro[]>(`${this.API_URL}catalogo/libros/`, { headers: this.getHeaders() })
      .subscribe({
        next: (data) => {
          this.inventory.set(data);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error al cargar inventario:', err);
          this.showError('Error al cargar el inventario de libros.');
          this.isLoading.set(false);
        },
      });

    // 2. Cargar Préstamos Activos
    this.http
      .get<PrestamoActivo[]>(`${this.API_URL}prestamos/activos/`, {
        headers: this.getHeaders(),
      })
      .subscribe({
        next: (data) => {
          this.activeLoans.set(data);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error al cargar préstamos activos:', err);
          this.showError('Error al cargar los préstamos activos.');
          this.isLoading.set(false);
        },
      });
  }

  // -- Métodos Utilitarios --

  /** Calcula la fecha límite (dos semanas a partir de ahora) */
  getTwoWeeksFromNow(): string {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toISOString().split('T')[0];
  }

  /** Comprueba si una fecha es anterior a hoy */
  isOverdue(dueDate: string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    return due < today;
  }

  /** Formatea la fecha para mostrarla en la tabla */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  // -- Control de Modales --

  openLoanModal(book: Libro): void {
    if (book.copias_disponibles <= 0) {
      this.showError('No hay copias disponibles para este libro.');
      return;
    }
    this.selectedBook.set(book);
    this.loanDetails.set({
      usuario_identificador: '',
      fecha_devolucion_limite: this.getTwoWeeksFromNow(),
    });
    this.showLoanModal.set(true);
  }

  closeLoanModal(): void {
    this.showLoanModal.set(false);
    this.selectedBook.set(null);
  }

  openReturnModal(loan: PrestamoActivo): void {
    this.selectedLoan.set(loan);
    this.showReturnModal.set(true);
  }

  closeReturnModal(): void {
    this.showReturnModal.set(false);
    this.selectedLoan.set(null);
  }

  // -- Operaciones de Préstamo --

  registerLoan(): void {
    if (!this.selectedBook() || !this.loanDetails().usuario_identificador) {
      this.showError('Faltan datos para registrar el préstamo.');
      return;
    }

    const payload = {
      libro_id: this.selectedBook()!.id,
      usuario_identificador: this.loanDetails().usuario_identificador,
      fecha_devolucion_limite: this.loanDetails().fecha_devolucion_limite,
    };

    this.isLoading.set(true);
    this.http
      .post(`${this.API_URL}prestamos/crear/`, payload, {
        headers: this.getHeaders(),
      })
      .subscribe({
        next: () => {
          this.showSuccess(
            `Préstamo de "${this.selectedBook()!.titulo}" registrado exitosamente.`
          );
          this.closeLoanModal();
          this.loadData(); // Recargar datos
        },
        error: (err) => {
          console.error('Error al registrar préstamo:', err);
          this.showError('Fallo al registrar el préstamo. Verifique el ID de usuario.');
          this.isLoading.set(false);
        },
      });
  }

  // -- Operaciones de Devolución --

  processReturn(): void {
    const loan = this.selectedLoan();
    if (!loan) {
      this.showError('Error: No se seleccionó ningún préstamo para devolver.');
      return;
    }

    this.isLoading.set(true);
    this.http
      .post(`${this.API_URL}prestamos/${loan.id}/devolver/`, {}, {
        headers: this.getHeaders(),
      })
      .subscribe({
        next: () => {
          this.showSuccess(
            `Devolución de "${loan.libro.titulo}" procesada exitosamente.`
          );
          this.closeReturnModal();
          this.loadData(); // Recargar datos
        },
        error: (err) => {
          console.error('Error al procesar devolución:', err);
          this.showError('Fallo al procesar la devolución.');
          this.isLoading.set(false);
        },
      });
  }
  
  // -- Control de Navegación --
  
  goBack(): void {
    this.router.navigate(['/bibliotecario-dashboard']);
  }

  // -- Notificaciones --

  showSuccess(message: string): void {
    this.successMessage.set(message);
    setTimeout(() => this.successMessage.set(''), 5000);
  }

  showError(message: string): void {
    this.errorMessage.set(message);
    setTimeout(() => this.errorMessage.set(''), 5000);
  }
}