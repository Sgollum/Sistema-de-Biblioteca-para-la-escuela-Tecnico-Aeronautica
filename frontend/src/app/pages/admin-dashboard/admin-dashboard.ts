import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders, HttpErrorResponse } from '@angular/common/http'; 
import { catchError, finalize, switchMap, throwError, tap } from 'rxjs'; 
import { AuthService } from '../../core/services/auth.service'; 

// Interfaz para un usuario (solo necesitamos el tipo para la lista)
interface User {
  id: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService); 
  private apiUrlBase = 'http://localhost:8000'; 

  totalUsuarios: number = 0; 
  alertasSeguridad: number = 0; 
  isLoading: boolean = true;
  errorMessage: string = ''; // Para mostrar errores de autenticación

  constructor() { }

  ngOnInit(): void {
    // Iniciamos el proceso de verificación y carga
    this.verificarAutenticacionYcargarUsuarios();
  }

  /**
   * Intenta obtener la info del usuario. Si falla (401/403), sabe que no está logueado.
   * Si tiene éxito, procede a cargar las estadísticas.
   * Ya no incluye la guardia de 'isLoggedIn' porque causaba el error de timing.
   */
  verificarAutenticacionYcargarUsuarios(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    // 🚨 El código inicia aquí directamente, sin la guardia de isLoggedIn().
    // Si el token es nulo, fetchUserInfo() fallará y el catchError lo manejará.

    // 1. Verificar el token (usando fetchUserInfo). Si el token no existe, esta llamada fallará con 401/403.
    this.authService.fetchUserInfo().pipe(
      // 2. Si la verificación es exitosa, pasamos directamente a cargar los usuarios
      switchMap(() => this.cargarTotalUsuariosAPI()),
      
      // 3. Capturamos cualquier error en la cadena
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          // Si hay 401/403 aquí, el token existe pero el backend lo rechaza
          this.handleAuthFailure('Sesión inválida. Por favor, inicia sesión de nuevo. (Error 401/403 en API)');
        } else {
          console.error('Error al conectar con la API de estadísticas:', error);
          this.errorMessage = 'Error al conectar: ' + (error.message || 'Error desconocido.');
        }
        return throwError(() => error); 
      }),
      // 4. Siempre se ejecuta, sea éxito o error
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
        error: () => {
            // Manejado en el catchError
        }
    });
  }

  /**
   * Realiza la llamada HTTP a /api/usuarios/ con el token.
   */
  private cargarTotalUsuariosAPI() {
      const url = `${this.apiUrlBase}/api/usuarios/`; 
      // El token es recuperado justo antes de la llamada, asegurando que es el más reciente
      const token = this.authService.getToken(); 
      
      const headers = new HttpHeaders({
          'Authorization': token ? `Bearer ${token}` : '', 
          'Content-Type': 'application/json'
      });

      return this.http.get<any>(url, { headers }).pipe(
          tap((response) => {
              // Lógica de conteo basada en el formato DRF
              // Caso 1: DRF Paginado ({ count: 50, results: [...] })
              if (typeof response === 'object' && response !== null && 'count' in response) {
                  this.totalUsuarios = response.count as number;
                  console.log(`Total contado por 'count' (DRF Paginado): ${this.totalUsuarios}`);
              // Caso 2: Lista Directa (un array de objetos)
              } else if (Array.isArray(response)) {
                  this.totalUsuarios = response.length;
                  console.log(`Total contado por longitud de lista (Array): ${this.totalUsuarios}`);
              } else {
                  console.error('Formato de respuesta desconocido. Usando 0.');
                  this.totalUsuarios = 0;
              }
          })
      );
  }

  private handleAuthFailure(message: string): void {
      console.warn('Authentication Check Failed:', message);
      this.errorMessage = message;
      this.totalUsuarios = 0; 
      this.isLoading = false;
      // Puedes añadir aquí la lógica de redirección al login
  }

  crearUsuario(): void {
    // Se mantiene sin cambios
  }
}