import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// ***************************************************************
// DECLARACIONES GLOBALES PARA EL COMPILADOR
// ***************************************************************
declare const __app_id: string;
declare const __firebase_config: string;
declare const __initial_auth_token: string;

// Firebase SDK Modular
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
  Auth,
  User
} from 'firebase/auth';

import {
  getFirestore,
  Firestore,
  collection,
  onSnapshot,
  query,
  getDocs,
  CollectionReference,
  DocumentData,
  QuerySnapshot,
  QueryDocumentSnapshot
} from 'firebase/firestore';

// ------------------------------------------------------------
// Tipos del Dashboard
// ------------------------------------------------------------
interface DashboardStats {
  totalLibros: number;
  librosPrestados: number;
  librosVencidos: number;
  usuariosRegistrados: number;
}

interface ActivityEntry {
  id: number;
  type: 'Préstamo' | 'Devolución' | 'Registro';
  description: string;
  date: string;
  statusColor: string;
  user: string;
}

interface TopBook {
  title: string;
  requests: number;
}

// ------------------------------------------------------------
// Componente
// ------------------------------------------------------------
@Component({
  selector: 'app-bibliotecario-dashboard',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 sm:p-8 bg-gray-100 min-h-screen font-sans">

      <!-- ======================== LOADING ======================== -->
      <div *ngIf="!isAuthReady()" class="flex flex-col justify-center items-center h-[70vh]">
        <svg class="animate-spin h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10"
                  stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"></path>
        </svg>
        <p class="text-lg text-gray-600 mt-4">Cargando información...</p>

        <p *ngIf="dataLoadError()"
           class="text-sm text-red-700 bg-red-100 p-2 mt-2 rounded">
          ⚠ No se pudo conectar a Firestore. Mostrando datos de respaldo.
        </p>
      </div>

      <!-- ======================== DASHBOARD ======================== -->
      <div *ngIf="isAuthReady()">

        <!-- ENCABEZADO -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 border-b-4 pb-4"
             [style.border-color]="ACCENT_COLOR">

          <h1 class="text-4xl font-extrabold text-gray-800" [style.color]="PRIMARY_COLOR">
            Panel de Control del Bibliotecario
          </h1>

          <!-- BOTONES DE ACCIÓN -->
          <div class="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-0">

            <!-- Botón Prestamos -->
            <button (click)="goToLoanManagement()"
                    class="button-action shadow-lg hover:shadow-xl"
                    style="background-color: {{ACCENT_COLOR}};">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Gestionar Préstamos
            </button>

            <!-- Botón Nuevo Libro -->
            <button (click)="goToInventoryForm()"
                    class="button-action shadow-lg hover:shadow-xl"
                    style="background-color: {{PRIMARY_COLOR}};">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 4v16m8-8H4"/>
              </svg>
              Añadir Libro
            </button>
          </div>
        </div>

        <!-- ======================== MÉTRICAS ======================== -->
        <div class="bg-white p-6 md:p-8 rounded-2xl shadow-xl border">
          <h2 class="text-2xl font-semibold mb-6 text-gray-700">
            Métricas Clave del Sistema
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            <!-- Total Libros -->
            <div class="stat-card" [style.border-color]="PRIMARY_COLOR">
              <p class="stat-value">{{ dashboardStats().totalLibros }}</p>
              <p class="stat-label">Total de Libros</p>
            </div>

            <!-- Prestados -->
            <div class="stat-card" style="border-color: #F59E0B;">
              <p class="stat-value">{{ dashboardStats().librosPrestados }}</p>
              <p class="stat-label">Libros Prestados</p>
            </div>

            <!-- Vencidos -->
            <div class="stat-card border-red-500 text-red-600">
              <p class="stat-value">{{ dashboardStats().librosVencidos }}</p>
              <p class="stat-label">Préstamos Vencidos</p>
            </div>

            <!-- Usuarios -->
            <div class="stat-card" [style.border-color]="PRIMARY_COLOR">
              <p class="stat-value">{{ dashboardStats().usuariosRegistrados }}</p>
              <p class="stat-label">Usuarios Registrados</p>
            </div>
          </div>
        </div>

        <!-- ======================== ACTIVIDAD + TOP LIBROS ======================== -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">

          <!-- HISTORIAL ACTIVIDAD -->
          <div class="bg-white p-6 rounded-2xl shadow-xl border lg:col-span-2">
            <h2 class="text-2xl font-semibold mb-6 text-gray-700">
              Actividad Reciente
            </h2>

            <div class="space-y-3 max-h-96 overflow-y-auto pr-2">
              @for (entry of activityLog(); track entry.id) {
                <div class="flex items-center p-3 rounded-lg border-l-4 shadow-sm hover:bg-gray-50"
                     [style.border-color]="entry.statusColor">

                  <div class="mr-4">
                    <span [style.color]="entry.statusColor">
                      ●
                    </span>
                  </div>

                  <div class="flex-grow">
                    <p class="font-medium text-gray-900">{{ entry.description }}</p>
                    <p class="text-xs text-gray-500">
                      {{ entry.date }} • {{ entry.user }}
                    </p>
                  </div>

                  <span class="px-3 py-1 text-xs font-semibold rounded-full ml-4 text-white"
                        [style.background-color]="entry.statusColor">
                    {{ entry.type }}
                  </span>
                </div>
              }
            </div>
          </div>

          <!-- TOP LIBROS -->
          <div class="bg-white p-6 rounded-2xl shadow-xl border">
            <h2 class="text-2xl font-semibold mb-6 text-gray-700">
              Libros Más Solicitados
            </h2>

            <ol class="pl-5 space-y-3 list-decimal">
              @for (book of topBooks(); track book.title) {
                <li class="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                  <span class="font-medium text-gray-800">{{ book.title }}</span>
                  <span class="px-3 py-1 text-xs font-bold rounded-full bg-red-100 text-red-700">
                    {{ book.requests }} Préstamos
                  </span>
                </li>
              }
            </ol>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    /* ======== TARJETAS ======== */
    .stat-card {
      padding: 20px;
      border-left-width: 5px;
      border-radius: 14px;
      background: white;
      border-bottom-width: 2px;
      transition: all 0.2s ease-in-out;
      box-shadow: 0 2px 6px rgba(0,0,0,0.05);
    }
    .stat-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 16px rgba(0,0,0,0.12);
    }
    .stat-value {
      font-size: 2rem;
      font-weight: 800;
    }
    .stat-label {
      font-size: 0.85rem;
      color: #6B7280;
      margin-top: 4px;
    }

    /* ======== BOTONES ======== */
    .button-action {
      @apply px-5 py-2.5 text-white font-bold rounded-lg flex items-center justify-center text-sm;
      transition: all 0.25s ease;
    }
    .button-action:hover {
      transform: translateY(-2px) scale(1.03);
    }
    .button-action:active {
      transform: scale(0.97);
    }
  `]
})
export class BibliotecarioDashboardComponent implements OnInit {

  private router = inject(Router);

  public PRIMARY_COLOR = '#1C3550';
  public ACCENT_COLOR = '#F59E0B';

  public isAuthReady = signal(false);
  public dataLoadError = signal(false);

  private db!: Firestore;
  private auth!: Auth;

  private userId: string | null = null;
  private appId: string = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

  // ------------------------ DATOS ------------------------
  public dashboardStats = signal<DashboardStats>({
    totalLibros: 0,
    librosPrestados: 0,
    librosVencidos: 0,
    usuariosRegistrados: 0,
  });

  private initialStats: DashboardStats = {
    totalLibros: 2150,
    librosPrestados: 185,
    librosVencidos: 12,
    usuariosRegistrados: 875,
  };

  public activityLog = signal<ActivityEntry[]>([
    { id: 1, type: 'Devolución', description: 'Devolución de "Fundamentos de Aeronáutica"', date: 'Hace 5 min', user: 'López R.', statusColor: '#10B981' },
    { id: 2, type: 'Préstamo', description: 'Préstamo de "Normativa DGAC 2024"', date: 'Hace 20 min', user: 'Gutiérrez E.', statusColor: '#F59E0B' },
    { id: 3, type: 'Registro', description: 'Nuevo usuario registrado', date: 'Hace 1 hora', user: 'System', statusColor: '#1C3550' },
  ]);

  public topBooks = signal<TopBook[]>([
    { title: 'Regulaciones de Tráfico Aéreo (Tomo I)', requests: 125 },
    { title: 'Principios de Navegación Aérea', requests: 98 },
    { title: 'Manual de Mantenimiento de Turbinas', requests: 76 },
    { title: 'Gestión de Crisis en Aviación', requests: 62 },
    { title: 'Meteorología para Pilotos', requests: 55 },
  ]);

  // ------------------------ INIT ------------------------
  ngOnInit(): void {
    this.dashboardStats.set(this.initialStats);
    this.initializeFirebase();
  }

  // ------------------------ FIREBASE ------------------------
  async initializeFirebase(): Promise<void> {
    try {
      const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
      const app = initializeApp(firebaseConfig);

      this.db = getFirestore(app);
      this.auth = getAuth(app);

      if (typeof __initial_auth_token !== 'undefined') {
        await signInWithCustomToken(this.auth, __initial_auth_token);
      } else {
        await signInAnonymously(this.auth);
      }

      onAuthStateChanged(this.auth, (user: User | null) => {
        this.userId = user ? user.uid : crypto.randomUUID();
        this.isAuthReady.set(true);
        this.loadDashboardData();
      });

    } catch (error) {
      console.error("Error al inicializar Firebase:", error);
      this.isAuthReady.set(true);
      this.dataLoadError.set(true);
    }
  }

  // ------------------------ CARGA DE DATOS ------------------------
  loadDashboardData(): void {
    if (!this.db) return;

    try {
      const librosPath = `artifacts/${this.appId}/public/data/libros`;
      const librosRef = collection(this.db, librosPath) as CollectionReference<DocumentData>;

      onSnapshot(
        query(librosRef),
        (snapshot: QuerySnapshot<DocumentData>) => {
          let total = 0;
          let prestados = 0;

          snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
            total++;
            prestados += doc.data()['prestadas'] || 0;
          });

          this.dashboardStats.update(s => ({
            ...s,
            totalLibros: total,
            librosPrestados: prestados,
            librosVencidos: this.initialStats.librosVencidos
          }));

          this.loadUserCount();
          this.dataLoadError.set(false);
        },

        (error) => {
          console.error("Error Firestore (libros):", error);
          this.dataLoadError.set(true);
        }
      );

    } catch (e) {
      console.error("Error interno:", e);
      this.dataLoadError.set(true);
    }
  }

  async loadUserCount() {
    if (!this.db) return;

    const usersPath = `artifacts/${this.appId}/public/data/usuarios`;
    const usersRef = collection(this.db, usersPath);

    try {
      const snap = await getDocs(usersRef);

      this.dashboardStats.update(s => ({
        ...s,
        usuariosRegistrados: snap.size
      }));
    } catch (e) {
      console.error("Error al cargar usuarios:", e);
    }
  }

  // ------------------------ NAVEGACIÓN ------------------------
  goToLoanManagement(): void {
    this.router.navigate(['/prestamos']);
  }

  goToInventoryForm(): void {
    this.router.navigate(['/crear-libro']);
  }
}
