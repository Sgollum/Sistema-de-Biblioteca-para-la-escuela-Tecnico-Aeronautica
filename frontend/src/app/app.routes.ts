import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing';
import { LoginComponent } from './pages/login/login';
import { HomeComponent } from './pages/home/home'; 
import { RegisterComponent } from './pages/register/register'; 
import { LibroFormComponent } from './pages/libro-form/libro-form'; 
// Importaciones de Dashboards
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard';
import { BibliotecarioDashboardComponent } from './pages/bibliotecario-dashboard/bibliotecario-dashboard';
import { LectorDashboardComponent } from './pages/lector-dashboard/lector-dashboard';
// Importaciones de Gestión de Usuarios
import { Layout } from './shared/layout/layout';
import { GestionUsuariosComponent } from './pages/gestion-usuarios/gestion-usuarios'; 
import { UsuarioForm } from './pages/usuario-form/usuario-form'; 

export const routes: Routes = [
    // 1. Rutas Públicas (Sin Layout)
    { 
        // CRÍTICO: Redirige la raíz a 'landing' si no hay una coincidencia completa.
        path: '', 
        redirectTo: 'landing', 
        pathMatch: 'full' 
    },
    {
        path: 'landing', 
        component: LandingComponent,
        title: 'Bienvenido a Mi Biblioteca DGAC'
    },
    {
        path: 'login',
        component: LoginComponent,
        title: 'Iniciar Sesión'
    },
    {
        path: 'register', 
        component: RegisterComponent, 
        title: 'Registro de Usuarios',
    },
    
    // 2. Ruta Protegida: USA Layout como Contenedor Principal (Shell)
    {
        path: '', // Se usa path vacío para que el componente hijo se cargue en la raíz lógica (ej. /admin-dashboard)
        component: Layout, 
        // canActivate: [AuthGuard], // Descomentar para aplicar protección
        children: [
            // CRÍTICO: Redirige la ruta vacía *dentro del layout* al dashboard por defecto (ej. Catálogo)
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            
            // Dashboard Lector/Catálogo General
            {
                path: 'dashboard', 
                component: HomeComponent,
                title: 'Catálogo de Libros',
            },
            
            // Dashboard Lector (Mi Cuenta/Préstamos)
            {
                path: 'lector-dashboard', 
                component: LectorDashboardComponent,
                title: 'Mi Cuenta - Lector',
            },

            // Dashboard Administrador (TU RUTA CONFLICTIVA)
            {
                path: 'admin-dashboard', 
                component: AdminDashboardComponent,
                title: 'Panel de Administrador'
            },
            
            // --- GESTIÓN DE USUARIOS (CRUD COMPLETO) ---
            {
                path: 'gestion-usuarios', 
                component: GestionUsuariosComponent, 
                title: 'Gestión de Usuarios'
            },
            {
                path: 'crear-usuario',
                component: UsuarioForm, 
                title: 'Crear Nuevo Usuario'
            },
            {
                path: 'editar-usuario/:id', 
                component: UsuarioForm,
                title: 'Editar Usuario'
            },
            
            // Dashboard Bibliotecario
            {
                path: 'bibliotecario-dashboard', 
                component: BibliotecarioDashboardComponent,
                title: 'Panel de Bibliotecario'
            },
            
            // Gestión de Libros (CRUD)
            {
                path: 'crear-libro',
                component: LibroFormComponent,
                title: 'Crear Nuevo Libro'
            },
            {
                path: 'editar-libro/:id', // Con el ID dinámico
                component: LibroFormComponent,
                title: 'Editar Libro'
            },
        ]
    },

    // 3. Ruta Comodín (Siempre al final)
    {
        path: '**',
        redirectTo: ''
    }
];